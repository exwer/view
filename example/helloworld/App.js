import { h } from '../../lib/view.es.js'
import { Foo } from './Foo.js'

// 方便调试this
window.self = null

export default {
  render() {
    window.self = this

    return h(
      'div',
      {
        id: 'shit',
        class: ['red', 'hard'],
        onClick() {
          console.log('click')
        },
        onMouseDown() {
          console.log('mousedown')
        },
      },
      [
        h('div', {}, this.msg),
        h(Foo, { count: 1 }),
      ],
    )
  },
  setup() {
    return {
      msg: 'view',
    }
  },
}
