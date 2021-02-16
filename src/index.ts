import { App } from "./app";

const canvas = document.getElementById("app") as HTMLCanvasElement;

const gl = canvas.getContext("webgl");

const app = new App();

const render = (time: number) => {
  app.render(canvas, gl);
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
