import {App} from "./app";
import {Polygon} from "./shape/polygon";
import {Shape} from "./shape/shape";

const canvas = document.getElementById("app") as HTMLCanvasElement;

const gl = canvas.getContext("webgl2");
if (!gl) {
  throw new Error("WebGL2 context is null!");
}

const bgColor: Color = [1, 1, 1];
const size = [720, 720] as const;

const newApp = () => new App(canvas, gl, ...size, bgColor);
let app = newApp();

const polygon = new Polygon(canvas, gl, [1, 0, 0]);
polygon.addPoint([1, 0.75]);
polygon.addPoint([0.75, -1]);
polygon.addPoint([0.5, 0.5]);
polygon.addPoint([-1, -0.75]);
polygon.addPoint([-0.75, 1]);
app.addShape(polygon);

const selectBtn = document.getElementById("select") as HTMLButtonElement;
const lineBtn = document.getElementById("line") as HTMLButtonElement;
const squareBtn = document.getElementById("square") as HTMLButtonElement;
const polygonBtn = document.getElementById("polygon") as HTMLButtonElement;
const btns = [selectBtn, lineBtn, squareBtn, polygonBtn];
selectBtn.disabled = true;
selectBtn.onclick = () => {
  app.onStatusChange("SELECT");
  for (const btn of btns) {
    btn.disabled = false;
  }
  selectBtn.disabled = true;
};

lineBtn.onclick = () => {
  app.onStatusChange("LINE");
  for (const btn of btns) {
    btn.disabled = false;
  }
  lineBtn.disabled = true;
};

squareBtn.onclick = () => {
  app.onStatusChange("SQUARE");
  for (const btn of btns) {
    btn.disabled = false;
  }
  squareBtn.disabled = true;
};

polygonBtn.onclick = () => {
  app.onStatusChange("POLYGON");
  for (const btn of btns) {
    btn.disabled = false;
  }
  polygonBtn.disabled = true;
};

const render = (time: number) => {
  app.render(time);
  window.requestAnimationFrame(render);
};

window.requestAnimationFrame(render);

function showHelp() {
  alert("help");
}

const helpButton = document.getElementById("help") as HTMLButtonElement;
helpButton.addEventListener("click", () => {
  showHelp();
});

const loadApp = (appInstance: AppInstance) => {
  try {
    const loadedApp = newApp();
    const {shapes} = appInstance;
    for (const shape of shapes.reverse()) {
      let res: Shape | null = null;
      if (shape.type === "polygon") {
        res = Polygon.load(canvas, gl, shape.object);
      } else if (shape.type === "line") {
      } else if (shape.type === "square") {
      }
      if (res) {
        loadedApp.addShape(res);
      }
    }
    app = loadedApp;
  } catch (error) {
    alert(error);
  }
};

let file: File | null = null;
const fileInput = document.getElementById("file") as HTMLInputElement;
fileInput.onchange = () => {
  file = fileInput.files?.item(0) ?? null;
};

const loadButton = document.getElementById("load") as HTMLButtonElement;
loadButton.onclick = () => {
  if (!file) {
    alert("Belum ada file yang dipilih");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    const result = event.target?.result;
    if (typeof result === "string") {
      loadApp(JSON.parse(result));
    }
  });
  reader.readAsText(file);
};

function download(filename: string, content: string) {
  var element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const saveButton = document.getElementById("save") as HTMLButtonElement;
saveButton.onclick = () => {
  download("cad-data.json", JSON.stringify(app.getDataInstance()));
};
