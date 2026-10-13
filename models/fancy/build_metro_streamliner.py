# Metro streamliner, full size: dieselpunk art-deco loco after the "red streamliner in a
# street canyon" painting. Tall body, round nose, wrap-around window band under an
# overhanging roof, gold belt that flares into wings round a star, low round headlamp,
# skirt down to the bed (no wheels show in the painting either).
#   blender -b -P build_metro_streamliner.py -- <models dir>
# Modelled in v2 units (TtR scale) and scaled by K like full_size_fancy.
# PLA, 0.4 nozzle, no supports: every underside is a >=56 deg chamfer.
import bpy, bmesh, math, sys, os
from math import radians as rad, sin, cos

OUT = sys.argv[sys.argv.index("--") + 1]
DST = f"{OUT}/full_size_fancy/metro"
os.makedirs(DST, exist_ok=True)
NAME = "Metro_Streamliner_FullSize"
K = 20 / 8.4

XR, XN, LN = -12, 7.5, 4.0   # rear face, where the nose starts, nose length
W = 3.3                      # body half width
P = 2.2                        # superellipse power of the nose in plan

parts = []
bpy.ops.wm.read_factory_settings(use_empty=True)

def hull(pts):
    me = bpy.data.meshes.new("h"); bm = bmesh.new()
    for p in pts: bm.verts.new(p)
    bmesh.ops.convex_hull(bm, input=bm.verts); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new("h", me); bpy.context.collection.objects.link(o)
    parts.append(o); return o

def nose_x(y, w=W, d=0):
    """front of the plan outline at side offset y (superellipse cap), pushed out by d"""
    t = min(abs(y) / w, 1)
    return XN + (LN + d) * (1 - t**P) ** (1 / P)

def outline(w, d, n=24):
    """plan outline grown by d: straight sides, rounded rear corners, superellipse nose"""
    ww = w + d
    pts = [(XR - d + 0.6*(1 - cos(a)), s*(ww - 0.6*(1 - sin(a)))) for s in (-1, 1) for a in (0, rad(45), rad(90))]
    pts += [(nose_x(y, ww, d), y) for y in [ww*(2*k/n - 1) for k in range(n + 1)]]
    return pts

def slab(levels):
    """convex body from (z, d) levels: the outline grown by d at height z"""
    return hull([(x, y, z) for z, d in levels for x, y in outline(W, d)])

slab([(0, -0.35), (1.8, -0.35), (2.4, 0), (7.0, 0)])               # skirt, chamfer, lower body
slab([(7.0, -0.3), (8.9, -0.3)])                                   # window band, set back
slab([(8.9, -0.3), (9.35, 0), (9.6, -0.15), (9.95, -0.6), (10.2, -1.3), (10.35, -2.0)])  # overhanging roof, domed
slab([(4.7, 0), (5.1, 0.35), (5.9, 0.35), (6.1, 0)])               # gold belt

# wings: the belt widens towards the nose tip, star sits on it
hull([(nose_x(y, W, 0.35) - 0.05, y, z) for y in (-2.9, -1.5, 0, 1.5, 2.9)
      for z in ((4.7, 6.1) if abs(y) > 2 else (4.3, 6.5) if y else (3.9, 6.85))])
R, r, xs, zs = 1.35, 0.55, nose_x(0, W, 0.35), 5.4
star = [(R if k % 2 == 0 else r, rad(90 + 36*k)) for k in range(10)]
v = [(xs + dx, rr*cos(a), zs + rr*sin(a)) for dx in (-0.3, 0.45) for rr, a in star]
me = bpy.data.meshes.new("star")
me.from_pydata(v, [], [tuple(range(10))[::-1], tuple(range(10, 20))] + [(k, (k+1) % 10, 10 + (k+1) % 10, 10 + k) for k in range(10)])
o = bpy.data.objects.new("star", me); bpy.context.collection.objects.link(o); parts.append(o)

