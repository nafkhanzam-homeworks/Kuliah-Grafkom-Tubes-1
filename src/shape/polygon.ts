import {constants} from "../constants";
import {Shape} from "./shape";

export class Polygon extends Shape {
  renderHitboxShape(hitboxProgram: WebGLProgram): void {
    const {gl} = this;

    const points = this.flatPoints(true);
    this.createArrayBuffer(hitboxProgram, points, constants.pointSize);

    this.assignDataId(this.id, hitboxProgram);

    let len = this.points.length;
    if (this.drawingPoint) {
      ++len;
    }
    gl.drawArrays(gl.TRIANGLE_FAN, 0, len);
  }

  protected renderShape() {
    const {gl, program} = this;

    const points = this.flatPoints(true);
    this.createArrayBuffer(program, points, constants.pointSize);

    this.applyColor(program, this.color);

    let len = this.points.length;
    if (this.drawingPoint) {
      ++len;
    }
    gl.drawArrays(gl.TRIANGLE_FAN, 0, len);
  }

  onDrawingApplyPressed(state: MouseState) {
    super.onDrawingApplyPressed(state);
    const pos = this.drawingPoint || state.pos;
    this.addPoint(pos);
  }

  getDataInstance(): PolygonInstance {
    return {
      color: this.color,
      points: this.points.map((v) => v.point),
    };
  }
}
