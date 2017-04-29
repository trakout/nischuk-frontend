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
          <h2 className="gText" data-text="Full Stack Developer / Tech Lead">
            Full Stack Developer / Tech Lead
          </h2>
        </div>
        <HexBackground />
      </div>
    )
  }

}
