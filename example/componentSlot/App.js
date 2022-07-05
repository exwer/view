import { h } from '../../lib/view.es.js'
import { Foo } from './Foo.js'

export default {
  name: 'App',
  setup() {
    return {}
  },
  render() {
    const app = h('div', {}, 'App')

    const foo = h(Foo, {},
      {
        header: h('p', {}, '123'),
        footer: h('p', {}, '456'),
      })

    return h('div', {}, [app, foo])
  },
}
