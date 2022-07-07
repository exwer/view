import { shallowReadonly } from '../reactivity/reactive'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import type { ComponentInstance } from './types'
import { isObject } from './../shared/index'
import { initProps } from './componentProps'
import { emit } from './componentEmit'
import { initSlots } from './componentSlots'

let currentInstance = null
export function createComponentInstance(vNode: any, parentComponent) {
  console.log('parent:', parentComponent)
  const component = {
    vNode,
    type: vNode.type,
    setupState: {},
    props: {},
    emit: () => {},
    slots: {},
    provides: {},
    parent: parentComponent,
  }
  // emit需要获取实例内容，而用户使用时只希望传入一个事件名
  // 所以这里需要bind
  component.emit = emit.bind(null, component) as any
  return component
}

export function setupComponent(instance: ComponentInstance) {
  // initProps
  initProps(instance, instance.vNode.props)

  // initSlots
  initSlots(instance, instance.vNode.children)

  setupStatefulComponent(instance)
}

// 有状态的组件
function setupStatefulComponent(instance: ComponentInstance) {
  const Component = instance.type

  // 创建代理对象
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

  const { setup } = Component

  if (setup) {
    setCurrentInstance(instance)
    // setup可以返回object或者function
    const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit })

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance: ComponentInstance, setupResult) {
  // TODO:handle function

  // handle object
  if (isObject(setupResult))
    instance.setupState = setupResult

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  if (Component.render)
    instance.render = Component.render
}

export function getCurrentInstance() {
  return currentInstance
}

export function setCurrentInstance(instance) {
  currentInstance = instance
}
