import React, { Component, PropTypes } from 'react'
import HexBackground from '../component/HexBackground/'

export default class HomeContainer extends Component {

  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <HexBackground />
        <div className="center overlay">
          <h1>
            Travis Nischuk
          </h1>
          <h2>
            Full Stack Developer / Tech Lead
          </h2>
        </div>
      </div>
    )
  }

}
