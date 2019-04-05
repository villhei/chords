import m from 'mithril'

const Nav: m.Component = {
  view(vnode) {
    return m('div', m('a', { href: '/', oncreate: m.route.link }, 'Home'))
  }
}

export default Nav
