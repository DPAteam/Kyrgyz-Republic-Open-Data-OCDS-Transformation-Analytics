import React from 'react'
import PropTypes from 'prop-types'
import * as classnames from 'classnames'
import _ from 'lodash'
import moment from 'moment'
import { generate } from 'shortid'

import './DateSelector.scss'


export default class DateSelector extends React.Component {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    onlyYears: PropTypes.bool,
    customStartDate: PropTypes.bool,
    onClick: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      // yearSelected: 'last',
      yearSelected: props.onlyYears ? moment().subtract(0, 'year').format('YYYY') : 'last',
      fullRange: {
        year: null,
        startDate: null,
        endDate: null,
      },
    }
  }

  handleYearSelectorClick = values => {
    if (!_.isEqual(values.year, this.state.yearSelected)) {
      this.setState({
        yearSelected: values.year,
      })
      this.props.onClick(values.startDate, values.endDate, values.year)
    }
  }

  renderYearSelector = params => {
    return <button
      className={classnames(_.isEqual(params.year, this.state.yearSelected) ? 'active' : '')}
      onClick={() => this.handleYearSelectorClick(params)}
      key={generate() + '-' + params.year}
    >
      {params.label}
    </button>
  }

  renderSelectors = () => {
    const { intl } = this.context
    let lastThreeYears = []
    for (let i = 0; i < 3; i++) {
      if (this.props.onlyYears && i === 0) {
        if (this.props.customStartDate) {
          if (moment().subtract(i, 'year').format('YYYY') >= 2020) {
            lastThreeYears.unshift({
              year: moment().subtract(i, 'year').format('YYYY'),
              startDate: moment().subtract(i + 1, 'year').format(),
              endDate: moment().subtract(i, 'year').format(),
              label: moment().subtract(i, 'year').format('YYYY'),
            })
          }
        } else {
          lastThreeYears.unshift({
            year: moment().subtract(i, 'year').format('YYYY'),
            startDate: moment().subtract(i + 1, 'year').format(),
            endDate: moment().subtract(i, 'year').format(),
            label: moment().subtract(i, 'year').format('YYYY'),
          })
        }
      } else {
        if (this.props.customStartDate) {
          if (moment().subtract(i, 'year').format('YYYY') >= 2020) {
            lastThreeYears.unshift({
              year: moment().subtract(i, 'year').format('YYYY'),
              startDate: moment().subtract(i + 1, 'year').format(),
              endDate: moment().subtract(i, 'year').format(),
              label: moment().subtract(i, 'year').format('YYYY'),
            })
          }
        } else {
          lastThreeYears.unshift({
            year: moment().subtract(i, 'year').format('YYYY'),
            startDate: moment().subtract(i + 1, 'year').format(),
            endDate: moment().subtract(i, 'year').format(),
            label: moment().subtract(i, 'year').format('YYYY'),
          })
        }
      }
    }
    !this.props.onlyYears && lastThreeYears.unshift({
      year: 'last',
      label: intl.formatMessage({ id: 'common.365.text' }),
    })
    return _.map(lastThreeYears, (item, i) => {
      return this.renderYearSelector(item)
    })
  }

  render() {
    return <div className="date-range-selector">
      {this.renderSelectors()}
    </div>
  }
}
