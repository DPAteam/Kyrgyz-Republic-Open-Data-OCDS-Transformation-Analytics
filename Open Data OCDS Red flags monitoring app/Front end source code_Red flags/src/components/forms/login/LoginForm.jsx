import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import LanguagesSelector from '../../../containers/private/components/LanguagesSelector'

import {
  Button,
  Checkbox,
  Form,
  Input, message, Modal,
} from 'antd'

import './LoginForm.scss'
import RegistrationForm from './RegistrationForm'
import _ from 'lodash'
import ResetSendEmailForm from './ResetSendEmailForm'


class LoginForm extends PureComponent {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    onLogin: PropTypes.func,
    registrationNewUser: PropTypes.func,
    afterRegister: PropTypes.func,
    error: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      showRegistrationModal: false,
      showResetSendEmailModal: false,
      showError: true,
    }
  }

  handleCloseRegistrationModal = () => {
    this.setState({
      showRegistrationModal: false,
    })
  }


  registrationNewUser = (values) => {
    this.props.registrationNewUser(values).then(() => {
      if (!_.isEmpty(this.props.error)) {
        message.error(this.props.error.description, 5)
      } else {
        Modal.destroyAll()
        message.success('Ok', 5)
      }
    })
  }

  handleRegisterUser = (values) => {
    const { intl } = this.context
    delete values.confirm
    Promise.resolve(this.props.registrationNewUser(values).then(() => {
      if (!_.isEmpty(this.props.error)) {
        message.error(this.props.error.description, 5)
      } else {
        // Modal.destroyAll()
        this.setState({
          showRegistrationModal: false,
        }, () => {
          message.success(intl.formatMessage({ id: 'common.text.160' }), 5)
        })
      }
    }))
    //   .then(() => {
    //   console.log('-=resetSendEmailDataErrorMessage=-', this.props.resetSendEmailDataErrorMessage)
    // })
  }

  renderRegistrationModal = () => {
    return (
      <RegistrationForm
        isVisible={this.state.showRegistrationModal}
        onCancel={this.handleCloseRegistrationModal}
        onCreate={this.handleRegisterUser}
      />
    )
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onLogin({
          email: values.email,
          password: values.password,
        })
      }
    })
  }

  showRegistrationModal = () => {
    this.setState({
      showRegistrationModal: true,
    })
  }

  showRestoreSendEmailModal = () => {
    this.setState({
      showResetSendEmailModal: true,
    })
  }

  handleCloseResetSendEmailModal = () => {
    this.setState({
      showResetSendEmailModal: false,
    })
  }

  handleResetSendEmailUser = (values) => {
    delete values.confirm

    let requestData = {
      email: values.email,
      path: window.location.origin,
      locale: this.props.lang,
    }
    this.props.resetSendEmail(requestData).then(() => {
      this.setState({
        showResetSendEmailModal: false,
      })
    })
  }

  renderResetSendEmailModal = () => {
    return (
      <ResetSendEmailForm
        isVisible={this.state.showResetSendEmailModal}
        onCancel={this.handleCloseResetSendEmailModal}
        onCreate={this.handleResetSendEmailUser}
      />
    )
  }

  handleSingInGoogle = () => {
    window.location.replace('http://192.168.88.91/oauth2/authorization/google')
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { intl } = this.context

    return (
      <>
        {this.renderRegistrationModal()}
        {this.renderResetSendEmailModal()}
        <Form onSubmit={this.handleSubmit} className="form login-form" layout="vertical">
          <LanguagesSelector />
          <div className="google-button-wrapper" onClick={() => this.handleSingInGoogle()}>
            <div className="google-button-icon" />
            <div className='google-button-text'><FormattedMessage id="common.text.87" /></div>
          </div>
          <div className="divider-wrapper">
            <div className="divider-line" />
            <div className="divider-text"><FormattedMessage id="common.text.88" /></div>
            <div className="divider-line" />
          </div>
          <div className="login-form-content">
            <Form.Item label={<FormattedMessage id="common.text.89" />} prefixCls="custom-form">
              {getFieldDecorator(
                'email',
                { rules: [{ required: true, message: intl.formatMessage({ id: 'common.text.98' }) }] },
              )(<Input
                className="input-text"
                placeholder={intl.formatMessage({ id: 'common.text.91' })}
              />)}
            </Form.Item>
            <div className="input-text-divider" />
            <Form.Item label={<FormattedMessage id="common.text.90" />} prefixCls="custom-form">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: intl.formatMessage({ id: 'common.text.99' }) }],
              })(
                <Input
                  className="input-text"
                  type="password"
                  placeholder={intl.formatMessage({ id: 'common.text.92' })} />,
              )}
            </Form.Item>
            <div className="input-text-divider" />
            <div className="forgot-group">
              <Form.Item prefixCls="custom-form">
                {
                  getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(<Checkbox><FormattedMessage id="common.text.93" /></Checkbox>)
                }
              </Form.Item>
              <div className="login-form-forgot" onClick={this.showRestoreSendEmailModal}><FormattedMessage
                id="common.text.94" /></div>
            </div>
            <Button type="primary" htmlType="submit" className="login-form-button">
              <FormattedMessage id="common.text.95" />
            </Button>
            <div className="registration-group">
              <span><FormattedMessage id="common.text.96" /> </span>
              <div
                style={{ marginLeft: 5 }}
                className="login-form-forgot"
                onClick={this.showRegistrationModal}
              >
                <FormattedMessage id="common.text.97" />
              </div>
            </div>

          </div>
        </Form>
      </>
    )
  }
}

const WrappedLoginForm = Form.create({ name: 'login-form' })(LoginForm)

export default WrappedLoginForm
