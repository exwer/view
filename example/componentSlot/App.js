import { h } from '../../lib/view.es'
import { Foo } from './Foo'

export default {
  name: 'App',
  setup() {
    return {}
  },
  render() {
    const app = h('div', {}, 'App')
    const foo = h(Foo, {}, h('p', {}, '123'))

    return h('div', {}, [app, foo])
  },
}
