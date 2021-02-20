import {constants} from "../constants";
import {toDataId} from "./id";
import {Shape} from "./shape";

export class Polygon extends Shape {
  renderHitboxShape(hitboxProgram: WebGLProgram): void {
    const {gl} = this;

    const points = this.flatPoints();
    this.createArrayBuffer(hitboxProgram, points, constants.pointSize);

    this.assignDataId(this.id, hitboxProgram);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length);
  }

  protected renderShape() {
    const {gl, program} = this;

    const points = this.flatPoints();
    this.createArrayBuffer(program, points, constants.pointSize);

    this.applyColor(program, this.color);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length);
  }
}
