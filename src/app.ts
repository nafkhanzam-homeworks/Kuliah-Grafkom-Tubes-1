import {Shape} from "./shape/shape";

type Status = "SELECT" | "LINE" | "SQUARE" | "POLYGON";

export class App {
  private status: Status = "SELECT";
  private shapes: Shape[] = [];
  private mouseState: MouseState = {
    bef: [0, 0],
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

  private getPixelId(pos: Point) {
    const {gl, canvas} = this;

    const pixelX = (pos[0] * gl.canvas.width) / canvas.clientWidth;
    const pixelY = gl.canvas.height - (pos[1] * gl.canvas.height) / canvas.clientHeight - 1;
    const data = new Uint8Array(4);
    gl.readPixels(pixelX, pixelY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
    return id;
  }

  private onMouseMove(newPos: Point) {
    const el = document.getElementById("coord");
    if (el) {
      el.innerText = JSON.stringify(newPos);
    }
    this.mouseState.bef = this.mouseState.pos;
    this.mouseState.pos = newPos;
    for (const shape of this.shapes) {
      shape.onMouseMove(this.mouseState);
    }
  }

  private onMouseClick(pos: Point) {
    this.mouseState.pressed.pos = pos;
    for (const shape of this.shapes) {
      shape.onMouseClick(this.mouseState);
      shape.setSelected(false);
    }
    const clickedId = this.getPixelId(pos);
    console.log(clickedId);
    const clickedShape: Shape | undefined = this.shapes.filter((v) => v.getId() === clickedId)[0];
    if (clickedShape) {
      clickedShape.setSelected(true);
    }
  }

  private onMouseUp(pos: Point) {
    this.mouseState.pressed.pos = null;
    for (const shape of this.shapes) {
      shape.onMouseUp(this.mouseState, pos);
    }
  }

  public addShape(shape: Shape) {
    this.shapes.push(shape);
  }

  public save() {}
}
