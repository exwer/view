import { shallowReadonly } from '../reactivity/reactive'
import { proxyRefs } from '../reactivity'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import type { ComponentInstance } from './types'
import { isObject } from './../shared/index'
import { initProps } from './componentProps'
import { emit } from './componentEmit'
import { initSlots } from './componentSlots'

let currentInstance = null
export function createComponentInstance(vNode: any, parent) {
  const instance = {
    vNode,
    component: vNode.type,
    setupState: {},
    props: {},
    emit: () => {},
    slots: {},
    isMounted: false, // 初始化还是更新
    subTree: {},
    // 默认为父组件的provides 如果调用了provide函数则再初始化
    provides: parent ? parent.provides : {},
    parent,
  }

  // emit需要获取实例内容，而用户使用时只希望传入一个事件名
  // 所以这里需要bind
  instance.emit = emit.bind(null, instance) as any
  return instance
}

export function setupComponent(instance: ComponentInstance) {
  // initProps
  initProps(instance, instance.vNode.props)

  // initSlots
  initSlots(instance, instance.vNode.children)

  setupStatefulComponent(instance)
}

// 有状态的组e
function setupStatefulComponent(instance: ComponentInstance) {
  const Component = instance.component

  const { setup } = Component

  if (setup) {
    setCurrentInstance(instance)
    // setup可以返回object或者function
    const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit })

    handleSetupResult(instance, setupResult)
  }

  // 创建代理对象
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
}

function handleSetupResult(instance: ComponentInstance, setupResult) {
  // TODO:handle function

  // handle object
  if (isObject(setupResult))
    //使用proxyRefs进行包裹确保render中直接拿到ref的.value值
    instance.setupState = proxyRefs(setupResult)

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.component
  if (Component.render)
    instance.render = Component.render
}

export function getCurrentInstance() {
  return currentInstance
}

export function setCurrentInstance(instance) {
  currentInstance = instance
}
