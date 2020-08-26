import React, { Component } from 'react'
import PropTypes            from 'prop-types'

import { ReadMoreTable } from "../readmoretable/ReadMoreTable"

import './BuyersRegionsSlide.scss'
import Card from '../card/Card'


export default class BuyersRegionsSlide extends Component {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    description: PropTypes.string,
    region: PropTypes.string,
    type: PropTypes.oneOf([ 'count', 'amount' ]),
  }

  render() {
    const {intl} = this.context
    const TYPES = {
      count: {
        text: intl.formatMessage({id: 'page.common.text.35'}),
      },
      amount: {
        text: intl.formatMessage({id: 'page.statistic.text.031'}),
      },
    }
    return (
      <div className="BuyersRegionsSlide d-flex flex-column">
        <div className="switch-rectangle-f" />
        <div className="switch-rectangle-s" />
        <div className="switch-rectangle-t" />
        <div className="switch-rectangle-fo" />
        <span>{this.props.region}</span>
        <p>{TYPES[ this.props.type ].text}</p>
        <h4>
          <ReadMoreTable charLimit={50} value={this.props.description} />
        </h4>
      </div>
    )
  }
}
