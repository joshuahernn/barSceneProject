const VERTEX_STRIDE = 48;

function make_uv_sphere(gl, program, subdivs, material) {
    const TAU = Math.PI * 2.0;

    let verts = [];
    let indis = [];

    // vertices
    for (let layer = 0; layer <= subdivs; layer++) {


        let y_turns = layer / subdivs / 2;
        let y = Math.cos(y_turns * TAU) / 2;


        let rs = Math.sin(y_turns * TAU);

        for (let subdiv = 0; subdiv <= subdivs; subdiv++) {


            let turns = subdiv / subdivs;
            let rads  = turns * TAU;


            let x = Math.cos(rads) / 2 * rs;
            let z = Math.sin(rads) / 2 * rs;

            verts.push(x, y, z);
            verts.push(1, 1, 1, 1);

            let u = subdiv / subdivs;
            let v = layer / subdivs;
            verts.push(u, v);


            let nx = x;
            let ny = y;
            let nz = z;

            verts.push(nx, ny, nz);
        }
    }


const rs = subdivs + 1;

for (let layer = 0; layer < subdivs; layer++) {
    for (let subdiv = 0; subdiv < subdivs; subdiv++) {
        let a =  layer      * rs + subdiv;     // top left
        let b =  layer      * rs + subdiv + 1; // top right
        let c = (layer + 1) * rs + subdiv;     // bottom left
        let d = (layer + 1) * rs + subdiv + 1; // bottom right

        indis.push(a, b, c);
        indis.push(b, d, c);
    }
}


    const mesh = new Mesh(gl, program, verts, indis);
    mesh.material = material;
    return mesh;
}




class Mesh {
    /**
     * Creates a new mesh and loads it into video memory.
     *
     * @param {WebGLRenderingContext} gl
     * @param {number} program
     * @param {number[]} vertices
     * @param {number[]} indices
    */
    constructor( gl, program, vertices, indices ) {
        this.verts = create_and_load_vertex_buffer( gl, vertices, gl.STATIC_DRAW );
        this.indis = create_and_load_elements_buffer( gl, indices, gl.STATIC_DRAW );

        this.n_verts = vertices.length;
        this.n_indis = indices.length;
        this.program = program;


        this.cullFace = gl.BACK;
    }

    /**
     * Create a box mesh with the given dimensions and colors.
     * @param {WebGLRenderingContext} gl
     * @param {number} width
     * @param {number} height
     * @param {number} depth
     */

    static box( gl, program, width, height, depth ) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts = [
          //  x, y, z,              r,g,b,a,       u, v,      nx,ny,nz
          // front face (0,0,1)
          -hwidth,-hheight, hdepth, 1,1,1,1,      0,1,       0,0,1,
           hwidth,-hheight, hdepth, 1,1,1,1,      1,1,       0,0,1,
           hwidth, hheight, hdepth, 1,1,1,1,      1,0,       0,0,1,
          -hwidth, hheight, hdepth, 1,1,1,1,      0,0,       0,0,1,

          // back face (0,0,-1)
           hwidth,-hheight,-hdepth, 1,1,1,1,      0,1,       0,0,-1,
          -hwidth,-hheight,-hdepth, 1,1,1,1,      1,1,       0,0,-1,
          -hwidth, hheight,-hdepth, 1,1,1,1,      1,0,       0,0,-1,
           hwidth, hheight,-hdepth, 1,1,1,1,      0,0,       0,0,-1,

          // right face (1,0,0)
           hwidth,-hheight, hdepth, 1,1,1,1,      0,1,       1,0,0,
           hwidth,-hheight,-hdepth,1,1,1,1,       1,1,       1,0,0,
           hwidth, hheight,-hdepth, 1,1,1,1,      1,0,       1,0,0,
           hwidth, hheight, hdepth, 1,1,1,1,      0,0,       1,0,0,

          // left face (-1,0,0)
          -hwidth,-hheight,-hdepth, 1,1,1,1,      0,1,      -1,0,0,
          -hwidth,-hheight, hdepth, 1,1,1,1,      1,1,      -1,0,0,
          -hwidth, hheight, hdepth, 1,1,1,1,      1,0,      -1,0,0,
          -hwidth, hheight,-hdepth, 1,1,1,1,      0,0,      -1,0,0,

          // top face (0,1,0)
          -hwidth, hheight, hdepth, 1,1,1,1,      0,1,       0,1,0,
           hwidth, hheight, hdepth, 1,1,1,1,      1,1,       0,1,0,
           hwidth, hheight,-hdepth,1,1,1,1,       1,0,       0,1,0,
          -hwidth, hheight,-hdepth,1,1,1,1,       0,0,       0,1,0,

          // bottom face (0,-1,0)
          -hwidth,-hheight,-hdepth,1,1,1,1,       0,1,       0,-1,0,
           hwidth,-hheight,-hdepth,1,1,1,1,       1,1,       0,-1,0,
           hwidth,-hheight, hdepth,1,1,1,1,       1,0,       0,-1,0,
          -hwidth,-hheight, hdepth,1,1,1,1,       0,0,       0,-1,0,
        ];


        let indis = [
    // +Z
    0, 1, 2,
    0, 2, 3,

    // -Z
    4, 5, 6,
    4, 6, 7,

    // +X
    8,  9, 10,
    8, 10, 11,

    // -X
    12, 13, 14,
    12, 14, 15,

    // +Y
    16, 17, 18,
    16, 18, 19,

    // -Y
    20, 21, 22,
    20, 22, 23,
];

