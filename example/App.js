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
      },
      `hi ${this.msg}`,
    )
  },
  setup() {
    return {
      msg: 'view',
    }
  },
}
