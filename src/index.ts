import {App} from "./app";

const canvas = document.getElementById("app") as HTMLCanvasElement;

const gl = canvas.getContext("webgl");

const bgColor: Color = [1, 1, 1];
const size = [1080, 720] as const;
const app = new App(canvas, gl, ...size, bgColor);

const selectBtn = document.getElementById("select") as HTMLButtonElement;
selectBtn.onclick = () => {
  app.onStatusChange("SELECT");
};

const lineBtn = document.getElementById("line") as HTMLButtonElement;
lineBtn.onclick = () => {
  app.onStatusChange("LINE");
};

const squareBtn = document.getElementById("square") as HTMLButtonElement;
squareBtn.onclick = () => {
  app.onStatusChange("SQUARE");
};

const polygonBtn = document.getElementById("polygon") as HTMLButtonElement;
polygonBtn.onclick = () => {
  app.onStatusChange("POLYGON");
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
