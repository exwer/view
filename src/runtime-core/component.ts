import { isObject } from './../shared/index';
export function createComponentInstance(vNode: any) {
  const component = {
    vNode,
    type: vNode.type,
  }
  return component
}

export function setupComponent(instance) {
  // TODO:initProps
  // TODO:initSlots

  setupStatefulComponent(instance)
}

// 有状态的组件
function setupStatefulComponent(instance) {
  const Component = instance.type

  const { setup } = Component

  if (setup) {
    // setup可以返回object或者function
    const setupResult = setup()

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {
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

