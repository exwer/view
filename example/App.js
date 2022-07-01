import { h } from '../lib/view.es.js'
export default {
  render() {
    return h('div', `hi, ${this.msg}`)
  },
  setup() {
    return {
      msg: 'view',
    }
  },
}
