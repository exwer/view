import { h, inject, provide } from '../../lib/view.es.js'

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    const baz = inject('baz', () => 'defaultBaz')
    return {
      foo,
      bar,
      baz,
    }
  },
  render() {
    return h('div', {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`)
  },
}

const Provider2 = {
  name: 'Provider2',
  setup() {
    provide('foo', 'foo2')
    const foo = inject('foo')
    return {
      foo,
    }
  },
  render() {
    return h('div', {}, [h('p', {}, `provider2${this.foo}`), h(Consumer)])
  },

}

const Provider = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooVal')
    provide('bar', 'barVal')
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider'), h(Provider2)])
  },
}

export default {
  name: 'App',
  setup() {},
  render() {
    return h('div', {}, [h('p', {}, 'apiInject'), h(Provider)])
  },
}
