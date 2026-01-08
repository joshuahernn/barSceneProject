/**
 * Matrix with row-major layout:
 *  0       1       2       3
 *  4       5       6       7
 *  8       9       10      11
 *  12      13      14      15
 */
class Mat4 {

    constructor( data ) {
        if( data == null ) {
            this.data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]
        }
        else {
            this.data = data;
        }
    }

    static identity() {
        return new Mat4();
    }

    toString() {
        var str_vals = this.data.map( function( val ) { return "" + val } )
        var str =
            str_vals.slice( 0, 4 ).join(' ') + '; ' +
            str_vals.slice( 4, 8 ).join(' ') + '; ' +
            str_vals.slice( 8, 12 ).join(' ') + '; ' +
            str_vals.slice( 12, 16 ).join(' ');

        return '[' + str + ']';
    }

    // good reference https://wikimedia.org/api/rest_v1/media/math/render/svg/a6821937d5031de282a190f75312353c970aa2df note, it is right hand, we are using left hand so flip.

    /**
     * Returns a rotation matrix in the XY plane, rotating by the given number of turns.
     * @param {number} turns amount to rotate by
     * @returns {Mat4}
     */
    static rotation_xy( turns ) {

        const radianturns = turns * 2 * Math.PI;
        const cos = Math.cos(radianturns);
        const sin = Math.sin(radianturns);

        const xymatrix = [
          cos,  sin,  0, 0,   // row 0
         -sin,  cos,  0, 0,   // row 1
           0,    0,   1, 0,   // row 2
           0,    0,   0, 1    // row 3
        ];

         // return the rotation matrix
        return new Mat4 (xymatrix);

    }


    /**
     * Returns a rotation matrix in the XZ plane, rotating by the given number of turns
     * @param {number} turns amount to rotate by
     * @returns {Mat4}
     */
    static rotation_xz( turns ) {

        const radianturns = turns * 2 * Math.PI;
        const cos = Math.cos(radianturns);
        const sin = Math.sin(radianturns);

        const xzmatrix = [
           cos,  0, sin,  0,
            0,   1,   0,   0,
           -sin,  0,  cos,  0,
            0,   0,   0,   1
        ];

         // return the rotation matrix
        return new Mat4 (xzmatrix);
    }

    /**
     * Returns a rotation matrix in the YZ plane, rotating by the given number of turns
     * @param {number} turns amount to rotate by
     * @returns {Mat4}
     */
    static rotation_yz( turns ) {

        const radianturns = turns * 2 * Math.PI;
        const cos = Math.cos(radianturns);
        const sin = Math.sin(radianturns);

        const yzmatrix = [
            1,   0,    0,    0,
            0,  cos,  sin,   0,
            0, -sin,  cos,   0,
            0,   0,    0,    1
        ];

         // return the rotation matrix
        return new Mat4 (yzmatrix);
    }

    static translation( dx, dy, dz ) {

        const translationMatrix = [
            1, 0, 0, dx,  // row 0
            0, 1, 0, dy,  // row 1
            0, 0, 1, dz,  // row 2
            0, 0, 0, 1    // row 3
        ];

        // return the translation matrix
        return new Mat4 (translationMatrix);

    }

    static scale( sx, sy, sz ) {

        const scalingMatrix = [
            sx, 0, 0, 0,  // row 0
            0, sy, 0, 0,  // row 1
            0, 0, sz, 0,  // row 2
            0, 0, 0,  1    // row 3
        ];
        // return the scaling matrix
        return new Mat4 (scalingMatrix);


    }

    mul( right ) {

        const leftMatrix = this.data,
        rightMatrix = right.data;
        const result = new Array(16);

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                const flattenIndex = i * 4 + j;

                result[flattenIndex] = 0;   // set up up matrix, will hold i,j -> leftmatrix * rightmatrix

                for (let k = 0; k < 4; k++) {
                    result[flattenIndex] += leftMatrix[i*4 + k] * rightMatrix[k*4 + j];
                }
                }
            }
            return new Mat4(result);
            }

	// right multiply by column vector
    transform( x, y, z, w ) {
        return this.transform_vec( new Vec4( x, y, z, w ) );
    }

    transform_vec( vec ) {  //https://graphicmaths.com/img/pure/matrices/matrix-2d-transformations/matrix-mul-formula2.png
        const leftMatrix = this.data,
        vectorColumn = [vec.x, vec.y, vec.z, vec.w];
        const result = new Array(4);

        // result rows -> 4 rows 1 col
        for (let i = 0; i < 4; i++) {
            result[i] = 0;

            // matrix mult.
            for (let j = 0; j < 4; j++) {
                result[i] += leftMatrix[i*4 + j] * vectorColumn[j];
            }
        }
        return new Vec4(result[0], result[1], result[2], result[3]);
}



    rc( row, col ) {
        return this.data[ row * 4 + col ]
    }

    // inverting a 4x4 matrix is ugly, there are 16 determinants we
    // need to calculate. Because it's such a pain, I looked it up:
    // https://stackoverflow.com/questions/1148309/inverting-a-4x4-matrix
    // author: willnode
    inverse() {
        // var A2323 = m.m22 * m.m33 - m.m23 * m.m32 ;
        const A2323 = this.rc(2, 2) * this.rc(3, 3) - this.rc(2, 3) * this.rc(3, 2);

        // var A1323 = m.m21 * m.m33 - m.m23 * m.m31 ;
        const A1323 = this.rc(2, 1) * this.rc(3, 3) - this.rc(2, 3) * this.rc(3, 1);

        // var A1223 = m.m21 * m.m32 - m.m22 * m.m31 ;
        const A1223 = this.rc(2, 1) * this.rc(3, 2) - this.rc(2, 2) * this.rc(3, 1);

        // var A0323 = m.m20 * m.m33 - m.m23 * m.m30 ;
        const A0323 = this.rc(2, 0) * this.rc(3, 3) - this.rc(2, 3) * this.rc(3, 0);

        // var A0223 = m.m20 * m.m32 - m.m22 * m.m30 ;
        const A0223 = this.rc(2, 0) * this.rc(3, 2) - this.rc(2, 2) * this.rc(3, 0);

        // var A0123 = m.m20 * m.m31 - m.m21 * m.m30 ;
        const A0123 = this.rc(2, 0) * this.rc(3, 1) - this.rc(2, 1) * this.rc(3, 0);

        // var A2313 = m.m12 * m.m33 - m.m13 * m.m32 ;
        const A2313 = this.rc(1, 2) * this.rc(3, 3) - this.rc(1, 3) * this.rc(3, 2);

        // var A1313 = m.m11 * m.m33 - m.m13 * m.m31 ;
        const A1313 = this.rc(1, 1) * this.rc(3, 3) - this.rc(1, 3) * this.rc(3, 1);

        // var A1213 = m.m11 * m.m32 - m.m12 * m.m31 ;
        const A1213 = this.rc(1, 1) * this.rc(3, 2) - this.rc(1, 2) * this.rc(3, 1);

        // var A2312 = m.m12 * m.m23 - m.m13 * m.m22 ;
        const A2312 = this.rc(1, 2) * this.rc(2, 3) - this.rc(1, 3) * this.rc(2, 2);

        // var A1312 = m.m11 * m.m23 - m.m13 * m.m21 ;
        const A1312 = this.rc(1, 1) * this.rc(2, 3) - this.rc(1, 3) * this.rc(2, 1);

        // var A1212 = m.m11 * m.m22 - m.m12 * m.m21 ;
        const A1212 = this.rc(1, 1) * this.rc(2, 2) - this.rc(1, 2) * this.rc(2, 1);

        // var A0313 = m.m10 * m.m33 - m.m13 * m.m30 ;
        const A0313 = this.rc(1, 0) * this.rc(3, 3) - this.rc(1, 3) * this.rc(3, 0);

        // var A0213 = m.m10 * m.m32 - m.m12 * m.m30 ;
        const A0213 = this.rc(1, 0) * this.rc(3, 2) - this.rc(1, 2) * this.rc(3, 0);

        // var A0312 = m.m10 * m.m23 - m.m13 * m.m20 ;
        const A0312 = this.rc(1, 0) * this.rc(2, 3) - this.rc(1, 3) * this.rc(2, 0);

        // var A0212 = m.m10 * m.m22 - m.m12 * m.m20 ;
        const A0212 = this.rc(1, 0) * this.rc(2, 2) - this.rc(1, 2) * this.rc(2, 0);

        // var A0113 = m.m10 * m.m31 - m.m11 * m.m30 ;
        const A0113 = this.rc(1, 0) * this.rc(3, 1) - this.rc(1, 1) * this.rc(3, 0);

        // var A0112 = m.m10 * m.m21 - m.m11 * m.m20 ;
        const A0112 = this.rc(1, 0) * this.rc(2, 1) - this.rc(1, 1) * this.rc(2, 0);


        const det =
        this.rc(0, 0) * ( this.rc(1, 1) * A2323 - this.rc(1, 2) * A1323 + this.rc(1, 3) * A1223 ) -
        this.rc(0, 1) * ( this.rc(1, 0) * A2323 - this.rc(1, 2) * A0323 + this.rc(1, 3) * A0223 ) +
        this.rc(0, 2) * ( this.rc(1, 0) * A1323 - this.rc(1, 1) * A0323 + this.rc(1, 3) * A0123 ) -
        this.rc(0, 3) * ( this.rc(1, 0) * A1223 - this.rc(1, 1) * A0223 + this.rc(1, 2) * A0123 );

        const dr = 1.0 / det;

        return new Mat4( [
            dr * ( this.rc(1, 1) * A2323 - this.rc(1, 2) * A1323 + this.rc(1, 3) * A1223 ),
            dr *-( this.rc(0, 1) * A2323 - this.rc(0, 2) * A1323 + this.rc(0, 3) * A1223 ),
            dr * ( this.rc(0, 1) * A2313 - this.rc(0, 2) * A1313 + this.rc(0, 3) * A1213 ),
            dr *-( this.rc(0, 1) * A2312 - this.rc(0, 2) * A1312 + this.rc(0, 3) * A1212 ),

            dr *-( this.rc(1, 0) * A2323 - this.rc(1, 2) * A0323 + this.rc(1, 3) * A0223 ),
            dr * ( this.rc(0, 0) * A2323 - this.rc(0, 2) * A0323 + this.rc(0, 3) * A0223 ),
            dr *-( this.rc(0, 0) * A2313 - this.rc(0, 2) * A0313 + this.rc(0, 3) * A0213 ),
            dr * ( this.rc(0, 0) * A2312 - this.rc(0, 2) * A0312 + this.rc(0, 3) * A0212 ),

            dr * ( this.rc(1, 0) * A1323 - this.rc(1, 1) * A0323 + this.rc(1, 3) * A0123 ),
            dr *-( this.rc(0, 0) * A1323 - this.rc(0, 1) * A0323 + this.rc(0, 3) * A0123 ),
            dr * ( this.rc(0, 0) * A1313 - this.rc(0, 1) * A0313 + this.rc(0, 3) * A0113 ),
            dr *-( this.rc(0, 0) * A1312 - this.rc(0, 1) * A0312 + this.rc(0, 3) * A0112 ),

            dr *-( this.rc(1, 0) * A1223 - this.rc(1, 1) * A0223 + this.rc(1, 2) * A0123 ),
            dr * ( this.rc(0, 0) * A1223 - this.rc(0, 1) * A0223 + this.rc(0, 2) * A0123 ),
            dr *-( this.rc(0, 0) * A1213 - this.rc(0, 1) * A0213 + this.rc(0, 2) * A0113 ),
            dr * ( this.rc(0, 0) * A1212 - this.rc(0, 1) * A0212 + this.rc(0, 2) * A0112 ),
        ] );
    }

    clone() {
        let c = new Array(16);
        for( let i = 0; i < 16; i++ ) { c[i] = this.data[i]; }
        return new Mat4( c );
    }

	toString() {
		let pieces = [ '[' ];

		for( let row = 0; row < 4; row ++ ){
			pieces.push( '[' );

			for( let col = 0; col < 4; col ++ ){
				let i = row * 4 + col;
				pieces.push( this.data[i] );
			}

			pieces.push( ']' )
		}

		pieces.push( ']' );

		return pieces.join( ' ' );
	}
