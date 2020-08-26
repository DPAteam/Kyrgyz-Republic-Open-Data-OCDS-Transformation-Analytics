import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import * as classnames from 'classnames'
import _ from 'lodash'

import IconChart from '../icons/IconChart'
import IconInfo from '../icons/IconInfo'
import Card from '../card/Card'

import './CardContentSwitch.scss'


class CardContentSwitch extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'default',
    }
  }

  handleClickSwitch = (key) => {
    let cardKey = _.clone(key)
    if (key === this.state.selected) {
      cardKey = 'default'
    }
    this.setState({
      selected: cardKey,
    })
  }

  render() {
    const {
      cardProps,
      className,
      cardClass,
    } = this.props
    const { selected } = this.state
    return (
      <Card className={_.isEmpty(className) ? 'col-md-12 col-xl-4 home-cards' : className} {...cardProps} cardClass={cardClass || ''}>
        <div className="switch-rectangle-f" />
        <div className="switch-rectangle-s" />
        <div className="switch-rectangle-t" />
        {(selected === 'default') ? (
          <Fragment>
            <div className="switch-rectangle-icon-info" onClick={() => this.handleClickSwitch('info')}>
              <div className="info-icon"><span>i</span></div>
            </div>
            <div className="switch-rectangle-icon-chart" onClick={() => this.handleClickSwitch('chart')}>
              <div className="bar-chart-icon" />
            </div>
          </Fragment>
        ) : (
          <div className="switch-rectangle-icon-info" onClick={() => this.handleClickSwitch('default')}>
            <div className="close-icon" />
          </div>
        )}
        {/*<div className="card-content-switch">*/}
        {/*  <IconChart className={classnames('switch-icon', selected === 'chart' && 'active')}*/}
        {/*             onClick={() => this.handleClickSwitch('chart')} />*/}
        {/*  <IconInfo className={classnames('switch-icon', selected === 'info' && 'active')}*/}
        {/*            onClick={() => this.handleClickSwitch('info')} />*/}
        {/*</div>*/}
        <div onClick={this.props.onSwitchCard ? () => this.handleClickSwitch('chart') : null}>
          {this.state.selected === 'default' &&
          <div style={this.props.onSwitchCard ? { cursor: 'pointer' } : {}}>{this.props.defaultChildren}</div>}
        </div>
        {this.state.selected === 'info' && this.props.childrenInfo}
        {this.state.selected === 'chart' && this.props.childrenChart}

      </Card>
    )
  }
}

CardContentSwitch.propTypes = {
  childrenInfo: PropTypes.oneOfType([
    PropTypes.array, PropTypes.object, PropTypes.string,
  ]),
  childrenChart: PropTypes.oneOfType([
    PropTypes.array, PropTypes.object, PropTypes.string,
  ]),
  defaultChildren: PropTypes.oneOfType([
    PropTypes.array, PropTypes.object, PropTypes.string,
  ]),
  cardClass: PropTypes.string,
  className: PropTypes.string,
  onSwitchCard: PropTypes.bool,
}

CardContentSwitch.defaultProps = {
  onSwitchCard: false,
}

export default CardContentSwitch
