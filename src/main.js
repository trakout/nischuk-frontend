'use strict';
import './component/Favicon/Favicon'

import React from 'react'
import ReactDOM from 'react-dom'
import * as ReactGA from 'react-ga'


import HomeContainer from './container/HomeContainer'


const MOUNT_NODE = document.getElementById('app')

let render = () => {
  ReactDOM.render(
    <HomeContainer />,
    MOUNT_NODE
  )
}

ReactGA.initialize('UA-36319031-2')
ReactGA.set({ page: window.location.pathname })
ReactGA.pageview(window.location.pathname)

render()
