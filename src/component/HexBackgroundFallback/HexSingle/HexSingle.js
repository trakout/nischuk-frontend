import React, { Component, PropTypes } from 'react'
import './HexSingle.styl'

export default class HexSingle extends Component {
  constructor() {
    super()
    this.state = {hexClass: 'hex'}
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.state.hexClass == nextState.hexClass) {
  //     return false
  //   }
  //
  //   return true
  // }

  _handleMouseEnter() {
    this.setState({hexClass: 'hex active visible'})
  }

  _handleMouseLeave() {
    this.setState({hexClass: 'hex back visible'})
  }

  render() {
    // const { uniqKey } = this.props
    const { button } = this.props

    return (
      <svg version="1.1"
           baseProfile="full"
           width="60" height="52"
           className={this.state.hexClass + (button ? ' button' : '')}
           onMouseEnter={this._handleMouseEnter.bind(this)}
           onMouseLeave={this._handleMouseLeave.bind(this)}
           xmlns="http://www.w3.org/2000/svg">

        {/* starts at the top, goes clockwise to top left, finishes off with top layer */}

        <g>
          <path className="side side-one" d="M 39.062,3.842 47.697,9.069 22.969,9.069 14.334,3.842 z" />
          <path className="side side-two" d="M 39.062,3.842 47.697,9.069 59.666,30.693 51.031,25.467 z" />
          <path className="side side-three" d="M 51.031,25.467 59.666,30.693 46.908,52.318 38.273,47.092 z" />
          <path className="side side-four" d="M 38.273,47.092 46.908,52.318 22.18,52.318 13.544,47.092 z" />
          <path className="side side-five" d="M 1.575,25.467 10.21,30.693 22.18,52.318 13.544,47.092 z" />
          <path className="side side-six" d="M 14.334,3.842 22.969,9.069 10.21,30.693 1.575,25.467 z" />
          <path className="top" d="M39.209,3.6L14.196,3.6,1.292,25.467,13.398,47.343,38.411,47.343,51.315,25.466z" />
        </g>
      </svg>
    )
  }
}

HexSingle.propTypes = {
  button: PropTypes.bool
}
