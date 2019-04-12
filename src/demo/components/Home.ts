import m from 'mithril'
import Nav from '~/components/Nav'
import Visualizer from '~/components/Visualizer'

function setupAudioStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({ audio: true })
}

const Home = (iNode: m.Vnode): m.Component => {
  const stream: Promise<MediaStream> = setupAudioStream()
  return {
    view(vnode) {
      return m('.page', [
        m(Nav),
        m('h1', "Let's interface with audio"),
        m('p', 'This is the home page.'),
        m(Visualizer, {
          stream
        })
      ])
    }
  }
}

export default Home
