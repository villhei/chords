import m from 'mithril'
import Home from '~/components/Home'

const root = document.getElementById('app')

if (root) {
  m.route(root, '/', {
    '/': Home
  })
}
