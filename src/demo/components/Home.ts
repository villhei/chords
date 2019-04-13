import m from 'mithril'
import Nav from '~/components/Nav'
import FrequencyVisualizer from '~/components/FrequencyVisualizer'

import Visualizer from '~/components/Visualiser'

import sineSweepUrl from '~/sine_sweep_10hz-10khz.wav'
import sineSweepFullRangeUrl from '~/sine_sweep_20hz-22khz.wav'

function getMicrophoneStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({ audio: true })
}

async function getMediaFileAsStream(
  url: string,
  isMuted: boolean = true
): Promise<MediaStream> {
  const audio = new Audio(url)
  audio.muted = isMuted
  audio.loop = true
  await audio.play()
  audio.playbackRate = 1.0
  return audio.captureStream()
}

function formatName(fileUri: string) {
  const [file, , extension] = fileUri.split('.')
  return [file, extension].join('.')
}

const canvasSize = {
  width: 512,
  height: 200
}

const Home = (iNode: m.Vnode): m.Component => {
  const microphoneStream: Promise<MediaStream> = getMicrophoneStream()
  let allowPlayback = false

  return {
    oncreate(vnode: m.VnodeDOM) {
      const startPlayback = () => {
        allowPlayback = true
        document.removeEventListener('click', startPlayback)
        m.redraw()
      }
      document.addEventListener('click', startPlayback)
    },
    view(vnode) {
      const mediaView = [sineSweepUrl, sineSweepFullRangeUrl]
        .filter(() => allowPlayback)
        .map(fileName => [fileName, getMediaFileAsStream(fileName)])
        .map(([fileName, stream]) => [
          m('h3', 'Datasource: ' + formatName(fileName)),
          m('checkbox', {
            checked: false
          }),
          m('h4', 'Time domain'),
          m(Visualizer, {
            ...canvasSize,
            stream
          }),
          m('h4', 'Frequency domain'),
          m(FrequencyVisualizer, {
            ...canvasSize,
            stream
          })
        ])
        .reduce((acc, item) => acc.concat(...item), [])
      return m(
        '.page',
        [
          m(Nav),
          m('h1', "Let's interface with audio"),
          m(
            'p',
            'Click somewhere on the page so that muted autoplay can be started'
          ),
          m('h3', 'Microphone input'),
          m(Visualizer, {
            ...canvasSize,
            stream: microphoneStream
          })
        ].concat(mediaView)
      )
    }
  }
}

export default Home
