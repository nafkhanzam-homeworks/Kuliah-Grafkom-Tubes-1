import Shape from "./shape";

class Line extends Shape {
  render(): void {
    const gl = this.gl;

    // 1. create vertexdata
    //prettier-ignore
    const lineData = [-1,0,0,
                      1,0,0]

    // 2. create buffer
    const lineBuffer = gl.createBuffer();

    // 3. load vertexdata to buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    // set linebufer to linedata
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineData), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // 4. create vertex and fragment shader
    this.createShader(
      this.gl.VERTEX_SHADER,
      `
      attribute vec3 position;

      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `
    );
    this.createShader(
      this.gl.FRAGMENT_SHADER,
      `
      void main() {
        gl_FragColor = vec4(1, 0, 0, 1);
      }
    `
    );

    // 5. link program
    this.linkProgram();
    gl.useProgram(this.program);

    // 6. bind vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);

    // get the position attribute from the shader
    const positionLocation = gl.getAttribLocation(this.program, "position");
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    // 7. draw
    gl.drawArrays(gl.LINES, 0, 2);
  }
}

export default Line;
