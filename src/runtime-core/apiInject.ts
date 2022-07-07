import { getCurrentInstance } from './component'

export function provide(key, value) {
  // 因为使用了getCurrentInstance 所以只能在setup里使用
  const currentInstance: any = getCurrentInstance()

  if (currentInstance) {
    const { provides } = currentInstance
    provides[key] = value
  }
}

export function inject(key) {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides
    return parentProvides[key]
  }
}
