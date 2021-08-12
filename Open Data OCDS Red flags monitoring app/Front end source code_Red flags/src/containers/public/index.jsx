import React, { PureComponent } from 'react'
import { message, Modal } from 'antd'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { userLogin, registrationNewUser, resetSendEmail } from '../../store/auth/actions'
import LoginForm from '../../components/forms/login/LoginForm'

import './index.scss'
import PropTypes from 'prop-types'
import { changeLocale } from '../../store/locale/LocaleActions'


class Public extends PureComponent {
  // const publicHeaderAnimProps = useSpring({
  //   from: { opacity: 0, marginTop: 20 },
  //   to: { opacity: 1, marginTop: 0 },
  //   delay: 200,
  // })
  // const loginFormAnimProps = useSpring({
  //   from: { opacity: 0, marginTop: -50 },
  //   to: { opacity: 1, marginTop: 0 },
  //   delay: 250,
  // })
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    let preparedSearch = window.location.search.substring(1).split('=')
    if(preparedSearch[0] === 'locale') {
      if(_.includes(props.existsLanguage, preparedSearch[1])) {
        props.changeLocale(preparedSearch[1])
      }
    }
  }

  getClassNameByRandom = () => {
    const classNames = [
      'public',
      'public-light-dark',
      'public-light-white',
    ]
    // return  classNames[Math.floor(Math.random() * (3 - 1 + 1) + 1) - 1]
    return 'public-light-white'
  }

  render() {
    const { intl } = this.context
    return (
      <div className={this.getClassNameByRandom()}>
        {/*{!!this.props.error ? message.error(intl.formatMessage({ id: 'common.text.100' })) : null}*/}
        <div className="public-wrapper">
          <div className="page_title_wrapper">
            <div className="page_title">
              <h1 className="page_title__text--primary"><FormattedMessage id="common.text.81" /></h1>
              <div className="page_title_subtitles">
                {/*<span className="page_title__text--sub"><FormattedMessage id="common.text.82" /></span>*/}
                <span className="page_title__text--sub"
                      dangerouslySetInnerHTML={{ __html: intl.formatMessage({ id: 'common.text.82' }) }} />
                {/*<span className="page_title__text--sub">Red Flags Monitoring App</span>*/}
              </div>
              <div className="bank-logo-wrapper">
                <div className="bank-logo" />
                <div className="bank-text"
                     dangerouslySetInnerHTML={{ __html: intl.formatMessage({ id: 'common.text.83' }) }} />
              </div>
            </div>
            {/*<Divider />*/}

            {/*<div className="public__desc-text">The Budget is running out - Keep calm and carry on auditing</div>*/}
          </div>
          <div className="login-form-wrapper">
            {/*<LoginForm onLogin={this.props.userLogin} onRegistered={this.registrationNewUser} />*/}
            <LoginForm
              onLogin={this.props.userLogin}
              registrationNewUser={this.props.registrationNewUser}
              resetSendEmail={this.props.resetSendEmail}
              error={this.props.error}
              lang={this.props.lang}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth,locale }) => {
  return {
    error: auth.error,
    lang: locale.lang,
    existsLanguage: locale.existsLanguage,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: bindActionCreators(userLogin, dispatch),
    registrationNewUser: bindActionCreators(registrationNewUser, dispatch),
    resetSendEmail: bindActionCreators(resetSendEmail, dispatch),
    changeLocale: bindActionCreators(changeLocale, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Public)
