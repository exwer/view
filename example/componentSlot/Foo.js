import { h } from '../../lib/view.es.js'

export const Foo = {
  setup() {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo')

    return h('div', {}, [foo, this.$slots])
  },
}
