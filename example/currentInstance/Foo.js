import { getCurrentInstance, h } from '../../lib/view.es.js'
export const Foo = {
  setup() {
    const instance = getCurrentInstance()
    console.log('Foo', instance)
    return {}
  },
  render() {
    return h('div', {}, 'foo')
  },
}
