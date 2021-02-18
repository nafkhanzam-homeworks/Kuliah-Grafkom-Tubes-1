import {Shape} from "./shape/shape";

type Status = "SELECT" | "LINE" | "SQUARE" | "POLYGON";

export class App {
  private status: Status = "SELECT";
  private shapes: Shape[] = [];
  private mouseState: MouseState = {
    pos: [0, 0],
    pressed: {
      pos: null,
    },
  };
  private canvasBound: DOMRect;

  constructor(
    private canvas: HTMLCanvasElement,
    private gl: WebGLRenderingContext,
    width: number,
    height: number,
    private backgroundColor: Color,
  ) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    this.canvasBound = canvas.getBoundingClientRect();
    canvas.addEventListener(
      "mousemove",
      (event) => {
        this.onMouseMove(this.getMousePoint(event));
      },
      false,
    );
    canvas.addEventListener("mousedown", (event) => {
      this.onMouseClick(this.getMousePoint(event));
    });
    canvas.addEventListener("mouseup", (event) => {
      this.onMouseUp(this.getMousePoint(event));
    });
  }

  private getMousePoint(event: MouseEvent): Point {
    return [event.clientX - this.canvasBound.left, event.clientY - this.canvasBound.top];
  }

  public onStatusChange(newStatus: Status) {
    this.status = newStatus;
  }

  public render(time: number) {
    const {gl, canvas} = this;

    gl.clearColor(...this.backgroundColor, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (const shape of this.shapes) {
      shape.render();
    }
  }

  private onMouseMove(newPos: Point) {
    this.mouseState.pos = newPos;
  }

  private onMouseClick(pos: Point) {
    this.mouseState.pressed.pos = pos;
  }

  private onMouseUp(pos: Point) {
    this.mouseState.pressed.pos = null;
  }

  public addShape(shape: Shape) {
    this.shapes.push(shape);
  }

  public save() {}
}
