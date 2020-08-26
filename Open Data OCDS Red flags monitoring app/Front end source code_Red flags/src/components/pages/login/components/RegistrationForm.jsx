import React, { Component } from 'react'
import { Form, Input, Modal } from 'antd'
import PropTypes from 'prop-types'

class RegistrationForm extends Component {
  constructor() {
    super()
    this.state = {
      confirmDirty: false,
    }
  }

  handleRegister = (event) => {
    event.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.form.resetFields()
        this.props.onCreate(values)
      }
    })
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

  onCancel = () => {
    const form = this.props.form
    form.resetFields()
    this.props.onCancel()
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Modal
        title="Создание нового пользователя"
        okText="Создать"
        cancelText="Отмена"
        visible={this.props.isVisible}
        onOk={this.handleRegister}
        onCancel={this.onCancel}
        keyboard={false}
        maskClosable={false}
      >
        <Form
          layout="vertical"
          prefixCls="add_new_user_"
        >
          <Form.Item label="Почтовый адрес">
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: 'Почтовый адрес не может быть пустым' },
                { type: 'email', message: 'Введен неверный адрес электронной почты!', },
              ],
            })(
              <Input autoComplete="off"/>,
            )}
          </Form.Item>
          <Form.Item label="Пароль">
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Пароль не может быть пустым', },
                { validator: this.validateToNextPassword, },
              ],
            })(
              <Input type="password" autoComplete="off"/>,
            )}
          </Form.Item>
          <Form.Item label="Подтверждение пароля">
            {getFieldDecorator('confirm', {
              rules: [
                { required: true, message: 'Подтверждение пароля не может быть пустым' },
                { validator: this.compareToFirstPassword, },
              ],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} autoComplete="off"/>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

RegistrationForm.propTypes = {
  isVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
}

export default Form.create({ name: 'LoginForm' })(RegistrationForm)