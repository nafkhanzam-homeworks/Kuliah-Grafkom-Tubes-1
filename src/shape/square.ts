import {constants} from "../constants";
import {createId} from "./id";
import {Shape} from "./shape";

export class Square extends Shape {
  constructor(
    private point: Point,
    private size: number,
    ...args: AbstractContructorParameters<typeof Shape>
  ) {
    super(...args);
    this.updatePoints();
  }

  static load(
    canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    instance: SquareInstance,
  ): Square {
    return new Square(instance.p, instance.size, canvas, gl, instance.color);
  }

  renderHitboxShape(hitboxProgram: WebGLProgram): void {
    const {gl} = this;

    const points = this.getAllPoints().flat();
    this.createArrayBuffer(hitboxProgram, points, constants.pointSize);

    this.assignDataId(this.id, hitboxProgram);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / constants.pointSize);
  }

  public setSize(size: number) {
    this.size = size;
    this.updatePoints();
  }

  protected renderShape() {
    const {gl, program} = this;

    const points = this.getAllPoints().flat();

    this.createArrayBuffer(program, points, constants.pointSize);

    this.applyColor(program, this.color);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / constants.pointSize);
  }

  private updatePoints() {
    const target = this.getAllPoints();
    for (let i = 0; i < 4; ++i) {
      const p = this.points[i];
      this.points[i] = {
        id: p?.id ?? createId(),
        point: target[i],
      };
    }
  }

  public getAllPoints(): Point[] {
    const [x, y] = this.point;
    return [
      [x, y],
      [x + this.size, y],
      [x + this.size, y + this.size],
      [x, y + this.size],
    ];
  }

  getDataInstance(): SquareInstance {
    return {
      color: this.color,
      size: this.size,
      p: this.point,
    };
  }
}
