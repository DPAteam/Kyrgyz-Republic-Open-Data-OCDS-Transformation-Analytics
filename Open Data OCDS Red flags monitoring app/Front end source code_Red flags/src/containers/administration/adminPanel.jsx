import React, { Component, Fragment } from 'react'
import BarNavigation from '../../components/barNavigation/BarNavigation'
import { Divider, Icon, Layout, Table,Button } from 'antd'
import classnames from 'classnames'
import NavigationFixed from '../../components/navigation/NavigationFixed'
import { bindActionCreators } from 'redux'
import {
  getBucketData,
} from '../../store/monitoring/actions'
import { changeNavigationItem } from '../../store/navigation/actions'
import { userLogout } from '../../store/auth/actions'
import { changeLocale } from '../../store/locale/LocaleActions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import LanguagesSelector from '../private/components/LanguagesSelector'
import { AUDITORS_TABLE_COLUMNS } from './constants'
import PropTypes from 'prop-types'

class AdminPanel extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  state = {
    selectedProcedureKeys: [],
    isNavCollapsedFixed: true,
  }

  componentDidMount() {
    this.props.changeNavigationItem('3')
  }

  renderNavHeaderFixed = () => {
    // const { credentials } = this.props
    return (
      <Fragment>
        <div className="nav-wrapper">
          {!this.state.isNavCollapsedFixed && (
            <React.Fragment>
              <div className="page_title">
                <span className="text-f"><FormattedMessage id="common.text.84" /></span>
                <span className="text-s"><FormattedMessage id="common.text.85" /></span>
                <span className="text-t"><FormattedMessage id="common.text.86" /></span>
              </div>

              <Divider prefixCls="blue-divider" />
              <LanguagesSelector />
            </React.Fragment>
          )}
        </div>
      </Fragment>
    )
  }

  toggleNavigationCollapsed = () => {
    this.setState({
      isNavCollapsed: !this.state.isNavCollapsed,
      isNavCollapsedFixed: !this.state.isNavCollapsedFixed,
    })
  }

  prepareTableColumns = () => {
    const { intl } = this.context
    return AUDITORS_TABLE_COLUMNS.map((column) => {
      column.hasOwnProperty('translate_key') && (column.title = intl.formatMessage({id: column.translate_key}))
      return column
    })
  }

  prepareTableData = () => {
    return []
    // return this.state.auditors.map((auditor) => {
    //   return _.merge({}, auditor, {
    //     statusIcon: <Icon type="user" style={{ color: auditor.disabled ? '#E93C3C' : '#00AF00' }} />,
    //     editButton: this.renderAuditorsActions(auditor),
    //   })
    // })
  }

  render() {
    // const hasSelected = this.state.selectedProcedureKeys.length > 0
    let menuButtonLeftPosition = this.state.isNavCollapsedFixed ? 0 : 330
    const { intl } = this.context

    return (
      <Layout>
        <BarNavigation
          onChangeLocale={this.props.changeLocale}
          appLang={this.props.lang}
          onSignOut={() => this.handleUserLogOut()}
        />
        <div className='navigation-collapsed-button' style={{ left: menuButtonLeftPosition }}
             onClick={this.toggleNavigationCollapsed}>
          <Icon type={this.state.isNavCollapsedFixed ? 'right' : 'left'} style={{ color: '#FFFFFF', fontSize: 16 }} />
          {/*<Icon type={this.state.isNavCollapsedFixed ? "right" : "left"} theme="filled" style={{ color: '#1b28a0', fontSize: 16 }} />*/}
        </div>
        <div
          className={classnames('sider-navigation_wrapper', this.state.isNavCollapsedFixed && 'sider-navigation-hide')}>
          {this.renderNavHeaderFixed()}
          <NavigationFixed
            isCollapsed={this.state.isNavCollapsedFixed}
            user={this.props.credentials}
            onSignOut={this.props.userLogout}
          />
        </div>
        <Layout>
          <div className="row mt-4 mb-5">
            <div className="col-md-12">
              <Button onClick={() => this.refreshListOfAuditors()}>
                <Icon type="sync" style={{ color: '#3BA4E6' }} onClick={() => this.refreshListOfAuditors()} />
                <span>Reffresh</span>
              </Button>
            </div>
          </div>
          <div className="row mt-4 mb-5">
            <div className="col-md-12">

              <Table
                bordered
                rowKey='email'
                size="small"
                pagination={{ pageSize: 5 }}
                indentSize={150}
                columns={this.prepareTableColumns()}
                dataSource={this.prepareTableData()}
                // onChange={this.onChangeTable}
              />
            </div>
          </div>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = ({ monitoring, locale }) => {
  return {
    error: monitoring.error,
    mappings: monitoring.mappings,
    lang: locale.lang,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
    changeLocale: bindActionCreators(changeLocale, dispatch),
    getBucketData: bindActionCreators(getBucketData, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminPanel))
