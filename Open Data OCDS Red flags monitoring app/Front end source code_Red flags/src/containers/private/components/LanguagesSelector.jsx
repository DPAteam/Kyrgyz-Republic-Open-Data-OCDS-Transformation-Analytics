import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeLocale } from '../../../store/locale/LocaleActions'
import { ENGLISH_TRANSLATION as langEN } from '../../../common/messages/en'
import { RUSSIAN_TRANSLATION as langRU } from '../../../common/messages/ru'
import { KYRGYZSTAN_TRANSLATION as langKG } from '../../../common/messages/ky'
import navigationStore from '../../../store/navigation/reducer'

class LanguagesSelector extends Component {
  handleChangeLanguage = (lang) => {
    this.props.changeLocale(lang)
  }

  render() {
    return (
      <div className="languages-selector-wrapper">
        <div className="languages-selector-content">
          <div className="flag_kg" onClick={() => this.handleChangeLanguage('ky')} />
          <div className="flag_ru" onClick={() => this.handleChangeLanguage('ru')} />
          <div className="flag_gb" onClick={() => this.handleChangeLanguage('en')} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({
                           navigationStore,
                         }) => {
  return {
    location: navigationStore.location,
    current: navigationStore.current,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeLocale: bindActionCreators(changeLocale, dispatch),
    // setCurrentLocation: bindActionCreators(setCurrentLocation, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LanguagesSelector)