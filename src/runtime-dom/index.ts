import { createRenderer } from '../runtime-core'

function createElement(type) {
  return document.createElement(type)
}

function patchProp(el, key, prevVal, newVal) {
  // 如果为undefined或null,则删除旧属性
  if (newVal === undefined || newVal === null) {
    el.removeAttribute(prevVal)
    return
  }

  // 处理事件
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, newVal)
  }
  else {
    el.setAttribute(key, newVal)
  }
}

function insert(el, parent) {
  parent.append(el)
}

function remove(el) {
  const parentNode = el.parentNode
  if (parentNode) {
    parentNode.removeChild(el)
  }
}

function setElementText(el, text) {
  el.textContent = text
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText
})

export function createApp(...args) {
  return renderer.createApp(...args)
}

export * from '../runtime-core'
