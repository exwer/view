import { h } from '../../lib/view.es.js'
export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      emit('add', 1, 2)
      emit('add-foo')
    }

    return {
      emitAdd,
    }
  },
  render() {
    const btn = h('button', {
      onClick: this.emitAdd,
    }, 'emitAdd')
    const foo = h('p', {}, 'foo')
    return h('div', {}, [foo, btn])
  },
}
