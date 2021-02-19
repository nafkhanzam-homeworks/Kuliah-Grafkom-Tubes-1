import {constants} from "../constants";
import {createId} from "./id";

// base abstract class
export abstract class Shape {
  protected program: WebGLProgram;
  protected points: {id: number; point: Point}[] = [];
  protected selected: boolean = false;
  protected id: number = createId();
  protected dataId: [number, number, number, number];

  constructor(
    protected canvas: HTMLCanvasElement,
    protected gl: WebGL2RenderingContext,
    protected color: Color,
  ) {
    const id = this.id;
    this.dataId = [
      ((id >> 0) & 0xff) / 0xff,
      ((id >> 8) & 0xff) / 0xff,
      ((id >> 16) & 0xff) / 0xff,
      ((id >> 24) & 0xff) / 0xff,
    ];
    const program = gl.createProgram();
    if (!program) {
      throw new Error("Failed when creating program!");
    }
    this.program = program;
    this.initMainShader();
  }

  private initMainShader() {
    const {gl, program} = this;
    gl.attachShader(
      program,
      this.createShader(
        gl.VERTEX_SHADER,
        `
          precision mediump float;

          attribute vec2 position;

          void main() {
            gl_Position = vec4(position, 0, 1);
          }
        `,
      ),
    );

    gl.attachShader(
      program,
      this.createShader(
        gl.FRAGMENT_SHADER,
        `
          precision mediump float;

          uniform vec3 color;

          void main() {
            gl_FragColor = vec4(color, 1);
          }
        `,
      ),
    );

    gl.linkProgram(program);
  }

  abstract renderHitbox(hitboxProgram: WebGLProgram): void;
  protected abstract renderShape(): void;

  render() {
    const {gl, program} = this;

    gl.useProgram(program);
    this.renderShape();
    if (this.selected) {
      this.renderSelected();
      this.renderPoints();
    }
  }

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
    return shader;
  }

  protected createArrayBuffer(program: WebGLProgram, data: number[], size: number) {
    const {gl} = this;

    const positionBufferPointer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferPointer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    const positionPointer = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionPointer);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferPointer);
    gl.vertexAttribPointer(positionPointer, size, gl.FLOAT, false, 0, 0);

    return positionBufferPointer;
  }

  protected applyColor(program: WebGLProgram, color: Color) {
    const {gl} = this;

    const colorPointer = gl.getUniformLocation(program, "color");
    gl.uniform3fv(colorPointer, new Float32Array(color));
  }

  protected flatPoints() {
    return this.points.map((v) => v.point).flat();
  }

  protected renderPoints() {
    const {gl, program} = this;

    const points = this.flatPoints();
    this.createArrayBuffer(program, points, constants.pointSize);

    this.applyColor(program, constants.selectedPointColor);

    gl.drawArrays(gl.POINTS, 0, this.points.length);
  }

  protected renderSelected() {
    const {gl, program} = this;

    const points = this.flatPoints();
    this.createArrayBuffer(program, points, constants.pointSize);

    gl.lineWidth(3);

    this.applyColor(program, constants.selectedColor);

    gl.drawArrays(gl.LINE_LOOP, 0, this.points.length);
  }

  setColor(color: Color) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  addPoint(p: Point) {
    this.points.push({id: createId(), point: p});
  }

  updatePoint(index: number, p: Point) {
    this.points[index].point = p;
  }

  setSelected(value: boolean) {
    this.selected = value;
  }

  getId() {
    return this.id;
  }

  onMouseMove(state: MouseState) {
    if (state.pressed.pos) {
      const dx = state.pos[0] - state.bef[0];
      const dy = state.pos[1] - state.bef[1];
      for (let i = 0; i < this.points.length; ++i) {
        this.points[i].point[0] += (dx / this.canvas.width) * 2;
        this.points[i].point[1] -= (dy / this.canvas.height) * 2;
      }
    }
  }

  onMouseClick(state: MouseState) {}

  onMouseUp(state: MouseState, pos: Point) {}
}
