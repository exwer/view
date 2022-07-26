export interface VNode {
  type: keyof HTMLElementTagNameMap
  props?: Record<string, any>
  children?: string | VNode[]
}

type Render = () => VNode
type Setup = () => object | Render

export interface Component {
  setup: Setup
  render: Render
}

export type Container = HTMLElement

export type ComponentInstance = any
