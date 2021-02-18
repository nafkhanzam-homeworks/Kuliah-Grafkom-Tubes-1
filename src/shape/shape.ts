import {constants} from "../constants";

// base abstract class
export abstract class Shape {
  protected program: WebGLProgram;

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

  protected applyColor() {
    const {gl} = this;

    const colorPointer = gl.getUniformLocation(this.program, "color");
    gl.uniform3fv(colorPointer, new Float32Array(this.color));
  }
}
