import * as fs from 'fs'
import * as path from 'path'

const Html
= `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>example</title>
</head>
<body>
  <div id="app"></div>
</body>
<script src="./main.js" type="module"></script>
</html>`

const AppJs
= `import { h } from '../../lib/index.mjs'
import { Foo } from './Foo.js'

export default {
  setup() {
    return {
      msg: 'view',
    }
  },
  render() {
    return h()
  },
}
`

const FooJs
= `import { h } from '../../lib/index.mjs'
export const Foo = {
  setup() {
    return {

    }
  },
  render() {
    return h()
  },
}
`

const mainJs
= `import { createApp } from '../../lib/index.mjs'
import App from './App.js'

const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)
`

if (process.argv.length <= 2)
  throw new Error('请输入example文件夹名称')
const folderName = process.argv.slice(2)
const folderPath = path.join(__dirname, `../example/${folderName}`)

try {
  if (!fs.existsSync(folderPath))
    fs.mkdirSync(folderPath)

  fs.writeFileSync(path.join(__dirname, `../example/${folderName}/App.js`), AppJs)
  fs.writeFileSync(path.join(__dirname, `../example/${folderName}/Foo.js`), FooJs)
  fs.writeFileSync(path.join(__dirname, `../example/${folderName}/main.js`), mainJs)
  fs.writeFileSync(path.join(__dirname, `../example/${folderName}/index.html`), Html)
}
catch (error) {
  if (typeof error === 'string')
    throw new Error(error)
  if (error instanceof Error)
    throw error
}
