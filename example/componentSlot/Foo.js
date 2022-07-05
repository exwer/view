import { h, renderSlots } from '../../lib/view.es.js'

export const Foo = {
  setup() {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo')
    return h('div', {}, [foo, renderSlots(this.$slots)])
  },
}
