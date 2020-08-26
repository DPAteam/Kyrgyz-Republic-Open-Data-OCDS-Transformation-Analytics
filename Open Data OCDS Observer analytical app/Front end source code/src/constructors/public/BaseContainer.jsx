import React, { Component } from 'react'

import { BaseRoutes } from '../../routes'
import BarNavigation from '../../components/barNavigation/BarNavigation'
import CopyrightFooter from '../../components/footer/CopyrightFooter'

import './BaseContainer.scss'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { changeLocale } from '../../store/locale/LocaleActions'
import { getI18nTranslation } from '../../store/dashboard/DashboardActions'
import * as numeral from 'numeral'
import navigation from '../../store/navigation/NavReducers'
import Loader from '../../components/loader/Loader'
import _ from 'lodash'


numeral.register('locale', 'byn', {
  delimiters: {
    thousands: ' ',
    decimal: '.',
  },
  abbreviations: {
    thousand: 'тыс.',
    million: 'млн',
    billion: 'млрд',
    trillion: 'трлн',
  },
})

class BaseContainer extends Component {

  constructor(props) {
    super(props)
    // this.props.lang === 'ru' ? numeral.locale('byn') : numeral.locale('en')
    this.props.lang === 'en' ? numeral.locale('en') : numeral.locale('byn')
    props.getI18nTranslation().then(() => {

    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  render() {
    if (_.isEmpty(this.props.translationI18nData)) {
      return <Loader
        isActive={_.isEmpty(this.props.translationI18nDataIsFetching)}
      />
    }

    return (
      <div className="container-fluid">
        <BarNavigation
          onChangeLocale={this.props.changeLocale}
          appLang={this.props.lang}
        />
        <div className="BaseContainer">

          <BaseRoutes />
          {/*<div className="margin-top-30">*/}
          {/*</div>*/}

        </div>
        <CopyrightFooter
          onChangeLocale={this.props.changeLocale}
          appLang={this.props.lang}
          route={this.props.defaultRoute}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ locale, navigation, dashboard }) => ({
  lang: locale.lang,
  defaultRoute: navigation.defaultRoute,
  translationI18nData: dashboard.translationI18nData,
  translationI18nDataIsFetching: dashboard.translationI18nDataIsFetching,

})

const mapDispatchToProps = dispatch => ({
  changeLocale: bindActionCreators(changeLocale, dispatch),
  getI18nTranslation: bindActionCreators(getI18nTranslation, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaseContainer))
