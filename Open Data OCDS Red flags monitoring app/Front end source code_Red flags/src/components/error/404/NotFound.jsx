import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Result, Button } from 'antd'

import './NotFound.css'

class NotFound extends Component {

  render() {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary"><Link to="/">Home Page</Link></Button>}
      />
    )
  }
}

export default NotFound
