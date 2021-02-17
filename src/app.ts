import {Shape} from "./shape/shape";

type Status = "FREE" | "SELECTING";

export class App {
  private status: Status;
  private shapes: Shape[];
  private mouseState: MouseState;
  private canvasBound: DOMRect;

  constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext) {
    this.canvasBound = canvas.getBoundingClientRect();
    canvas.addEventListener(
      "mousemove",
      (event) => {
        this.onMouseMove([
          event.clientX - this.canvasBound.left,
          event.clientY - this.canvasBound.top,
        ]);
      },
      false,
    );
    canvas.addEventListener("mousedown", (event) => {
      this.onMouseClick([
        event.clientX - this.canvasBound.left,
        event.clientY - this.canvasBound.top,
      ]);
    });
    canvas.addEventListener("mouseup", (event) => {
      this.onMouseUp([event.clientX - this.canvasBound.left, event.clientY - this.canvasBound.top]);
    });
  }

  public render(time: number) {
    const {gl, canvas} = this;
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
}