        return new Mesh( gl, program, verts, indis );
    }


    /**
     * Render the mesh. Does NOT preserve array/index buffer or program bindings!
     *
     * @param {WebGLRenderingContext} gl
     */
    render( gl ) {
      //  gl.cullFace( this.cullFace );
      // gl.enable( gl.CULL_FACE );

        gl.useProgram( this.program );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.verts );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indis );

        set_vertex_attrib_to_buffer(
            gl, this.program,
            "coordinates",
            this.verts, 3,
            gl.FLOAT, false, VERTEX_STRIDE, 0
        );


        set_vertex_attrib_to_buffer(
            gl, this.program,
            "color",
            this.verts, 4,
            gl.FLOAT, false, VERTEX_STRIDE, 12
        );



        set_vertex_attrib_to_buffer(
            gl, this.program,
            "uv",
            this.verts, 2,
            gl.FLOAT, false, VERTEX_STRIDE, 28
        );


        set_vertex_attrib_to_buffer(
            gl, this.program,
            "normal",
            this.verts, 3,
            gl.FLOAT, false, VERTEX_STRIDE, 36
        );



    if (this.material && this.material.texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.material.texture);

        gl.drawElements(gl.TRIANGLES, this.n_indis, gl.UNSIGNED_SHORT, 0);
        return;
    }



if (this.textures) {
    gl.activeTexture(gl.TEXTURE0);

    const indexOffset = 6 * 2;

    gl.bindTexture(gl.TEXTURE_2D, this.textures.front);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    gl.bindTexture(gl.TEXTURE_2D, this.textures.back);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, indexOffset);

    gl.bindTexture(gl.TEXTURE_2D, this.textures.right);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, indexOffset * 2);


    gl.bindTexture(gl.TEXTURE_2D, this.textures.left);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, indexOffset * 3);


    gl.bindTexture(gl.TEXTURE_2D, this.textures.top);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, indexOffset * 4);


    gl.bindTexture(gl.TEXTURE_2D, this.textures.bottom);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, indexOffset * 5);

} else {
    gl.drawElements( gl.TRIANGLES, this.n_indis, gl.UNSIGNED_SHORT, 0 );
}

    }


    /**
     * Parse the given text as the body of an obj file.
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     * @param {string} text
     */
    // in mesh_template.js

static from_obj_text(gl, program, text) {
    const lines = text.split(/\r?\n/);

    const positions = [];   // v
    const texcoords = [];   // vt

    const verts = [];
    const indices = [];
    const vertMap = new Map(); // "vIndex/vtIndex" -> vertex index

    for (let line of lines) {
        if (!line) continue;
        const parts = line.trim().split(/\s+/);
        const prefix = parts[0];

        // positions: v x y z
        if (prefix === "v") {
            const x = parseFloat(parts[1]);
            const y = parseFloat(parts[2]);
            const z = parseFloat(parts[3]);
            positions.push(x, y, z);
        }

        // texcoords: vt u v
        if (prefix === "vt") {
            const u = parseFloat(parts[1]);
            const v = parseFloat(parts[2]);
            texcoords.push(u, v);
        }

        // faces: f v/vt/... v/vt/... v/vt/...
        if (prefix === "f") {
            // assume triangles
            for (let i = 1; i <= 3; i++) {
                const token = parts[i];  // e.g. "12/34/5" or "12/34"
                const comps = token.split("/");
                const vIdx  = parseInt(comps[0], 10) - 1;
                const vtIdx = comps[1] ? (parseInt(comps[1], 10) - 1) : -1;

                const key = vIdx + "/" + vtIdx;
                let finalIndex;

                if (vertMap.has(key)) {
                    finalIndex = vertMap.get(key);
                } else {
                    const px = positions[3 * vIdx + 0];
                    const py = positions[3 * vIdx + 1];
                    const pz = positions[3 * vIdx + 2];

                    let u = 0.0, v = 0.0;
                    if (vtIdx >= 0) {
                        u = texcoords[2 * vtIdx + 0];
                        v = texcoords[2 * vtIdx + 1];
                    }

                    // layout: pos(3), color(4), uv(2), normal(3)
                    verts.push(px, py, pz);      // pos
                    verts.push(1, 1, 1, 1);      // color (white)
                    verts.push(u, v);            // uv

                    const len = Math.hypot(px, py, pz) || 1.0;
                    const nx = px / len;
                    const ny = py / len;
                    const nz = pz / len;
                    verts.push(nx, ny, nz);      // normal

                    finalIndex = (verts.length / 12) - 1;
                    vertMap.set(key, finalIndex);
                }

                indices.push(finalIndex);
            }
        }

        if (prefix === "#") continue; // comments
    }

    return new Mesh(gl, program, verts, indices);
}



    /**
     * Asynchronously load the obj file as a mesh.
     * @param {WebGLRenderingContext} gl
     * @param {string} file_name
     * @param {WebGLProgram} program
     * @param {function} f the function to call and give mesh to when finished.
     */
    static from_obj_file( gl, file_name, program, f ) {
        let request = new XMLHttpRequest();

        // the function that will be called when the file is being loaded
        request.onreadystatechange = function() {
            // console.log( request.readyState );

            if( request.readyState != 4 ) { return; }
            if( request.status != 200 ) {
                throw new Error( 'HTTP error when opening .obj file: ', request.statusText );
            }

            // now we know the file exists and is ready
            let loaded_mesh = Mesh.from_obj_text( gl, program, request.responseText );

            console.log( 'loaded ', file_name );
            f( loaded_mesh );
        };


        request.open( 'GET', file_name ); // initialize request.
        request.send();                   // execute request
    }
}
