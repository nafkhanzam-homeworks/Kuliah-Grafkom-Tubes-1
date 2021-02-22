import {constants} from "../constants";
import {Shape} from "./shape";

export class Square extends Shape {
  private size: number = 0;

  static load(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, instance: SquareInstance): Square {
    const square = new Square(canvas, gl, instance.color);
    square.addPoint(instance.p);
    square.setSize(instance.size);
    return square;
  }

  renderHitboxShape(hitboxProgram: WebGLProgram): void {
    const {gl} = this;

    const points = this.getAllPoints().flat();
    this.createArrayBuffer(hitboxProgram, points, constants.pointSize);

    this.assignDataId(this.id, hitboxProgram);

    gl.drawArrays(gl.TRIANGLES, 0, points.length / constants.pointSize);
    
  }

  public setSize(size: number) {
    this.size = size;
    const points = this.getAllPoints();
    points.forEach(point => {
      this.addPoint(point)
    })
  }

  protected renderShape() {
    const {gl, program} = this;

    const points = this.getAllPoints().flat();

    this.createArrayBuffer(program, points, constants.pointSize);

    this.applyColor(program, this.color);

    gl.drawArrays(gl.TRIANGLES, 0, points.length / constants.pointSize);
  }

  public getAllPoints(): Point[] {
    const point = this.points[0].point;
    const x: number = point[0];
    const y: number = point[1];
    console.log(x);
    console.log(y);
    return [point,[x+this.size,y],[x+this.size,y+this.size],[x,y+this.size]];
  }

  getDataInstance(): SquareInstance {
    return {
      color: this.color,
      size: this.size,
      p: this.points[0].point,
    };
  }
}