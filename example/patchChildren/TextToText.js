import { h, ref } from "../../lib/index.mjs";

const prevChildren = 'oldChild'
const nextChildren = 'newChild'

export default {
  name: 'TextToText',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange

    return {
      isChange
    }
  },
  render() {
    return this.isChange ? h('div', {}, nextChildren) : h('div', {}, prevChildren)
  }
}
