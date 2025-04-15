# view

Vue3.x的个人实现版，旨在学习vue/core的核心原理，同时实践TDD的编程范式

# 功能

## TODO 
- ### reactivity
  - [x] effect 主流程
  - [x] reactive 主流程
  - [x] trigger & track
  - [x] effect -> runner
  - [x] effect -> stop
  - [x] readonly
  - [x] isReactive & isReadonly
  - [x] nested reactive & readonly
  - [x] shallowReadonly
  - [x] isProxy
  - [x] ref & isRef & unRef & proxyRefs 
  - [x] computed

- ### runtime core

  **component/element init**
  - [x] component instance
  - [x] element renderer
  - [x] component proxy
  - [x] shapeFlags
  - [x] event handler
  - [x] props & emit
  - [x] slots
  - [x] Fragment & Text
  - [x] getCurrentInstance
  - [x] provide & inject 
  - [x] Custom Renderer API

  **component/element update**
    - [x] update props
    - [x] update children
    - [ ] update children (diff) 
    - [ ] update component
    - [ ] nextTick

- ### compiler
  - [ ] 解析插值
  - [ ] 解析 element
  - [ ] 解析 text
  - [ ] 解析三种联合类型
  - [ ] parse
  - [ ] transform
  - [ ] 生成string类型
  - [ ] 生成插值类型
  - [ ] 生成三种联合类型
  - [ ] 编译template 

## 项目

- ### 单元测试
  - [x] reactivity
  - [ ] runtime/core 
  - [ ] compiler

- ### build
  - [x] rollup打包
  - [x] typescript支持
