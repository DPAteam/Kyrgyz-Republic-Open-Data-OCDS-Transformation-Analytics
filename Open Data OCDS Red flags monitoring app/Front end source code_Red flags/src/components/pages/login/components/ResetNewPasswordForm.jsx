import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import PropTypes from 'prop-types'

class ResetNewPasswordForm extends Component {
  constructor() {
    super()
    this.state = {
      confirmDirty: false,
    }
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('Два пароля, которые вы ввели, несовместимы!')
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

    return (
      <Form
        layout="vertical"
        prefixCls="reset_user_password_"
        onSubmit={this.handleSubmit}
      >
        <Form.Item label="Пароль">
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: 'Пароль не может быть пустым', },
              { validator: this.validateToNextPassword, },
            ],
          })(
            <Input type="password" autoComplete="off" />,
          )}
        </Form.Item>
        <Form.Item label="Подтверждение пароля">
          {getFieldDecorator('confirm', {
            rules: [
              { required: true, message: 'Подтверждение пароля не может быть пустым' },
              { validator: this.compareToFirstPassword, },
            ],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} autoComplete="off" />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

ResetNewPasswordForm.propTypes = {
  token: PropTypes.bool,
  onSave: PropTypes.func,
}

export default Form.create({ name: 'ResetNewPasswordForm' })(ResetNewPasswordForm)