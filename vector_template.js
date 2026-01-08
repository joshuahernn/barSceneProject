class Vec4 {

    constructor( x, y, z, w ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w ?? 0;
    }

    /**
     * Returns the vector that is this vector scaled by the given scalar.
     * @param {number} by the scalar to scale with 
     * @returns {Vec4}
     */
    scaled( by ) {


        const vec4 = new Vec4 ( 

         this.x * by,
         this.y * by,
         this.z * by,
         this.w * by,
       
        );
         // return the new vector
         return vec4;
    }

    /**
     * Returns the dot product between this vector and other
     * @param {Vec4} other the other vector 
     * @returns {number}
     */
    dot( other ) {
        // ab+by    // ax+by, cx+dy    //aw+by  ax+bz, cw+dy, cx+dz
        
        const dotproduct =  
        this.x * other.x + 
        this.y * other.y + 
        this.z * other.z + 
        this.w * other.w 

        return dotproduct; // return the dot product.
        
       
    }

    /**
     * Returns the length of this vector
     * @returns {number}
     */
    length() {
        
        const vectorlength = Math.sqrt(
        Math.pow(this.x, 2) +
        Math.pow(this.y, 2) +
        Math.pow(this.z, 2) +
        Math.pow(this.w, 2)
    )
    return vectorlength;
    }

    /**
     * Returns a normalized version of this vector
     * @returns {Vec4}
     */
    norm() {
        
        // return the normalized vector
        const length = this.length();
        const normVector = new Vec4(
        this.x / length,
        this.y / length,
        this.z / length,
        this.w / length
        );
        return normVector;
    }

    /**
     * Returns the vector sum between this and other.
     * @param {Vec4} other 
     */
    add( other ) {
        
        // return the vector sum
        const vectorSum = new Vec4(
            this.x + other.x,
            this.y + other.y,
            this.z + other.z,
            this.w + other.w
        );
        return vectorSum;
    }

    sub( other ) {
        return this.add( other.scaled( -1 ) );
    }

    cross( other ) {
        let x = this.y * other.z - this.z * other.y;
        let y = this.x * other.z - this.z * other.x;
        let z = this.x * other.y - this.y * other.x;

        return new Vec4( x, y, z, 0 );
    }
	
	toString() {
		return [ '[', this.x, this.y, this.z, this.w, ']' ].join( ' ' );
	}
}
