import { h, ref } from "../../lib/index.mjs"

const nextChildren = 'newChildren'
const prevChildren = [h('div', {}, 'A'), h('div', {}, 'B')]

export default {
  name: 'ArrayToText',
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
