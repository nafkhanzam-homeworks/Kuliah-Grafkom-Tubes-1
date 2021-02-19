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
    shapeId: -1,
  };
  private canvasBound: DOMRect;
  private hitboxProgram: WebGLProgram;
  private frameBuf: WebGLFramebuffer;
  private data: Uint8Array = new Uint8Array(4);

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

    const hitboxProgram = gl.createProgram();
    if (!hitboxProgram) {
      throw new Error("Failed when creating hitbox program!");
    }
    this.hitboxProgram = hitboxProgram;
    this.initHitboxShader();

    const texBuf = gl.createTexture();
    if (!texBuf) {
      throw new Error("Failed creating texture");
    }
    gl.bindTexture(gl.TEXTURE_2D, texBuf);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const depBuf = gl.createRenderbuffer();
    if (!depBuf) {
      throw new Error("Failed creating render buffer");
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, depBuf);

    gl.bindTexture(gl.TEXTURE_2D, texBuf);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.canvas.width,
      gl.canvas.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.bindRenderbuffer(gl.RENDERBUFFER, depBuf);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      gl.canvas.width,
      gl.canvas.height,
    );

    const frameBuf = gl.createFramebuffer();
    if (!frameBuf) {
      throw new Error("Failed creating frame buffer");
    }
    this.frameBuf = frameBuf;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuf);

    // using the texture and depth buffer with frame buffer
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texBuf, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depBuf);
  }

  private initHitboxShader() {
    const {gl, hitboxProgram} = this;

    gl.attachShader(
      hitboxProgram,
      this.createShader(
        gl.VERTEX_SHADER,
        `
          precision mediump float;

          attribute vec2 position;

          void main() {
            gl_Position = vec4(position, 0, 1);
          }
        `,
      ),
    );

    gl.attachShader(
      hitboxProgram,
      this.createShader(
        gl.FRAGMENT_SHADER,
        `
          precision mediump float;

          uniform vec4 dataId;

          void main() {
            gl_FragColor = dataId;
          }
        `,
      ),
    );

    gl.linkProgram(hitboxProgram);
  }

  protected createShader(shaderType: number, source: string): WebGLShader {
    const shader = this.gl.createShader(shaderType);
    if (!shader) {
      throw new Error("Failed when creating shader!");
    }
    this.gl.shaderSource(
      shader,
      // varying is for gradient
      source,
    );
    this.gl.compileShader(shader);
    return shader;
  }

  private getMousePoint(event: MouseEvent): Point {
    return [event.clientX - this.canvasBound.left, event.clientY - this.canvasBound.top];
  }

  public onStatusChange(newStatus: Status) {
    this.status = newStatus;
  }

  public render(_time: number) {
    const {gl, hitboxProgram} = this;

    gl.clearColor(...this.backgroundColor, 1);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // drawing texture
    const frameBuffer = this.frameBuf;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(hitboxProgram);
    for (const shape of this.shapes) {
      shape.renderHitbox(hitboxProgram);
    }

    this.mouseState.shapeId = this.getPixelId(this.mouseState.pos);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    for (const shape of this.shapes) {
      shape.render();
    }
  }

  private getPixelId(pos: Point) {
    const {gl, canvas} = this;

    const pixelX = pos[0]; // (pos[0] / canvas.width) * 2 - 1;
    const pixelY = canvas.height - pos[1]; // ((canvas.height - pos[1]) / canvas.height) * 2 - 1;
    const data = new Uint8Array(4);
    gl.readPixels(pixelX, pixelY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    this.data = data;
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
    const clickedId = this.mouseState.shapeId;
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
