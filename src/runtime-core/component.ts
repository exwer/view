import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import type { ComponentInstance } from './types'
import { isObject } from './../shared/index'
export function createComponentInstance(vNode: any) {
  const component = {
    vNode,
    type: vNode.type,
    setupState: {},
  }
  return component
}

export function setupComponent(instance: ComponentInstance) {
  // TODO:initProps
  // TODO:initSlots

  setupStatefulComponent(instance)
}

// 有状态的组件
function setupStatefulComponent(instance: ComponentInstance) {
  const Component = instance.type

  // 创建代理对象
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

  const { setup } = Component

  if (setup) {
    // setup可以返回object或者function
    const setupResult = setup()

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

