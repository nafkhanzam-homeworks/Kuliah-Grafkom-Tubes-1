import Shape from "./shape";

class Line extends Shape {
  render(): void {
    const gl = this.gl;

    // 1. create vertexdata
    //prettier-ignore
    const lineData = [-1,1,0,
                      1,1,0]
    //prettier-ignore
    const colorData = [-1,1,1]

    // 2. create buffer
    const lineBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    // 3. load vertexdata to buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    // set linebufer to linedata
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineData), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    // 4. create vertex and fragment shader
    this.createShader(
      this.gl.VERTEX_SHADER,
      `
      attribute vec3 position;

      void main() {
        gl_Position = vec4(position, 1);
      }
    `
    );
    this.createShader(
      this.gl.FRAGMENT_SHADER,
      `
      attribute vec3 color;

      void main() {
        gl_FragColor = vec4(color, 1);
      }
    `
    );

    // 5. link program
    this.linkProgram();

    // 6. enable vertex attribute
    // get the position attribute from the shader
    const positionLocation = gl.getAttribLocation(this.program, "position");
    gl.enableVertexAttribArray(positionLocation);
    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(this.program, "color");
    gl.enableVertexAttribArray(colorLocation);
    // bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    // 7. draw
    gl.useProgram(this.program);
    gl.drawArrays(gl.LINES, 0, 2);
  }
}

export default Line;
