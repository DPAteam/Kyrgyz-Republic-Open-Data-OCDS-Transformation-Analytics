import React                   from 'react'
import PropTypes               from 'prop-types'

import { Card as AntCard } from 'antd'
import * as classnames     from "classnames"


const Card = props => {
  return <AntCard
    className={classnames(props.className)}
    title={props.title}
    bordered={false}
    {...props}
  >
    {props.children}
  </AntCard>
}

Card.propTypes = {
  animdelay: PropTypes.number,
  className: PropTypes.string,
  title: PropTypes.string,
}

Card.defaultProps = {
  animdelay: 0,
  className: '',
  title: null,
}

export default Card
