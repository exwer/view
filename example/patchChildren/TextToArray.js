import { h, ref } from "../../lib/index.mjs"

const nextChildren = [h('div', {}, 'A'), h('div', {}, 'B')]
const prevChildren = 'oldChildren'

export default {
  name: 'TextToArray',
  setup() {
    const isChange = ref(false)

    window.isChange = isChange

    return {
      isChange,
    }
  },
  render() {
    return this.isChange ? h('div', {}, nextChildren) : h('div', {}, prevChildren)
  }
}
