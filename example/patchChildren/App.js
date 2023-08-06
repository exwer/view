import { h } from '../../lib/index.mjs'
import ArrayToText from './ArrayToText.js'
import TextToArray from './TextToArray.js'
import TextToText from './TextToText.js'

export default {
  setup() {
    return {
      msg: 'view',
    }
  },
  render() {
    return h('div', {}, [
      h('p', {}, '主页'),
      // h(ArrayToText)
      // h(TextToText)
      h(TextToArray)
    ])
  },
}
