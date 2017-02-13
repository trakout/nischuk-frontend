import React, { Component, PropTypes } from 'react'
import HexSingle from './HexSingle/'
import './HexBackground.styl'

export default class HexBackground extends Component {
  constructor() {
    super()
  }

  shouldComponentUpdate () {
    return false
  }

  render() {
    return (
      <HexSingle />
    )
  }
}
