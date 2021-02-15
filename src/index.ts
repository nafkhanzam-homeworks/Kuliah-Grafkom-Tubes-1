import {App} from "./app";

const canvas = document.getElementById("app") as HTMLCanvasElement;

const gl = canvas.getContext("webgl");

const app = new App(gl);
