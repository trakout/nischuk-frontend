import React, { Component, PropTypes } from 'react'
import HexBackground from '../component/HexBackground/'

export default class HomeContainer extends Component {

  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <div className="center overlay">
          <h1 className="gText" data-text="Travis Nischuk">
            Travis Nischuk
          </h1>
          <h2 className="gText" data-text="Full Stack Developer">
            Full Stack Developer
          </h2>
        </div>
        <HexBackground />
      </div>
    )
  }

}
