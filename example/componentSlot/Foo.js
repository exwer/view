import { h, renderSlots } from '../../lib/index.mjs'

export const Foo = {
  setup() {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo')
    // 具名插槽
    // 1.支持单个或多个slots的渲染
    // 2.获取到渲染的元素和位置(具名插槽)
    // 作用域插槽
    return h('div', {},
      [
        renderSlots(this.$slots, 'header', { age: 10 }),
        foo,
        renderSlots(this.$slots, 'footer'),
      ])
  },
}
