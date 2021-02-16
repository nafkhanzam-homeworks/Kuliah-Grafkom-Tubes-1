import Shape from "./shape";

class MultiColorTriangle extends Shape {
  render(): void {
    const gl = this.gl;
    // 1. create vertex data
    // prettier-ignore
    const vertexData = [0, 1, 0, 
      1, -1, 0, 
      -1, -1, 0];
    // prettier-ignore
    const colorData = [1, 0, 0, 
      0, 1, 0, 
      0, 0, 1]; // rgb value

    // 2. create buffer
    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    // 3. load vertexdata into buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexData),
      gl.STATIC_DRAW
    );

    // load colordata to buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    // 4. create vertex shader & fragment shader
    this.createShader(
      this.gl.VERTEX_SHADER,
      `
    precision mediump float;

    attribute vec3 color;
    attribute vec3 position;
    varying vec3 vColor;

    void main() {
      vColor = color;
      gl_Position = vec4(position, 1);
    }
    `
    );

    this.createShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision mediump float;

      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4(vColor, 1);
      }
      `
    );

    // 5. Link program to gl
    this.linkProgram();

    // 6. enable vertex attributes
    const positionLocation = gl.getAttribLocation(this.program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    // enable color attribute
    const colorLocation = gl.getAttribLocation(this.program, "color");
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    // 7. draw
    this.gl.useProgram(this.program);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}

export default MultiColorTriangle;
