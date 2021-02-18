import {constants} from "../constants";
import {Shape} from "./shape";

export class Polygon extends Shape {
  private points: Point[] = [];
  private selected: boolean = false;

  render() {
    const {gl} = this;

    const points = this.points.flat();

    this.createArrayBuffer(points, constants.pointSize);
    this.applyColor();

    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length);
  }

  addPoint(p: Point) {
    this.points.push(p);
  }

  updatePoint(index: number, p: Point) {
    this.points[index] = p;
  }

  setSelected(value: boolean) {
    this.selected = value;
  }
}
