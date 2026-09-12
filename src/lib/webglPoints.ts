const VERTEX_SHADER = `
attribute vec2 aPosition;
attribute float aAlpha;
attribute float aSize;
uniform vec2 uResolution;
uniform float uDpr;
varying float vAlpha;
void main() {
  vec2 clip = aPosition * 2.0 / uResolution;
  gl_Position = vec4(clip.x, clip.y, 0.0, 1.0);
  gl_PointSize = aSize * uDpr;
  vAlpha = aAlpha;
}
`

const FRAGMENT_SHADER = `
precision mediump float;
varying float vAlpha;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  float a = smoothstep(1.0, 0.45, r) * max(vAlpha, 0.0);
  if (a < 0.004) discard;
  gl_FragColor = vec4(vec3(0.87, 0.96, 1.0) * a, a);
}
`

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

export type PointRenderer = {
  /** Resize the drawing buffer; coordinates stay in CSS pixels. */
  resize: (width: number, height: number, dpr: number) => void
  /** Upload per-frame particle buffers (positions are center-origin, y-up, CSS px). */
  upload: (positions: Float32Array, alphas: Float32Array, sizes: Float32Array) => void
  draw: () => void
  dispose: () => void
}

export function createPointRenderer(canvas: HTMLCanvasElement): PointRenderer | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
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
  const aAlpha = gl.getAttribLocation(program, 'aAlpha')
  const aSize = gl.getAttribLocation(program, 'aSize')
  const uResolution = gl.getUniformLocation(program, 'uResolution')
  const uDpr = gl.getUniformLocation(program, 'uDpr')

  const positionBuffer = gl.createBuffer()
  const alphaBuffer = gl.createBuffer()
  const sizeBuffer = gl.createBuffer()
  if (!positionBuffer || !alphaBuffer || !sizeBuffer) return null

  gl.disable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  // Particle count is implied by the last upload; draw() reads it from here.
  let drawCount = 0
  // Track allocated byte sizes so per-frame uploads reuse the GPU buffer
  // (bufferSubData) instead of reallocating it (bufferData) every frame.
  const capacities = new Map<WebGLBuffer, number>()

  const uploadBuffer = (buffer: WebGLBuffer, data: Float32Array, usage: number) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    const bytes = data.byteLength
    if (capacities.get(buffer) !== bytes) {
      gl.bufferData(gl.ARRAY_BUFFER, data, usage)
      capacities.set(buffer, bytes)
      return
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data)
  }

  const bindAttribute = (buffer: WebGLBuffer, location: number, size: number) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(location)
  }

  return {
    resize(width, height, dpr) {
      const drawWidth = Math.round(width * dpr)
      const drawHeight = Math.round(height * dpr)
      if (canvas.width !== drawWidth || canvas.height !== drawHeight) {
        canvas.width = drawWidth
        canvas.height = drawHeight
      }
      gl.viewport(0, 0, drawWidth, drawHeight)
      gl.uniform2f(uResolution, width, height)
      gl.uniform1f(uDpr, dpr)
    },
    upload(positions, alphas, sizes) {
      drawCount = alphas.length
      uploadBuffer(positionBuffer, positions, gl.DYNAMIC_DRAW)
      uploadBuffer(alphaBuffer, alphas, gl.DYNAMIC_DRAW)
      uploadBuffer(sizeBuffer, sizes, gl.STATIC_DRAW)
      bindAttribute(positionBuffer, aPosition, 2)
      bindAttribute(alphaBuffer, aAlpha, 1)
      bindAttribute(sizeBuffer, aSize, 1)
    },
    draw() {
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.POINTS, 0, drawCount)
    },
    dispose() {
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(alphaBuffer)
      gl.deleteBuffer(sizeBuffer)
      gl.deleteProgram(program)
    },
  }
}
