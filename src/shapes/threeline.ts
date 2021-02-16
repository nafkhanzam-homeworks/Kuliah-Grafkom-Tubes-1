import Shape from "./shape";

class ThreeLine extends Shape {
  render(): void {
    const gl = this.gl;
    const canvas = this.canvas;

    //prettier-ignore
    var vertices = [
      -0.7, -0.1, 0,
      -0.3, 0.6,  0,
      -0.3, -0.3, 0,
      0.2,  0.6,  0,
      0.3,  -0.3, 0,
      0.7,  0.6,  0 
   ]

    // Create an empty buffer object
    var vertex_buffer = gl.createBuffer();

    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /*=================== Shaders ====================*/

    // Vertex shader source code
    this.createShader(
      this.gl.VERTEX_SHADER,
      "attribute vec3 coordinates;" +
        "void main(void) {" +
        " gl_Position = vec4(coordinates, 1.0);" +
        "}"
    );

    this.createShader(
      this.gl.FRAGMENT_SHADER,
      "void main(void) {" + "gl_FragColor = vec4(1, 1, 1, 0.1);" + "}"
    );

    // Create a shader program object to store
    // the combined shader program
    // Link both the programs
    this.linkProgram();

    // Use the combined shader program object
    gl.useProgram(this.program);

    /*======= Associating shaders to buffer objects ======*/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Get the attribute location
    var coord = gl.getAttribLocation(this.program, "coordinates");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    /*============ Drawing the triangle =============*/

    // Clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the lines
    gl.drawArrays(gl.LINES, 0, 6);

    // POINTS, LINE_STRIP, LINE_LOOP, LINES,
    // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES
  }
}

export default ThreeLine;
