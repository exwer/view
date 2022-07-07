import { h, inject, provide } from '../../lib/view.es.js'

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    return {
      foo,
      bar,
    }
  },
  render() {
    return h('div', {}, `Consumer: - ${this.foo} - ${this.bar}`)
  },
}

const Provider = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooVal')
    provide('bar', 'barVal')
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider'), h(Consumer)])
  },
}

export default {
  name: 'App',
  setup() {},
  render() {
    return h('div', {}, [h('p', {}, 'apiInject'), h(Provider)])
  },
}
