import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import * as classnames from 'classnames'

import {
  changeLocation,
  // setCurrentLocation,
  changeNavigationItem,
} from '../../store/navigation/actions'

// import IconHome                          from '../icons/IconHome'
import NavItem from '../navItem/NavItem'
// import IconStatistic                     from '../icons/IconStatistic'

import './BarNavigation.scss'
import PropTypes from 'prop-types'
// import { ENGLISH_TRANSLATION as langEN } from '../../common/messages/en'
// import { RUSSIAN_TRANSLATION as langRU } from '../../common/messages/ru'
// import { KYRGYZSTAN_TRANSLATION as langKG } from '../../common/messages/ky'
// import DropdownMenu                      from "../dropdown/Dropdown"
// import IceTradeIcon                      from "../icons/IceTradeIcon"
import LanguagesSelector from '../../containers/private/components/LanguagesSelector'
import { Icon, Tooltip } from 'antd'
import { FormattedMessage } from 'react-intl'
import { BAR_NAV_CONFIG } from '../navigation/constants'

class BarNavigation extends PureComponent {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    onChangeLocale: PropTypes.func.isRequired,
    onSignOut: PropTypes.func,
    appLang: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    const loc = window.location.pathname
    // props.setCurrentLocation(loc)
    props.changeLocation(loc, loc)
    this.state = {
      navBarClassName: '',
      active: '',
      menuActiveKey: props.menuSelectedKey,
    }
  }

  componentDidMount() {
    const h1 = parseInt(this.refs.header.offsetHeight)
    window.addEventListener('scroll', this._calcScroll.bind(this, h1))
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._calcScroll)
  }

  convertToKebabKase = (string) => {
    return string.replace(/([a-z])(A-Z)/g, '$1-$2').toLowerCase()
  }

  _calcScroll = (h1) => {
    const _window = window
    const heightDiff = parseInt(h1)
    let scrollPos = _window.scrollY
    if (scrollPos > heightDiff) {
      this.setState({
        navBarClassName: 'nav-on-top',
      })
    } else {
      this.setState({
        navBarClassName: 'nav-scrolled',
      })
    }
  }

  isItemActive = currentLocation => {
    const { location } = this.props
    this.setState({
      active: location,
    })
    return !location || location === '/' ? false : location === currentLocation || _.includes(location, currentLocation)
  }

  renderSubMenu = () => {
    const subObject = this.state.active === window.location.pathname
      ? _.find(BAR_NAV_CONFIG, { key: this.state.active.substr(1) })
      : null
    if (_.isEmpty(subObject)) return

    const loc = item => this.convertToKebabKase(item.key)
    return <div className="sub-bar-menu d-flex container">
      {
        _.map(subObject.sub, item => {
          return <NavItem
            key={loc(item)}
            active={this.isItemActive(`/${loc(item)}`)}
            to={`/${loc(item)}`}
            // onItemClick={changeLocation}
            // onItemClick={changeLocation}
            label={item.label}
          />
        })
      }
    </div>
  }

  render() {
    // const { context } = this
    // const { intl } = this.context

    // const OPTIONS = [
    //   { value: langRU.lang, label: intl.formatMessage({ id: 'common.language.russian.label' }) },
    //   { value: langEN.lang, label: intl.formatMessage({ id: 'common.language.english.label' }) },
    //   { value: langKG.lang, label: intl.formatMessage({ id: 'common.language.kyrgyzstan.label' }) },
    // ]

    // const selectedOption = OPTIONS.find(item => item.value === props.appLang)
    // const handleSelect = option => {
    //   this.props.onChangeLocale(option.value)
    // }

    const { changeLocation, menuSelectedKey } = this.props
    const loc = item => this.convertToKebabKase(item.key)
    return (
      <div className={classnames('BarNav fixed-top', this.state.navBarClassName)} ref="header">
        <div className="header-wrapper">
          <div className="nav-header-wrapper">
            <div className="ice-trade-link">
              <a href="http://zakupki.gov.kg/popp/home.xhtml">
                {/*<IconHome fill="#3672A1"/>*/}
              </a>
            </div>
            {
              BAR_NAV_CONFIG.map(item => {
                let checkPermission = _.includes(this.props.userInfo.permissions, 'admin.base')
                return !item.adminPermissions ? (<NavItem
                  // icon={item.icon}
                  key={loc(item)}
                  // active={this.isItemActive(`/${loc(item)}`)}
                  active={menuSelectedKey === item.menuKey}
                  to={`/${loc(item)}`}
                  onItemClick={changeLocation}
                  label={item.label}
                  location={this.props.location}
                />) : checkPermission ? (<NavItem
                  // icon={item.icon}
                  key={loc(item)}
                  // active={this.isItemActive(`/${loc(item)}`)}
                  active={menuSelectedKey === item.menuKey}
                  to={`/${loc(item)}`}
                  onItemClick={changeLocation}
                  label={item.label}
                  location={this.props.location}
                />) : null
              })
            }
          </div>
          <div className="lang-selector">
            <LanguagesSelector />
          </div>
          <div
            className={'logout-bar-nav-item'}
            key="3"
            onClick={this.props.onSignOut}
          >
            <Tooltip placement="right" title={<FormattedMessage id="common.text.3" />}>
              <Icon type="export" />
            </Tooltip>
            {/*<span><FormattedMessage id="common.text.3" /></span>*/}
          </div>
        </div>
        {/*{this.renderSubMenu()}*/}
      </div>
    )
  }
}

const mapStateToProps = ({
                           navigationStore,
                           auth
                         }) => {
  return {
    location: navigationStore.location,
    current: navigationStore.current,
    menuSelectedKey: navigationStore.menuSelectedKey,
    userInfo: auth.userInfo,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    changeLocation: bindActionCreators(changeLocation, dispatch),
    // setCurrentLocation: bindActionCreators(setCurrentLocation, dispatch),
    changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BarNavigation)
