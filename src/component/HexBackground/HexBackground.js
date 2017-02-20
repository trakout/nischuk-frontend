import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import * as ReactGA from 'react-ga'
import HexSingle from './HexSingle/'
import './HexBackground.styl'

import IconEmail from 'babel?presets[]=es2015&presets[]=react!svg-react!../../asset/img/email.svg?name=IconEmail'
import IconGithub from 'babel?presets[]=es2015&presets[]=react!svg-react!../../asset/img/github.svg?name=IconGithub'
import IconTwitter from 'babel?presets[]=es2015&presets[]=react!svg-react!../../asset/img/twitter.svg?name=IconTwitter'
import IconLinkedin from 'babel?presets[]=es2015&presets[]=react!svg-react!../../asset/img/linkedin.svg?name=IconLinkedin'

const linkedin = 'https://www.linkedin.com/in/nischuk/'
const twitter = 'https://twitter.com/trakout'
const email = 'mailto:trakout@gmail.com'
const github = 'https://github.com/trakout'

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

  _trackSocial(type) {
    ReactGA.event({
      category: 'Click',
      action: 'Outbound Click',
      label: type
    })
    console.log(type)
  }

  _getSvg(type) {
    if (type == 'email') {
      return <IconEmail className={'abstract email'} />
    }
    if (type == 'twitter') {
      return <IconTwitter className={'abstract twitter'} />
    }
    if (type == 'linkedin') {
      return <IconLinkedin className={'abstract linkedin'} />
    }
    if (type == 'github') {
      return <IconGithub className={'abstract github'} />
    }
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

          if (middle.y + 2 && row == middle.x) {
            lastIndex.href = linkedin
            lastIndex.type = 'linkedin'
          }
          if (col == middle.y && row == middle.x - 1) {
            lastIndex.href = email
            lastIndex.type = 'email'
          }
          if (col == middle.y - 2 && row == middle.x + 1) {
            lastIndex.href = github
            lastIndex.type = 'github'
          }
          if (col == middle.y + 4 && row == middle.x - 1) {
            lastIndex.href = twitter
            lastIndex.type = 'twitter'
          }
        }

        this.gridArr.push(lastIndex)
      }
    }


    return this.gridArr.map((el) => {
      let hexTag = <HexSingle button={el.button} />

      if (el.button) {
        hexTag = (
          <a target="_blank" onClick={this._trackSocial.bind(this, el.type)} className="block" href={el.href}>
            <HexSingle button={el.button} />
            {this._getSvg(el.type)}
          </a>
        )
      }

      return (
        <div key={el.key} style={el.style} className="single">
          {hexTag}
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
          <ReactCSSTransitionGroup
            transitionName="gridfade"
            transitionAppear={true}
            transitionAppearTimeout={10000}
            transitionEnter={false}
            transitionLeave={false}>
            {this._generateHexGrid()}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    )
  }
}
