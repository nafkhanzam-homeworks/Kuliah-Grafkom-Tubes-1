import {constants} from "../constants";
import {Shape} from "./shape";

export class Square extends Shape {
  static load(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, instance: SquareInstance): Square {
    const square = new Square(canvas, gl, instance.color);
    square.addPoint(instance.p);
    return square;
  }

  renderHitboxShape(hitboxProgram: WebGLProgram): void {
    const {gl} = this;

    const points = this./*something*/.flat();
    this.createArrayBuffer(hitboxProgram, points, constants.pointSize);

    this.assignDataId(this.id, hitboxProgram);

    gl.drawArrays(gl.TRIANGLES, 0, points.length / constants.pointSize);
    
  }

  protected renderShape() {
    const {gl, program} = this;

    const points = this./*something*/;

    this.createArrayBuffer(program, points, constants.pointSize);

    this.applyColor(program, this.color);

    gl.drawArrays(gl.TRIANGLES, 0, points.length / constants.pointSize);
  }

  getDataInstance(): SquareInstance {
    return {
      color: this.color,
      size:  ,  //needs expression but still confused
      p: this.points[0].point,
    };
  }
}