'use strict';

import React from 'react'
import ReactDOM from 'react-dom'

import HomeContainer from './container/HomeContainer'


const MOUNT_NODE = document.getElementById('app')

let render = () => {
  ReactDOM.render(
    <HomeContainer />,
    MOUNT_NODE
  )
}


render()
