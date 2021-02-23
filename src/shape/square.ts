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

  private updateBy2Points(a: Point, b: Point) {
    const size = Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
    const x = Math.min(a[0], b[0]);
    const y = Math.min(a[1], b[1]);
    this.point = [x, y];
    this.size = size;
    this.updatePoints();
  }

  getDataInstance(): ShapeInstance {
    return {
      type: "square",
      object: {
        color: this.color,
        size: this.size,
        p: this.point,
      },
    };
  }

  private getSizeToPoint(p: Point) {
    return Math.max(Math.abs(p[0] - this.point[0]), Math.abs(p[1] - this.point[1]));
  }

  setDrawingPoint(p: Point | null) {
    super.setDrawingPoint(p);
    if (p) {
      this.setSize(this.getSizeToPoint(p));
    }
  }

  onDrawingApplyPressed(): void {}

  onSelectedMouseMove(id: number, [dx, dy]: [number, number], [x, y]: Point): void {
    if (id === this.id) {
      this.point[0] += dx;
      this.point[1] += dy;
      this.updatePoints();
    } else {
      const i = this.points.findIndex((v) => v.id === id);
      if (i >= 0 && i < this.points.length) {
        this.updateBy2Points([x, y], this.points[(i + 2) % 4].point);
      }
    }
  }

  onDrawingMouseUp(state: MouseState, pos: Point): boolean {
    if (this.drawingPoint) {
      this.setDrawingPoint(null);
      return true;
    }
    return false;
  }

  onDrawingMouseMove(state: MouseState) {
    super.onDrawingMouseMove(state);
    this.drawingPoint && this.updateBy2Points(this.point, this.drawingPoint);
  }

  onDrawingMouseDown(pos: Point) {
    this.updateBy2Points(pos, pos);
  }
}
