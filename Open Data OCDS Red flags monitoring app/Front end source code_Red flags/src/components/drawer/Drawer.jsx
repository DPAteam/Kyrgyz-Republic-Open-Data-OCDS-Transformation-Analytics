import React, { PureComponent } from 'react'
import PropTypes                from 'prop-types'

import { Drawer as DrawerAnt } from 'antd'


class Drawer extends PureComponent {

  static propTypes = {
    isVisible: PropTypes.bool,
    onClose: PropTypes.func
  }

  render() {
    return <DrawerAnt
      placement="right"
      onClose={this.props.onClose}
      visible={this.props.isVisible}
      {...this.props}
    >
      {this.props.children}
    </DrawerAnt>
  }
}

export default Drawer
