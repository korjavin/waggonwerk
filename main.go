// WaggonWerk static server with notify + contact endpoints.
// Single binary, no third-party Go dependencies.

package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"
)

//go:embed all:web
var webFS embed.FS

var emailRE = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

type notifyEntry struct {
	Email string    `json:"email"`
	When  time.Time `json:"when"`
}

type contactEntry struct {
	Topic   string    `json:"topic"`
	Name    string    `json:"name"`
	Email   string    `json:"email"`
	Country string    `json:"country"`
	Message string    `json:"message"`
	When    time.Time `json:"when"`
}

type store struct {
	mu       sync.Mutex
	notifies []notifyEntry
	contacts []contactEntry
	dataDir  string
}

func (s *store) load() {
	if s.dataDir == "" {
		return
	}
	if b, err := os.ReadFile(filepath.Join(s.dataDir, "notify.json")); err == nil {
		_ = json.Unmarshal(b, &s.notifies)
	}
	if b, err := os.ReadFile(filepath.Join(s.dataDir, "contact.json")); err == nil {
		_ = json.Unmarshal(b, &s.contacts)
	}
}

func (s *store) persist(name string, v any) {
	if s.dataDir == "" {
		return
	}
	b, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		return
	}
	tmp := filepath.Join(s.dataDir, name+".tmp")
	final := filepath.Join(s.dataDir, name)
	if err := os.WriteFile(tmp, b, 0o644); err != nil {
		log.Printf("persist %s: %v", name, err)
		return
	}
	_ = os.Rename(tmp, final)
}

func (s *store) addNotify(email string) int {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, n := range s.notifies {
		if strings.EqualFold(n.Email, email) {
			return 412 + len(s.notifies)
		}
	}
	s.notifies = append(s.notifies, notifyEntry{Email: email, When: time.Now().UTC()})
	go s.persist("notify.json", s.notifies)
	return 412 + len(s.notifies)
}

func (s *store) addContact(c contactEntry) {
	s.mu.Lock()
	defer s.mu.Unlock()
	c.When = time.Now().UTC()
	s.contacts = append(s.contacts, c)
	go s.persist("contact.json", s.contacts)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func clip(s string, max int) string {
	s = strings.TrimSpace(s)
	if len(s) > max {
		return s[:max]
	}
	return s
}

func handleNotify(s *store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var body struct {
			Email string `json:"email"`
		}
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<14)).Decode(&body); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "bad json"})
			return
		}
		email := clip(body.Email, 254)
		if !emailRE.MatchString(email) {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid email"})
			return
		}
		count := s.addNotify(email)
		log.Printf("notify: %s (#%d)", email, count)
		writeJSON(w, http.StatusOK, map[string]any{"ok": true, "count": count})
	}
}

func handleContact(s *store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var body contactEntry
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<16)).Decode(&body); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "bad json"})
			return
		}
		body.Email = clip(body.Email, 254)
		body.Name = clip(body.Name, 200)
		body.Country = clip(body.Country, 100)
		body.Topic = clip(body.Topic, 64)
		body.Message = clip(body.Message, 10000)
		if body.Name == "" || body.Message == "" || !emailRE.MatchString(body.Email) {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing fields"})
			return
		}
		s.addContact(body)
		log.Printf("contact: topic=%s from=%q <%s> country=%q (%d chars)",
			body.Topic, body.Name, body.Email, body.Country, len(body.Message))
		writeJSON(w, http.StatusOK, map[string]any{"ok": true, "ref": "WW-K-2026-0413"})
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	dataDir := os.Getenv("DATA_DIR")
	if dataDir == "" {
		dataDir = "/data"
	}
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		log.Printf("data dir %q not writable, persistence disabled: %v", dataDir, err)
		dataDir = ""
	}
	s := &store{dataDir: dataDir}
	s.load()

	staticFS, err := fs.Sub(webFS, "web")
	if err != nil {
		log.Fatalf("embed: %v", err)
	}
	fileServer := http.FileServer(http.FS(staticFS))

	mux := http.NewServeMux()
	mux.HandleFunc("/api/notify", handleNotify(s))
	mux.HandleFunc("/api/contact", handleContact(s))
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// SPA fallback: any unknown path that isn't an asset gets index.html
		p := strings.TrimPrefix(r.URL.Path, "/")
		if p == "" {
			fileServer.ServeHTTP(w, r)
			return
		}
		if _, err := fs.Stat(staticFS, p); err != nil {
			r2 := r.Clone(r.Context())
			r2.URL.Path = "/"
			fileServer.ServeHTTP(w, r2)
			return
		}
		fileServer.ServeHTTP(w, r)
	})

	addr := ":" + port
	log.Printf("WaggonWerk listening on %s (data: %s)", addr, dataDir)
	srv := &http.Server{
		Addr:              addr,
		Handler:           logRequest(mux),
		ReadHeaderTimeout: 10 * time.Second,
	}
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

func logRequest(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		h.ServeHTTP(w, r)
		log.Printf("%s %s %s", r.Method, r.URL.Path, fmt.Sprint(time.Since(start)))
	})
}
