// Textured quad with the reference site's "shattered glass" shaders: the vertex stage
// bends the quad along a cosine falloff and the fragment stage splits the R/G/B samples
// in the direction of pointer travel. Displacement magnitudes are proportional to speed.

const VERTEX_SHADER = `
attribute vec2 aPosition;
attribute vec2 aUv;
uniform vec2 uResolution;
uniform mediump vec2 uSpeed;
uniform float uOffset;
varying vec2 vUv;
const float PI = 3.1415926535897932384626433832795;
float getOffset(float n, float aspect, float o) {
  return cos((n - 0.5) * PI / 2.0) * aspect * o;
}
void main() {
  vUv = aUv;
  vec2 displacement = vec2(
    getOffset(aUv.y, uSpeed.x, uOffset),
    getOffset(aUv.x, uSpeed.y, uOffset)
  );
  vec2 p = aPosition + displacement / uResolution;
  gl_Position = vec4(p * 2.0, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D uTexture;
uniform vec2 uSpeed;
varying vec2 vUv;
const float PI = 3.1415926535897932384626433832795;
float getOffest(float n, float speed, float offset) {
  return cos((n - 0.5) * PI / 2.0) * speed * offset;
}
void main() {
  vec4 color = texture2D(uTexture, vUv).rgba;
  float oR = 0.015;
  float oG = 0.03;
  float oB = 0.045;
  vec2 uvR = vUv + vec2(getOffest(vUv.y, uSpeed.x, oR), getOffest(vUv.x, uSpeed.y, oR));
  vec2 cR = texture2D(uTexture, uvR).ra;
  vec4 acc = vec4(cR.x * cR.y, 0.0, 0.0, cR.y);
  vec2 uvG = vUv + vec2(getOffest(vUv.y, uSpeed.x, oG), getOffest(vUv.x, uSpeed.y, oG));
  vec2 cG = texture2D(uTexture, uvG).ga;
  acc += vec4(0.0, cG.x * cG.y, 0.0, cG.y);
  vec2 uvB = vUv + vec2(getOffest(vUv.y, uSpeed.x, oB), getOffest(vUv.x, uSpeed.y, oB));
  vec2 cB = texture2D(uTexture, uvB).ba;
  acc += vec4(0.0, 0.0, cB.x * cB.y, cB.y);
  float a = clamp(acc.a, 0.0, 1.0);
  gl_FragColor = vec4(acc.rgb * a, a);
}
`

const GRID_SEGMENTS = 96

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export type QuadRenderer = {
  resize: (width: number, height: number, dpr: number) => void
  setTexture: (image: HTMLImageElement) => void
  draw: (speed: { x: number; y: number }) => void
  dispose: () => void
}

export function createQuadRenderer(canvas: HTMLCanvasElement): QuadRenderer | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    depth: false,
    premultipliedAlpha: true,
  })
  if (!gl) return null

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  if (!vertexShader || !fragmentShader) return null

  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null
  gl.useProgram(program)

  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const aUv = gl.getAttribLocation(program, 'aUv')
  const uResolution = gl.getUniformLocation(program, 'uResolution')
  const uSpeed = gl.getUniformLocation(program, 'uSpeed')
  const uOffset = gl.getUniformLocation(program, 'uOffset')

  // Subdivided grid so the vertex-stage bending stays smooth.
  const seg = GRID_SEGMENTS
  const positions = new Float32Array((seg + 1) * (seg + 1) * 2)
  const uvs = new Float32Array((seg + 1) * (seg + 1) * 2)
  const indices = new Uint16Array(seg * seg * 6)
  let v = 0
  for (let y = 0; y <= seg; y += 1) {
    for (let x = 0; x <= seg; x += 1) {
      positions[v * 2] = x / seg - 0.5
      positions[v * 2 + 1] = y / seg - 0.5
      uvs[v * 2] = x / seg
      uvs[v * 2 + 1] = y / seg
      v += 1
    }
  }
  let t = 0
  for (let y = 0; y < seg; y += 1) {
    for (let x = 0; x < seg; x += 1) {
      const a = y * (seg + 1) + x
      const b = a + 1
      const c = a + seg + 1
      const d = c + 1
      indices[t] = a
      indices[t + 1] = c
      indices[t + 2] = b
      indices[t + 3] = b
      indices[t + 4] = c
      indices[t + 5] = d
      t += 6
    }
  }

  const positionBuffer = gl.createBuffer()
  const uvBuffer = gl.createBuffer()
  const indexBuffer = gl.createBuffer()
  const texture = gl.createTexture()
  if (!positionBuffer || !uvBuffer || !indexBuffer || !texture) return null

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPosition)
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aUv)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  gl.disable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  return {
    resize(width, height, dpr) {
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uResolution, width, height)
      // 300px reference-site displacement budget on a 1000px plane, scaled to this canvas.
      gl.uniform1f(uOffset, (width / 1000) * 300)
    },
    setTexture(image) {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    },
    draw(speed) {
      gl.uniform2f(uSpeed, speed.x, speed.y)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
    },
    dispose() {
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(uvBuffer)
      gl.deleteBuffer(indexBuffer)
      gl.deleteTexture(texture)
      gl.deleteProgram(program)
    },
  }
}
