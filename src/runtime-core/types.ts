export interface VNode {
  type: HTMLElementTagNameMap | Component
  props?: object
  children?: string | string[]
}

type Render = () => VNode
type Setup = () => object | Render

export interface Component {
  setup: Setup
  render: Render
}

export type Container = HTMLElement

export type ComponentInstance = any
