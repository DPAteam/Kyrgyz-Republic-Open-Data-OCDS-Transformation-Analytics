import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Result, Button } from 'antd'

import './NotAuthorized.css'

class NotAuthorized extends Component {

  render() {
    return (
      <Result
        status="403"
        title=""
        subTitle="Sorry, you are not authorized to access this page."
        // extra={<Button type="primary"><Link to="/">Home Page</Link></Button>}
        extra={ <Button type="primary" key="console" onClick={() => window.location.replace('/')}>
          Home
        </Button>}
      />
    )
  }
}

export default NotAuthorized
