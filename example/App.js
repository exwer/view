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
        h('div', { class: '' }, 'fxck'),
        h('p', { class: '' }, 'shxt'),
        'hhhh',
      ],
    )
  },
  setup() {
    return {
      msg: 'view',
    }
  },
}
