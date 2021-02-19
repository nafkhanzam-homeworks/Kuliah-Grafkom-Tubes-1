import {constants} from "../constants";
import {Shape} from "./shape";

export class Polygon extends Shape {
  render() {
    this.renderFill();

    // if (this.selected) {
    this.renderSelected();
    this.renderPoints();
    // }
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
