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

  shouldComponentUpdate (nextProps, nextState) {
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

  _getGridSizes() {
    const rowCount = Math.ceil(this.window.x * 1.2 / this.offset.x)
    const colCount = Math.ceil(this.window.y * 1.4 / this.offset.y + 1)

    return ({
      x: rowCount * 75,
      y: colCount * 21.75
    })
  }

  _generateHexGrid() {
    this.gridArr = []

    const rowCount = Math.ceil(this.window.x * 1.2 / this.offset.x)
    const colCount = Math.ceil(this.window.y * 1.4 / this.offset.y + 1)

    let middle = {
      x: Math.floor(rowCount / 2),
      y: Math.floor(colCount / 2) + 5
    }

    if (this.window.x <= 360) {
      middle.x--
    }

    // let breakCheck = false
    //
    // // console.log('rowcount', rowCount, 'colcount', colCount)
    // // console.log('middleX', middle.x, 'middleY', middle.y)
    //
    // for (let col = 0, colLen = colCount; col < colLen; col++) {
    //   if (breakCheck) break
    //   for (let row = 0, rowLen = rowCount; row < rowLen; row++) {
    //     if (breakCheck) break
    //
    //     // check for hexagonal offset, adjust accordingly
    //     if (col == middle.y && row == middle.x) {
    //       console.log('hex center..', (row + (col % 2 ? 0.5 : 0)) * this.offset.x)
    //       console.log('true center', this.window.x / 2 + 55)
    //     }
    //
    //
    //     if (col == middle.y && row == middle.x
    //     && ((row + (col % 2 ? 0.5 : 0)) * this.offset.x > this.window.x / 2 + 75)){
    //       console.log('offset warn')
    //
    //
    //
    //       middle.y++
    //       middle.x--
    //       breakCheck = true
    //     }
    //
    //   }
    // }


    for (let col = 0, colLen = colCount; col < colLen; col++) {
      for (let row = 0, rowLen = rowCount; row < rowLen; row++) {
        let lastIndex = {
          key: 'k' + col + 'k' + row,
          style: {
            top: this.offset.y * col * 0.75 + 'px',
            left: (row + (col % 2 ? 0.5 : 0)) * this.offset.x + 'px'
          }
        }

        if (col == middle.y + 2 && row == middle.x // linkedin
        || col == middle.y && row == middle.x - 1 // email
        || col == middle.y - 2 && row == middle.x + 1 // github
        || col == middle.y + 4 && row == middle.x - 1) { // twitter
          lastIndex.button = true
        }

        this.gridArr.push(lastIndex)
      }
    }


    return this.gridArr.map((el) => {
      return (
        <div key={el.key} style={el.style}>
          {<HexSingle button={el.button} />}
        </div>
      )
    })
  }

  render() {
    const gridSize = this._getGridSizes()
    const gridStyle = {
      width: gridSize.x + 'px',
      height: gridSize.y + 'px'
    }

    return (
      <div className="grid-container">
        <div className="grid" style={gridStyle}>
          {this._generateHexGrid()}
        </div>
      </div>
    )
  }
}
