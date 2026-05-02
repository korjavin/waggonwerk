# --- build stage ---
FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod ./
COPY main.go ./
COPY web ./web
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/waggonwerk ./...

# --- runtime stage ---
FROM gcr.io/distroless/static-debian12:nonroot
WORKDIR /app
COPY --from=build /out/waggonwerk /app/waggonwerk
USER nonroot:nonroot
EXPOSE 8080
ENV PORT=8080 DATA_DIR=/data
VOLUME ["/data"]
ENTRYPOINT ["/app/waggonwerk"]
