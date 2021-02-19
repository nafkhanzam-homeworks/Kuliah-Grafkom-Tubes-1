import {constants} from "../constants";
import {createId} from "./id";
import {Shape} from "./shape";

export class Polygon extends Shape {
  renderFill() {
    const {gl} = this;

    const points = this.flatPoints();
    this.createArrayBuffer(points, constants.pointSize);

    this.applyColor(this.color);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length);
  }

  render() {
    this.renderFill();
    super.render();
  }

  addPoint(p: Point) {
    this.points.push({id: createId(), point: p});
  }

  updatePoint(index: number, p: Point) {
    this.points[index].point = p;
  }
}
