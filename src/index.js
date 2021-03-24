import { hot } from 'react-hot-loader/root'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import './assets/css'
import { setConfig } from 'react-hot-loader'

const Main = hot(App)

setConfig({
  showReactDomPatchNotification: false
})

ReactDOM.render(<Main/>, document.querySelector('#root'))
