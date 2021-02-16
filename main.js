const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("Webgl not supported");
}

// vertexData = [...] x,y,z , x,y,z
const vertexData = [0, 1, 0, 1, -1, 0, -1, -1, 0];

// create buffer
const buffer = gl.createBuffer();

// load vertexdata into buffer
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

// create vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  `
attribute vec3 position;
void main() {
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
void main() {
  gl_FragColor = vec4(1,0,0,1);
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

// enable verte attributes
const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);

// draw

//triangle