# headlamp: housing + lens, low on the nose
xl = nose_x(0)
bpy.ops.mesh.primitive_cylinder_add(vertices=40, radius=1.1, depth=0.8, location=(xl - 0.1, 0, 2.6), rotation=(0, rad(90), 0)); parts.append(bpy.context.object)
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=0.8, location=(xl + 0.1, 0, 2.6)); parts.append(bpy.context.object)
# coupler box in the skirt
hull([(x, y, z) for x in (XN + LN - 1.2, XN + LN - 0.1) for y in (-0.9, 0.9) for z in (0, 1.2)])
# number box on the roof front, chamfered
hull([(x, y, z) for z, m in ((9.6, 0), (10.9, 0.25)) for x in (XN + 0.8 + m, XN + 2.6 - m) for y in (-0.9 + m, 0.9 - m)])
# window mullions: along the sides, then two on the nose
for s in (-1, 1):
    for x in (-11.0, -8.6, -6.2, -3.8, -1.4, 1.0, 3.4, 5.8):
        hull([(xx, s*yy, z) for xx in (x - 0.18, x + 0.18) for yy in (W - 0.4, W - 0.02) for z in (7.0, 8.9)])
    for y in (1.3, 2.6):
        hull([(nose_x(yy) - d, s*yy, z) for yy in (y - 0.18, y + 0.18) for d in (0.02, 0.5) for z in (7.0, 8.9)])
# side rib below the belt: the painting's vertical seams, as three raised strakes
for s in (-1, 1):
    for z in (3.4, 3.9, 4.4):
        hull([(x, s*y, zz) for x in (-11.3, 6.5) for y, zz in ((W - 0.1, z - 0.15), (W + 0.12, z), (W - 0.1, z + 0.12))])

bpy.ops.object.select_all(action="DESELECT")
for o in parts: o.select_set(True)
bpy.context.view_layer.objects.active = parts[0]
bpy.ops.object.convert(target="MESH"); bpy.ops.object.join()
body = bpy.context.object; body.name = NAME
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
for mod, kw in (("REMESH", dict(mode="VOXEL", voxel_size=0.06)), ("DECIMATE", dict(ratio=0.35))):
    m = body.modifiers.new("m", mod)
    for k, val in kw.items(): setattr(m, k, val)
    bpy.ops.object.modifier_apply(modifier="m")
body.data.transform(__import__("mathutils").Matrix.Scale(K, 4))
bb = [v.co for v in body.data.vertices]
mn = [min(v[i] for v in bb) for i in range(3)]; mx = [max(v[i] for v in bb) for i in range(3)]
body.data.transform(__import__("mathutils").Matrix.Translation((-(mn[0]+mx[0])/2, -(mn[1]+mx[1])/2, -mn[2])))
print("DIM", [round(b - a, 2) for a, b in zip(mn, mx)], "faces", len(body.data.polygons))
bpy.ops.wm.stl_export(filepath=f"{DST}/{NAME}.stl", export_selected_objects=True)

# preview, same copper look as the other renders
mat = bpy.data.materials.new("copper"); mat.use_nodes = True
bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
bsdf.inputs["Base Color"].default_value = (0.80, 0.45, 0.22, 1)
bsdf.inputs["Metallic"].default_value = 0.6; bsdf.inputs["Roughness"].default_value = 0.35
body.data.materials.append(mat); bpy.ops.object.shade_smooth_by_angle()
sc = bpy.context.scene
try: sc.render.engine = "BLENDER_EEVEE"
except TypeError: sc.render.engine = "CYCLES"
sc.render.resolution_x, sc.render.resolution_y = 1600, 1000
sc.render.film_transparent = True
w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
w.node_tree.nodes["Background"].inputs[1].default_value = 0.6
for loc, e in (((30, -30, 40), 3), ((-30, -10, 20), 1.5)):
    bpy.ops.object.light_add(type="SUN", location=loc); L = bpy.context.object
    L.data.energy = e; L.rotation_euler = (rad(45), 0, math.atan2(loc[1], loc[0]) + rad(90))
bpy.ops.object.camera_add(); cam = bpy.context.object; sc.camera = cam; cam.data.lens = 100
t = bpy.data.objects.new("t", None); bpy.context.collection.objects.link(t); t.location = (0, 0, 10)
cam.constraints.new("TRACK_TO").target = t
for tag, (cx, cy, cz) in (("front34", (1, -0.5, 0.3)), ("side", (0.05, -1, 0.15))):
    cam.location = (cx*230, cy*230, cz*230)
    sc.render.filepath = f"{OUT}/renders/metro/{NAME}_{tag}.png"; bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=f"{DST}/{NAME}.blend")
