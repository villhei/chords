import m from 'mithril'

const CANVAS_BACKGROUND = 'black'
const WAVEFORM_PEAK_COLOR = 'rgba(129, 162, 190, 1.0)'

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
  analyzer.smoothingTimeConstant = 0

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

    canvasCtx.lineWidth = 2
    canvasCtx.strokeStyle = WAVEFORM_PEAK_COLOR

    canvasCtx.lineTo(width, height / 2)
    canvasCtx.stroke()
    requestAnimationFrame(draw)
  }
}

interface Attrs {
  stream: Promise<MediaStream>
  width: number
  height: number
}

const Visualizer: m.Component<Attrs> = {
  oncreate: async (vnode: m.VnodeDOM<Attrs>) => {
    setupVisualizer(vnode.dom as HTMLCanvasElement, await vnode.attrs.stream)
  },
  view(vnode) {
    const { width, height } = vnode.attrs
    const canvasStyle = {
      border: '1px solid black',
      width,
      height
    }

    return m('canvas', { style: canvasStyle, width, height })
  }
}

export default Visualizer
