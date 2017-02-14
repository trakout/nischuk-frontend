import React, { Component, PropTypes } from 'react'
import HexSingle from './HexSingle/'
import './HexBackground.styl'

export default class HexBackground extends Component {
  constructor() {
    super()
    this.gridArr = null
    this.window = this._getWindowSize()
    this.offset = {
      x: 75,
      y: 29
    }
  }

  componentWillMount() {
    window.addEventListener('resize', this._resizeHandler.bind(this), true)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeHandler.bind(this), true)
  }

  shouldComponentUpdate () {
    return false
  }

  _getWindowSize() {
    let viewPortWidth = 0
    let viewPortHeight = 0

    if (typeof window.innerWidth != 'undefined') {
      viewPortWidth = window.innerWidth,
      viewPortHeight = window.innerHeight
    } else if (typeof document.documentElement != 'undefined'
    && typeof document.documentElement.clientWidth !=
    'undefined' && document.documentElement.clientWidth != 0) {
      viewPortWidth = document.documentElement.clientWidth,
      viewPortHeight = document.documentElement.clientHeight
    } else {
      viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
      viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
    }

    return {
      x: viewPortWidth,
      y: viewPortHeight
    }
  }

  _resizeHandler(e) {
    this.window = this._getWindowSize()
    this.forceUpdate()
  }

  _generateHexGrid() {
    this.gridArr = []

    for (let col = 0, colLen = this.window.y * 1.4 / this.offset.y; col < colLen; col++) {
      for (let row = 0, rowLen = this.window.x * 1.2 / this.offset.x; row < rowLen; row++) {
        let lastIndex = {
          key: 'k' + col + 'k' + row,
          style: {
            top: this.offset.y * col * 0.75 + 'px',
            left: (row + (col % 2 ? 0.5 : 0)) * this.offset.x + 'px'
          }
        }
        this.gridArr.push(lastIndex)
      }
    }

    return this.gridArr.map((el) => {
      return (
        <div key={el.key} style={el.style}>
          {<HexSingle />}
        </div>
      )
    })
  }

  render() {
    return (
      <div className="grid-container">
        <div className="grid">
          {this._generateHexGrid()}
        </div>
      </div>
    )
  }
}
