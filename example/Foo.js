import { h } from '../lib/view.es.js'
export const Foo = {
  setup(props) {
    // 1.可以访问到props
    console.log(props)
    // 2.通过this可以访问到props内部属性（proxy)
    // 3.不可更改props属性(shallowReadonly)
    props.count++
  },
  render() {
    return h('div', {}, `foo ${this.count}`)
  },
}
