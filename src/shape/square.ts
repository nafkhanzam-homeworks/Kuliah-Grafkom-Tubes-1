import {constants} from "../constants";
import {Shape} from "./shape";

export class Square extends Shape {
  private size: number;

  public constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, color: Color, size: number){
    super(canvas, gl, color);
    this.size = size;
  }

  static load(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, instance: SquareInstance): Square {
    const square = new Square(canvas, gl, instance.color, instance.size);
    square.addPoint(instance.p);
    return square;
  }

  renderHitboxShape(hitboxProgram: WebGLProgram): void {
    const {gl} = this;

    const points = this.getSquareVertices().flat();
    this.createArrayBuffer(hitboxProgram, points, constants.pointSize);

    this.assignDataId(this.id, hitboxProgram);

    gl.drawArrays(gl.TRIANGLES, 0, points.length / constants.pointSize);
    
  }

  protected renderShape() {
    const {gl, program} = this;

    const points = this.getSquareVertices();

    this.createArrayBuffer(program, points, constants.pointSize);

    this.applyColor(program, this.color);

    gl.drawArrays(gl.TRIANGLES, 0, points.length / constants.pointSize);
  }

  private getSquareVertices() {
    const points = this.points[0];
    const x = 0;
    const y = 0;
    return ();
  }

  getDataInstance(): SquareInstance {
    return {
      color: this.color,
      size: this.size,
      p: this.points[0].point,
    };
  }
}