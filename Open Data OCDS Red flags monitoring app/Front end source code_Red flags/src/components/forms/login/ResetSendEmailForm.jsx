import React, { Component } from 'react'
import { Form, Input, Modal } from 'antd'
import PropTypes from 'prop-types'

class ResetSendEmailForm extends Component {
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
        title={intl.formatMessage({id: 'common.text.161'})}
        okText={intl.formatMessage({id: 'common.text.162'})}
        cancelText={intl.formatMessage({id: 'common.text.154'})}
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
          <Form.Item label={intl.formatMessage({id: 'common.text.157'})}>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: intl.formatMessage({id: 'common.text.147'}) },
                { type: 'email', message: intl.formatMessage({id: 'common.text.148'}), },
              ],
            })(
              <Input autoComplete="off"/>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

ResetSendEmailForm.propTypes = {
  isVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  onCreate: PropTypes.func,
}

export default Form.create({ name: 'ResetSendEmailForm' })(ResetSendEmailForm)