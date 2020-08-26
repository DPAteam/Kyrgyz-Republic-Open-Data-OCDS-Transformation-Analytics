import React, { Component } from 'react'
import { Form, Input, Modal } from 'antd'
import PropTypes from 'prop-types'

class RegistrationForm extends Component {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
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

  onCancel = () => {
    const form = this.props.form
    form.resetFields()
    this.props.onCancel()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { intl } = this.context

    return (
      <Modal
        title=""
        okText={intl.formatMessage({ id: 'common.text.153' })}
        cancelText={intl.formatMessage({ id: 'common.text.154' })}
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
          <Form.Item label={intl.formatMessage({ id: 'common.text.155' })} className="simple-label-text">
            {getFieldDecorator('name', {
              rules: [
                // { required: true, message: intl.formatMessage({ id: 'common.text.155' }) },
              ],
            })(
              <Input autoComplete="off" />,
            )}
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'common.text.157' })}>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: intl.formatMessage({ id: 'common.text.147' }) },
                { type: 'email', message: intl.formatMessage({ id: 'common.text.148' }) },
              ],
            })(
              <Input autoComplete="off" />,
            )}
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'common.text.158' })}>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: intl.formatMessage({ id: 'common.text.149' }) },
                // { min: 8, message: 'Must be minimum 8 characters.' },
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