import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'


export default class AppContainer extends Component {

  shouldComponentUpdate() {
    return false
  }

  render() {
    const { routes } = this.props

    return (
      <div style={{ height: '100%' }}>
        <Router history={browserHistory} children={routes} />
      </div>
    )
  }
}


AppContainer.propTypes = {
  routes: PropTypes.object.isRequired
}
