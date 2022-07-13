import { getCurrentInstance, h } from '../../lib/index.mjs'
export const Foo = {
  name: 'Foo',
  setup() {
    const instance = getCurrentInstance()
    console.log('Foo', instance)
    return {}
  },
  render() {
    return h('div', {}, 'foo')
  },
}
