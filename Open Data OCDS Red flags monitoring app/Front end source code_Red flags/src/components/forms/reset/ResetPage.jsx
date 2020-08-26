import React, { Component } from 'react'
import { resetCheckToken, resetSaveNewPass } from '../../../store/auth/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { changeLocale } from '../../../store/locale/LocaleActions'
import _ from 'lodash'
import ResetNewPasswordForm from '../login/ResetNewPasswordForm'
import NotFound from '../../pages/error/404/NotFound'
// import { IntlActions } from 'react-redux-multilingual'
import { Alert, Row, Result, Button } from 'antd'
import { Link } from 'react-router-dom'

import './ResetPasswordPage.css'
import PropTypes from 'prop-types'

class ResetPage extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }


  constructor(props) {
    super(props)
    props.changeLocale(props.locale)
    // IntlActions.setLocale(process.env.REACT_APP_DEFAULT_LOCALE)
    this.state = {
      showedComponent: null,
    }
  }

  componentWillMount() {
    this.props.resetCheckToken({ token: this.props.token }).then((data) => {

      if (this.props.error) {
        this.setState({
          showedComponent: this.prepareErrorMessage(this.props.error.description),
        })
        // message.error(this.props.error.description, 5)
      } else {
        this.setState({
          showedComponent:
            <ResetNewPasswordForm
              token={this.props.token}
              onSave={this.handleSaveNewPassword}
            />,
        })
      }
    })
  }

  handleSaveNewPassword = (postData) => {
    this.props.resetSaveNewPass(postData).then(() => {
      // if (this.props.resetSavedPassDataErrorStatus) {
      if (this.props.error) {
        this.setState({
          showedComponent: this.prepareErrorMessage(this.props.error.description),
        })
      } else {
        this.setState({
          showedComponent: this.prepareSuccessMessage(),
        }, () => {
          setTimeout(() => {
            window.location.replace(`/?locale=${this.props.locale}`)
          }, 2000)

        })
      }
    })
  }

  prepareErrorMessage = (message) => {
    return (
      <Result
        status="error"
        title={message}
        extra={
          <Button type="primary" key="console" onClick={() => window.location.replace('/')}>
            Home
          </Button>
        }
      />
    )
  }

  prepareSuccessMessage = () => {
    return (
      <Result
        status="success"
        title=""
      />
    )
  }

  render() {
    return (
      <div className="ResetPasswordPage">
        {this.state.showedComponent}
      </div>
    )
  }
}

function mapStateToProps({
                           auth,
                         }) {
  return {
    resetCheckTokenDataErrorStatus: auth.resetCheckTokenDataErrorStatus,
    resetCheckTokenDataErrorMessage: auth.resetCheckTokenDataErrorMessage,
    resetSavedPassDataErrorStatus: auth.resetCheckTokenDataErrorMessage,
    resetSavedPassDataErrorMessage: auth.resetSavedPassDataErrorMessage,
    checkTokenStatus: auth.checkTokenStatus,
    setNewPasswordStatus: auth.setNewPasswordStatus,
    error: auth.error,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetCheckToken: bindActionCreators(resetCheckToken, dispatch),
    resetSaveNewPass: bindActionCreators(resetSaveNewPass, dispatch),
    changeLocale: bindActionCreators(changeLocale, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetPage)