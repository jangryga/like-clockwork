import * as webglUtils from "./webGLUtils";

interface SceneContext {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  positionAttributeLocation: number;
  positionBuffer: WebGLBuffer;
  rectangle: {
    translation: [number, number];
    width: number;
    height: number;
    color: [number, number, number, number];
  };
}

export function drawScene({
  gl,
  program,
  positionAttributeLocation,
  positionBuffer,
  rectangle,
}: SceneContext) {
  webglUtils.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  webglUtils.setRectangle(
    gl,
    rectangle.translation[0],
    rectangle.translation[1],
    rectangle.width,
    rectangle.height,
  );

  const size = 2; // 2 components per iteration
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0;

  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset,
  );

  const resolutionUniformLocation = gl.getUniformLocation(
    program!,
    "u_resolution",
  );
  const colorUniformLocation = gl.getUniformLocation(program!, "u_color");

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  gl.uniform4fv(colorUniformLocation, rectangle.color);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
