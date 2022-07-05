import { createApp } from '../../lib/view.es.js'
import App from './App.js'

const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)
