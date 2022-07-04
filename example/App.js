import { h } from '../lib/view.es.js'
export default {
  render() {
    return h(
      'div',
      {
        id: 'shit',
        class: ['red', 'hard'],
      },
      [
        h('div', { class: '' }, this.msg),
        h('p', { class: '' }, 'shxt'),
      ],
    )
  },
  setup() {
    return {
      msg: 'hello',
    }
  },
}
