import {constants} from "../constants";
import {Shape} from "./shape";

export class Line extends Shape {
  static load(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, instance: LineInstance): Line {
    const line = new Line(canvas, gl, instance.color);
    return line;
  }

  renderHitboxShape(hitboxProgram: WebGLProgram): void {
    const {gl} = this;

    const points = this.getFlatPoints();

    this.createArrayBuffer(hitboxProgram, points, constants.pointSize);

    this.assignDataId(this.id, hitboxProgram);

    gl.drawArrays(gl.LINES, 0, points.length / constants.pointSize);
  }

  protected renderShape() {
    const {gl, program} = this;

    const points = this.getFlatPoints();

    this.createArrayBuffer(program, points, constants.pointSize);

    this.applyColor(program, this.color);

    gl.drawArrays(gl.LINES, 0, points.length / constants.pointSize);
  }

  getFlatPoints(): number[] {
    return this.points.map((point) => point.point).flat();
  }

  getDataInstance(): PolygonInstance {
    return {
      color: this.color,
      points: this.points.map((v) => v.point),
    };
  }
}
