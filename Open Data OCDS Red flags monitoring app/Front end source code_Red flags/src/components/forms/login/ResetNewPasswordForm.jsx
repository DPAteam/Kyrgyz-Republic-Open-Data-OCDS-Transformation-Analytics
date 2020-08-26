import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import PropTypes from 'prop-types'

class ResetNewPasswordForm extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }


  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false,
    }
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { intl } = this.context
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback(intl.formatMessage({ id: 'common.text.151' }))
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSave({
          password: values.password,
          token: this.props.token,
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { intl } = this.context

    return (
      <Form
        layout="vertical"
        prefixCls="reset_user_password_"
        onSubmit={this.handleSubmit}
      >
        <Form.Item label={intl.formatMessage({ id: 'common.text.158' })}>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: intl.formatMessage({ id: 'common.text.149' }) },
              { validator: this.validateToNextPassword },
            ],
          })(
            <Input type="password" autoComplete="off" />,
          )}
        </Form.Item>
        <Form.Item label={intl.formatMessage({ id: 'common.text.159' })}>
          {getFieldDecorator('confirm', {
            rules: [
              { required: true, message: intl.formatMessage({ id: 'common.text.150' }) },
              { validator: this.compareToFirstPassword },
            ],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} autoComplete="off" />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            {intl.formatMessage({ id: 'common.text.153' })}
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

ResetNewPasswordForm.propTypes = {
  token: PropTypes.string,
  onSave: PropTypes.func,
}

export default Form.create({ name: 'ResetNewPasswordForm' })(ResetNewPasswordForm)