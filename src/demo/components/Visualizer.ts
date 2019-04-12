import m from 'mithril'

const WIDTH = 800
const HEIGHT = 600

const CANVAS_BACKGROUND = 'black'
const WAVEFORM_PEAK_COLOR = 'rgba(255, 255, 255, 1.0)'
const WAVEFORM_BASE_COLOR = 'rgba(129, 162, 190, 1.0)'

const canvasStyle = {
  border: '1px solid black',
  width: WIDTH,
  height: HEIGHT
}

function repeatTimes(count: number, cb: (iteration: number) => void) {
  for (let i = 0; i < count; ++i) {
    cb(i)
  }
}

function setupVisualizer(canvas: HTMLCanvasElement, stream: MediaStream) {
  const audioCtx = new AudioContext()
  const canvasCtx = canvas.getContext('2d')!

  const analyzer = audioCtx.createAnalyser()
  analyzer.fftSize = 2048

  const bufferLength = analyzer.frequencyBinCount
  const audioBuffer = new Uint8Array(bufferLength)

  const source = audioCtx.createMediaStreamSource(stream)
  source.connect(analyzer)

  draw()

  function draw() {
    const { width, height } = canvas
    analyzer.getByteTimeDomainData(audioBuffer)

    canvasCtx.fillStyle = CANVAS_BACKGROUND
    canvasCtx.fillRect(0, 0, width, height)

    const sliceWidth = width / bufferLength

    let posX = 0
    let minValue = 0
    let maxValue = 0

    canvasCtx.beginPath()

    repeatTimes(bufferLength, (i: number) => {
      let value = audioBuffer[i] / 128.0
      let posY = (value * height) / 2
      if (i === 0) {
        canvasCtx.moveTo(posX, posY)
      } else {
        canvasCtx.lineTo(posX, posY)
      }
      posX += sliceWidth
    })

    const gradient = canvasCtx.createLinearGradient(0, 0, 0, HEIGHT)
    gradient.addColorStop(minValue, WAVEFORM_PEAK_COLOR)
    gradient.addColorStop(0.5, WAVEFORM_BASE_COLOR)
    gradient.addColorStop(maxValue, WAVEFORM_PEAK_COLOR)

    canvasCtx.lineWidth = 2
    canvasCtx.strokeStyle = gradient

    canvasCtx.lineTo(width, height / 2)
    canvasCtx.stroke()
    requestAnimationFrame(draw)
  }
}

interface Attrs {
  stream: Promise<MediaStream>
}

const Visualizer: m.Component<Attrs> = {
  oncreate: async (vnode: m.VnodeDOM<Attrs>) => {
    setupVisualizer(vnode.dom as HTMLCanvasElement, await vnode.attrs.stream)
  },
  view(vnode) {
    return m('canvas', { style: canvasStyle, width: WIDTH, height: HEIGHT })
  }
}

export default Visualizer
