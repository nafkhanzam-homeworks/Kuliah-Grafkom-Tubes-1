import {constants} from "../constants";

// base abstract class
export abstract class Shape {
  protected program: WebGLProgram;
  protected points: Point[] = [];
  protected selected: boolean = false;

  constructor(
    protected canvas: HTMLCanvasElement,
    protected gl: WebGL2RenderingContext,
    protected color: Color,
  ) {
    const program = gl.createProgram();
    if (!program) {
      throw new Error("Failed when creating program!");
    }
    this.program = program;
    this.createShader(
      this.gl.VERTEX_SHADER,
      `
      precision mediump float;

      attribute vec2 position;

      void main() {
        gl_Position = vec4(position, 0, 1);
      }
    `,
    );

    this.createShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision mediump float;

      uniform vec3 color;

      void main() {
        gl_FragColor = vec4(color, 1);
      }
      `,
    );
    this.linkProgram();
    this.useProgram();
  }

  abstract render(): void;

  protected createShader(shaderType: number, source: string): WebGLShader {
    const shader = this.gl.createShader(shaderType);
    if (!shader) {
      throw new Error("Failed when creating shader!");
    }
    this.gl.shaderSource(
      shader,
      // varying is for gradient
      source,
    );
    this.gl.compileShader(shader);
    // attach shader to the program
    this.gl.attachShader(this.program, shader);
    return shader;
  }

  protected linkProgram() {
    this.gl.linkProgram(this.program);
  }

  protected useProgram() {
    this.gl.useProgram(this.program);
  }

  protected createArrayBuffer(data: number[], size: number) {
    const {gl} = this;

    const positionBufferPointer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferPointer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    const positionPointer = gl.getAttribLocation(this.program, "position");
    gl.enableVertexAttribArray(positionPointer);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferPointer);
    gl.vertexAttribPointer(positionPointer, size, gl.FLOAT, false, 0, 0);

    return positionBufferPointer;
  }

  protected applyColor(color: Color) {
    const {gl} = this;

    const colorPointer = gl.getUniformLocation(this.program, "color");
    gl.uniform3fv(colorPointer, new Float32Array(color));
  }

  protected renderFill() {
    const {gl} = this;

    const points = this.points.flat();
    this.createArrayBuffer(points, constants.pointSize);

    this.applyColor(this.color);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length);
  }

  protected renderPoints() {
    const {gl} = this;

    const points = this.points.flat();
    this.createArrayBuffer(points, constants.pointSize);

    this.applyColor(constants.selectedPointColor);

    gl.drawArrays(gl.POINTS, 0, this.points.length);
  }

  protected renderSelected() {
    const {gl} = this;

    const points = this.points.flat();
    this.createArrayBuffer(points, constants.pointSize);

    gl.lineWidth(3);

    this.applyColor(constants.selectedColor);

    gl.drawArrays(gl.LINE_LOOP, 0, this.points.length);
  }

  onMouseMove(state: MouseState) {}

  onMouseClick(state: MouseState) {}

  onMouseUp(state: MouseState, pos: Point) {}
}