//located inside of the Mat4 class
static frustum( left, right, bottom, top, near, far ) {
        // these scalars will scale x,y values to the near plane
        let scale_x = 2 * near / ( right - left );
        let scale_y = 2 * near / ( top - bottom );

        // shift the eye depending on the right/left and top/bottom planes.
        // only really used for VR (left eye and right eye shifted differently).
        let t_x = ( right + left ) / ( right - left );
        let t_y = ( top + bottom ) / ( top - bottom );

        // map z into the range [ -1, 1 ] linearly
        const linear_c2 = 1 / ( far - near );
        const linear_c1 = near / ( far - near );
        // remember that the w coordinate will always be 1 before being fed to the vertex shader.
        // therefore, anything we put in row 3, col 4 of the matrix will be added to the z.

        // map z into the range [ -1, 1], but with a non-linear ramp
        // see: https://learnopengl.com/Advanced-OpenGL/Depth-testing and
        // https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/opengl-perspective-projection-matrix and
        // http://learnwebgl.brown37.net/08_projections/projections_perspective.html
        // for more info. (note, I'm using left-handed coordinates. Some sources use right-handed).
        const nonlin_c2 = (far + near) / (far - near);
        const nonlin_c1 = 2 * far * near / (far - near);

        let c1 = nonlin_c1;
        let c2 = nonlin_c2;

        return new Mat4( [
            scale_x,    0,          t_x, 0,
            0,          scale_y,    t_y, 0,
            0,          0,          c2, -c1,
            0,          0,          1, 0,
        ] );
    }
}
