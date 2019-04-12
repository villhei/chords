import m from 'mithril'
import Nav from '~/components/Nav'
import Visualizer from '~/components/Visualizer'

import sineSwepUrl from '~/sine_sweep_10hz_10khz.wav'

function getMicrophoneStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({ audio: true })
}

async function getSineSweep(): Promise<MediaStream> {
  const audio = new Audio(sineSwepUrl)
  audio.muted = true
  audio.loop = true
  await audio.play()
  return audio.captureStream()
}

const canvasSize = {
  width: 512,
  height: 200
}

const Home = (iNode: m.Vnode): m.Component => {
  const microphoneStream: Promise<MediaStream> = getMicrophoneStream()
  const sineSweep: Promise<MediaStream> = getSineSweep()
  return {
    view(vnode) {
      return m('.page', [
        m(Nav),
        m('h1', "Let's interface with audio"),
        m('h3', 'Microphone input'),
        m(Visualizer, {
          ...canvasSize,
          stream: microphoneStream
        }),
        m('h3', 'Sine sweep'),
        m(Visualizer, {
          ...canvasSize,
          stream: sineSweep
        })
      ])
    }
  }
}

export default Home
