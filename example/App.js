import { h } from '../lib/view.es.js'

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
      },
      [
        h(
          'p',
          {},
          this.msg,
        ),
        h(
          'p',
          {},
          this.msg,
        ),
      ],
    )
  },
  setup() {
    return {
      msg: 'view',
    }
  },
}
