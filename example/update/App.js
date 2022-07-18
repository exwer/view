import { h, ref } from '../../lib/index.mjs'

export default {
  name: 'App',
  setup() {
    const count = ref(0)
    const onClick = () => {
      count.value++
    }

    const props = ref({
      foo: 'foo',
      bar: 'bar',
    })

    function onPropsChangeDemo1() {
      props.value.foo = 'new-foo'
    }

    function onPropsChangeDemo2() {
      props.value.foo = undefined
    }

    function onPropsChangeDemo3() {
      props.value = {
        foo: 'foo',
      }
    }
    return {
      count,
      props,
      onClick,
      onPropsChangeDemo1,
      onPropsChangeDemo2,
      onPropsChangeDemo3,
    }
  },
  render() {
    return h(
      'div',
      {
        id: 'root',
        ...this.props,
      },
      [
        h('div', {}, `count:${this.count}`),
        h(
          'button',
          {
            onClick: this.onClick,
          },
          'click',
        ),
        h(
          'button',
          {
            onClick: this.onPropsChangeDemo1,
          },
          'changeProps - 值改变了 - 修改',
        ),
        h(
          'button',
          {
            onClick: this.onPropsChangeDemo2,
          },
          'changeProps - 值变成了undefined - 删除',
        ),
        h(
          'button',
          {
            onClick: this.onPropsChangeDemo3,
          },
          'changeProps - 值的属性改变 - 修改',
        ),
      ],
    )
  },
}
