import { isFunc } from '../shared'
import { getCurrentInstance } from './component'

export function provide(key, value) {
  // 因为使用了getCurrentInstance 所以只能在setup里使用
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides

    // 只在第一次调用时初始化
    if (currentInstance.provides === parentProvides)
      currentInstance.provides = Object.create(parentProvides)

    const { provides } = currentInstance
    provides[key] = value
  }
}

export function inject(key, defaultValue) {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides
    if (key in parentProvides) { return parentProvides[key] }
    else if (defaultValue) {
      if (isFunc(defaultValue))
        return defaultValue()
    }
    return defaultValue
  }
}
