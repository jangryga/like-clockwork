import { useEffect, useRef } from "react";
import * as webglUtils from "../lib/webGLUtils";
import { fsGLSL, vsGLSL } from "../lib/shaders";
import { drawScene } from "../lib/drawScene";

export function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("Failed to create access WebGL context");
      return;
    }
    const vertexShader = webglUtils.createShader(gl, gl.VERTEX_SHADER, vsGLSL);
    const fragmentShader = webglUtils.createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fsGLSL,
    );
    if (!vertexShader || !fragmentShader) {
      console.error("Failed to create shaders.");
      return;
    }
    const program = webglUtils.createProgram(gl, vertexShader, fragmentShader);

    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positionAttributeLocation = gl.getAttribLocation(
      program!,
      "a_position",
    );

    if (!program || !positionBuffer) return;

    drawScene({
      gl,
      program,
      positionAttributeLocation,
      positionBuffer,
      rectangle: {
        translation: [0, 0],
        height: 30,
        width: 100,
        color: [Math.random(), Math.random(), Math.random(), 1],
      },
    });

    // for (let i = 0; i < 50; ++i) {
    //   webglUtils.setRectangle(
    //     gl,
    //     webglUtils.randomInt(300),
    //     webglUtils.randomInt(300),
    //     webglUtils.randomInt(300),
    //     webglUtils.randomInt(300),
    //   );

    //   gl.uniform4f(
    //     colorUniformLocation!,
    //     Math.random(),
    //     Math.random(),
    //     Math.random(),
    //     1,
    //   );
    //   gl.drawArrays(gl.TRIANGLES, 0, 6);
    // }
  }, []);
  return (
    <canvas
      className="border"
      width={400}
      ref={canvasRef}
      height={300}
    ></canvas>
  );
}
