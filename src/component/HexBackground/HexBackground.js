import React, { Component, PropTypes } from 'react'
import * as ReactGA from 'react-ga'

import Renderer from './Renderer'
import HexGenerator from './HexGenerator'
import HexBackgroundFallback from '../HexBackgroundFallback'
import './HexBackground.styl'

export default class HexBackground extends Component {
  constructor() {
    super()
    this.renderedOnce = false
    this.glSupport = this._checkWebGLSupport()
  }

  shouldComponentUpdate() {
    console.log('potential update!')
    if (!this.renderedOnce) return false
    console.log('component updating!')
    return true
  }

  componentDidMount() {
    if (this.glSupport) this._runGL()
  }

  _checkWebGLSupport() {
    try {
			var canvas = document.createElement( 'canvas' )
      return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) )
		} catch ( e ) {
			return false
		}
  }


  _runGL() {
    let renderer = new Renderer()
    let hex = new HexGenerator(renderer)
  }


  render() {
    console.log('RENDER')
    this.renderedOnce = true
    console.log('support?', this.glSupport)

    return (
      <div>
        {this.glSupport ? <div className="gl"></div> : <HexBackgroundFallback />}
      </div>
    )
  }
}
