import {Shape} from "./shape";

export class Polygon extends Shape {
  render() {
    super.render();
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
