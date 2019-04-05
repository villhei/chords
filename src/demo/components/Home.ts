import m from 'mithril'
import Nav from '~/components/Nav'

const Home: m.Component = {
  view(vnode) {
    return m('.page', [
      m(Nav),
      m('h1', "Let's interface with audio"),
      m('p', 'This is the home page.')
    ])
  }
}

export default Home
