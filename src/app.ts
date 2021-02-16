import MultiColorTriangle from "./shapes/multicolortriangle";
import ThreeLine from "./shapes/threeline";

export class App {
  constructor() {}

  public render(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
    const triangle: MultiColorTriangle = new MultiColorTriangle(canvas, gl);
    const threeLine: ThreeLine = new ThreeLine(canvas, gl);
    // triangle.render();
    threeLine.render();
  }
}
