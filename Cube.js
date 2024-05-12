class Cube {
  constructor(matrix = new Matrix4(), color=[1,1,1,1], textureType=-2) {
    this.type = 'cube';
    this.color = color;
    this.matrix = matrix;
    this.textureNum = textureType;

    this.vertices = new Float32Array([
      // front of cube
      0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0,
      0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0,
      // top of cube
      0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0,
      0.0, 1.0, 0.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0,
      // bottom of cube
      0.0, 0.0, 0.0,  0.0, 0.0, 1.0,  1.0, 0.0, 1.0,
      0.0, 0.0, 0.0,  1.0, 0.0, 1.0,  1.0, 0.0, 0.0,
      // back of cube
      0.0, 0.0, 1.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0,
      0.0, 0.0, 1.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0,
      // right side
      1.0, 0.0, 0.0,  1.0, 0.0, 1.0,  1.0, 1.0, 0.0,
      1.0, 0.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0,
      // left side
      0.0, 0.0, 0.0,  0.0, 0.0, 1.0,  0.0, 1.0, 0.0,
      0.0, 0.0, 1.0,  0.0, 1.0, 1.0,  0.0, 1.0, 0.0,
    ]);

    this.uvs = new Float32Array([
      // front of cube
      0,1, 0,1, 0,1,
      0,1, 0,1, 0,1,
      // top of cube
      .8,.8, .8,.8, .8,.8,
      .8,.8, .8,.8, .8,.8,
      // bottom of cube
      .8,.8, .8,.8, .8,.8,
      .8,.8, .8,.8, .8,.8,
      // back of cube
      0,1, 0,1, 0,1,
      0,1, 0,1, 0,1,
      // right side
      .2,.2, .2,.2, .2,.2,
      .2,.2, .2,.2, .2,.2,
      // left side
      .2,.2, .2,.2, .2,.2,
      .2,.2, .2,.2, .2,.2,
    ]);
    
  }

  render() {
    // var xy = this.position;
    var rgba = this.color;

    // pass texture number
    gl.uniform1i(u_WhichTexture, this.textureNum);

    // Pass color to shader
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    if (g_vertexBuffer == null || g_uvBuffer == null) {
      initTriangles3DUV();
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);

    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer);

    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_UV variable
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_UV variable
    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }
}