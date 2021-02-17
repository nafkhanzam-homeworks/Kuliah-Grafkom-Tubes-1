type Status = "FREE" | "SELECTING";

export class App {
  private status: Status;
  private shapes: Shape[];
  private mouseState: MouseState;

  constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext) {
    canvas.addEventListener(
      "mousemove",
      (event) => {
        const bound = canvas.getBoundingClientRect();
        const pos = {
          x: event.clientX - bound.left,
          y: event.clientY - bound.top,
        };
        this.onMouseEvent({
          ...this.mouseState,
          pos,
        });
      },
      false,
    );
  }

  public render(time: number) {
    const {gl, canvas} = this;
    console.log(this.mouseState);
  }

  public onMouseEvent(newState: MouseState) {
    this.mouseState = newState;
  }
}
