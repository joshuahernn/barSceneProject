# barSceneProject

WebGL Bar Room Scene (projectFinal-3)

A WebGL2 scene rendered in the browser that builds a small “bar room” environment
with textured geometry, imported OBJ models, a controllable camera, Phong lighting
with multiple lights, a flickering point light (bulb), and alpha-blended transparency
(bottles and spilled liquid).

======================================================================

FEATURES

======================================================================

SCENE CONTENT

- Room interior built from a large box mesh with inverted normals to render the inside.
- Ceiling fan made from procedural box meshes (hub and four blades) with continuous rotation.

Imported OBJ models:
- Light bulb        (objs/lightbulbfinal.obj)
- Barrel table      (objs/BarrelTable_tri.obj)
- Bar stand         (objs/barStand_tri.obj)
- Stools            (objs/stool_tri.obj)
- Beer bottles      (objs/newBeerBottle_tri.obj)
- Beer tap          (objs/beerTap_tri.obj)
- Spilled liquid    (objs/spilledWater.obj)
- Crushed can       (objs/lowpolycrush_tri.obj)

======================================================================

LIGHTING (PHONG)

======================================================================

Per-fragment lighting is implemented in the shaders using:

- Directional “sun” light uniforms (present in the shader interface)
- Point light at the bulb position with distance attenuation:

  1 / (1 + linear * d + quadratic * d^2)

Material properties per object:
- mat_ambient
- mat_diffuse
- mat_specular
- mat_shininess

======================================================================

ADVANCED FEATURE: FLICKERING / FLASHING LIGHT

======================================================================

- The bulb acts as a flickering point light by modulating point_color over time.
- The repeating flicker cycle consists of:

  quick flash → pause → flash → mostly-on → randomized shaky tail

- Bulb mesh brightness is tied to the flicker using ambient light boosts.

======================================================================

ADVANCED FEATURE: TRANSPARENCY

======================================================================

- Global alpha uniform (u_alpha) multiplies the final fragment alpha.
- Alpha blending is enabled using:

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

- Depth writes are disabled while rendering transparent objects to reduce artifacts:

  gl.depthMask(false)  // bottles and spilled liquid
  gl.depthMask(true)   // restored afterward

======================================================================

CONTROLS

======================================================================

CAMERA MOVEMENT
- W / S     : move forward / backward
- A / D     : strafe left / right
- Space     : move up
- C         : move down

CAMERA ROTATION
- Arrow Left / Right : yaw
- Arrow Up / Down    : pitch
- Q / E              : roll

======================================================================

HOW TO RUN

======================================================================

OPTION A: INCLUDED SERVER SCRIPTS

From the project folder:
- python3 serverChrome.py
  or
- python3 serverFirefox.py

Open the printed URL and navigate to:
- main.html

OPTION B: PYTHON BUILT-IN SERVER

- python3 -m http.server 8000

Then open:
- http://localhost:8000/main.html

======================================================================

PROJECT STRUCTURE

======================================================================

projectFinal-3/
  main.html
  lib.js
  vector_template.js
  matrix_template.js
  mesh_template.js
  serverChrome.py
  serverFirefox.py
  objs/
    lightbulbfinal.obj
    BarrelTable_tri.obj
    barStand_tri.obj
    stool_tri.obj
    newBeerBottle_tri.obj
    beerTap_tri.obj
    spilledWater.obj
    lowpolycrush_tri.obj
  textures/
    extradirtywall.jpg
    metal.png
    whitebulb.jpg
    darkwood.jpg
    woodwall.jpg
    concretefloor.jpg
    woodceiling.jpg
    beerBottletex.jpg
    newSilver.png
    crushedMesh.png

======================================================================

IMPLEMENTATION NOTES

======================================================================

- WebGL2 context created using:
  canvas.getContext('webgl2')

- Depth testing enabled for proper 3D occlusion:
  gl.enable(gl.DEPTH_TEST)

- Inside-room rendering uses a flip_normals uniform so lighting works correctly
  on interior faces.

- Projection uses a custom frustum:
  near = 4, far = 200, field of view ≈ 90 degrees

- Objects are positioned using arrays of transforms (position, scale, rotation)
  and rendered every frame.

======================================================================

CREDITS / REFERENCES

======================================================================

- Multiple-light shader approach inspired by common OpenGL patterns
  (e.g., LearnOpenGL multiple lights).

- WebGL blending reference:
  MDN WebGLRenderingContext blendFunc documentation
