import { h } from '../lib/view.es.js'
export const Foo = {
  setup(props) {
    // props.count
    console.log(props)
  },
  render() {
    return h('div', {}, `foo ${this.count}`)
  },
}
