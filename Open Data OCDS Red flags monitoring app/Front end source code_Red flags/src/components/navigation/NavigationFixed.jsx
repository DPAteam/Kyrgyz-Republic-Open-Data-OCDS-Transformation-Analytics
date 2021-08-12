import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeNavigationItem } from '../../store/navigation/actions'
import { FormattedMessage } from 'react-intl'
import { BAR_NAV_CONFIG } from './constants'
import { Icon, Menu, Tooltip } from 'antd'

import './NavigationFixed.scss'
import * as classnames from 'classnames'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'
import NavItem from '../navItem/NavItem'

import { setAdminPanelActive, getAllUsers } from '../../store/adminPanel/actions';

class NavigationFixed extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    onSignOut: PropTypes.func,
    isCollapsed: PropTypes.bool,
  }

  static defaultProps = {}

  state = {
    activeKeys: this.props.menuSelectedKey,
    collapsed: false,
  }

  handleClick = e => {
    this.props.changeNavigationItem(e.key)
    this.setState({
      activeKeys: e.key,
    })
  }

  handleOpenAdminPanel = (type) => {
    const { setAdminPanelActive, getAllUsers } = this.props;

    if (type === "setting") {
      Promise.resolve(getAllUsers()).then(
        () => {
          setAdminPanelActive();
        }
      )
    }
  }

  prepareMenuItems = () => {
    return BAR_NAV_CONFIG.map(item => {
      let checkPermission = _.includes(this.props.userInfo.permissions, 'admin.base')
      return !item.adminPermissions ? (
        <Menu.Item key={item.menuKey}>
          <NavLink to={`/${item.key}`}>
            <Icon type={item.iconType} />
            <span><FormattedMessage id={item.label} /></span>
          </NavLink>
        </Menu.Item>) : (checkPermission ? (
        <Menu.Item key={item.menuKey}>
          <NavLink to={`/${item.key}`} onClick={() => this.handleOpenAdminPanel(item.iconType)}>
            <Icon type={item.iconType} />
            <span><FormattedMessage id={item.label} /></span>
          </NavLink>
        </Menu.Item>) : null)
    })
  }

  render() {
    return (
      <Fragment>
        <Menu
          className="navigation-wrapper"
          // theme="custom"
          // theme="light"
          theme="dark"
          // mode="horizontal"
          defaultSelectedKeys={['1']}
          selectedKeys={[this.props.menuSelectedKey]}

          // inlineCollapsed={this.props.isCollapsed}
          onClick={this.handleClick}
          mode="inline"
        >
          {this.prepareMenuItems()}
        </Menu>
        {this.props.isCollapsed ? (
          <Tooltip placement="right" title={<FormattedMessage id="common.text.3" />}>
            <div
              className={classnames(
                'logout-menu-item',
                this.props.isCollapsed && 'logout-menu-item-collapsed',
              )}
              key="3"
              onClick={this.props.onSignOut}
            >
              <Icon type="logout" />
              <span><FormattedMessage id="common.text.3" /></span>
            </div>
          </Tooltip>
        ) : (
          <div
            className={classnames(
              'logout-menu-item',
              this.props.isCollapsed && 'logout-menu-item-collapsed',
            )}
            key="3"
            onClick={this.props.onSignOut}
          >
            <Icon type="export" />
            <span><FormattedMessage id="common.text.3" /></span>
          </div>
        )}
      </Fragment>
    )
  }
}

function mapStateToProps({
                           navigationStore,
                           auth,
                           adminPanel
                         }) {
  return {
    menuSelectedKey: navigationStore.menuSelectedKey,
    userInfo: auth.userInfo,
    adminPanelIsOpen: adminPanel.adminPanelIsOpen
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
    setAdminPanelActive: bindActionCreators(setAdminPanelActive, dispatch),
    getAllUsers: bindActionCreators(getAllUsers, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationFixed)

// export default Navigation
