const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("Webgl not supported");
}

//prettier-ignore
const matrix = [1, 0, 0, 0, 
  0, 1, 0, 0, 
  0, 0, 1, 0, 
  10, 10, 10, 1];

// vertexData = [...] x,y,z , x,y,z
// prettier-ignore
const vertexData = [0, 1, 0, 
  1, -1, 0, 
  -1, -1, 0];
// prettier-ignore
const colorData = [1, 0, 0, 
  0, 1, 0, 
  0, 0, 1]; // rgb value

// create buffer
const positionBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();

// load vertexdata into buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

// load colordata to buffer
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

// create vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  // varying is for gradient
  `
precision mediump float;

attribute vec3 color;
attribute vec3 position;
varying vec3 vColor;

void main() {
  vColor = color;
  gl_Position = vec4(position, 1);
}
`
);
gl.compileShader(vertexShader);

// create fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
  precision mediump float;
  
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1);
}
`
);
gl.compileShader(fragmentShader);
// create program
const program = gl.createProgram();

// attach shaders to program
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// enable vertex attributes
const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

// enable color attribute
const colorLocation = gl.getAttribLocation(program, "color");
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);

// draw

//triangle
