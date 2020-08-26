import React, { Component, Fragment } from 'react'
import PropTypes                      from 'prop-types'

import _            from "lodash"
import * as numeral from "numeral"
import { generate } from "shortid"

import Divider         from "../divider/Divider"
import ReactHighcharts from "react-highcharts"
import addNoDataModule from 'highcharts/modules/no-data-to-display'

import './ChartGradMini.scss'
import Loader          from "../loader/Loader"


const DEFAULT_CHART_CONFIG = {
  chart: {
    type: 'areaspline',
    height: 100,
    spacing: [ 0, 0, 0, 0 ],
    style: {
      fontFamily: 'Oswald' //'Open Sans'
    }
  },
  lang: {
    noData: "page.common.text.61"
  },
  noData: {
    style: {
      fontWeight: 'bold',
      fontSize: '15px',
      color: '#303030'
    }
  },
  title: { text: '' },
  xAxis: {
    visible: false,
    minPadding: 0,
    maxPadding: 0,
  },
  yAxis: { visible: false },
  legend: { enabled: false },
  series: [ {
    tooltip: { pointFormat: '<span style="color:{point.color}">●</span> <b>{point.y}</b><br/>' },
    lineWidth: 3,
    color: {
      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
      // stops: [ [ 0, '#64B5F6' ], [ 1, '#64B5F670' ] ],
      stops: [ [ 0, '#2a577f' ], [ 1, '#2a577f' ], ],
    },
  } ],
  credits: { enabled: false },
  plotOptions: {
    series: {
      pointPlacement: 'on',
      marker: {
        radius: 0,
        states: { hover: { radius: 8, lineWidth: 5, lineWidthPlus: 10 } },
      },
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [  [ 0, '#72BBDB' ], [ 1, '#D7F2E9' ], ],
      },
    },
  },
}


export default class ChartGradMini extends Component {

  constructor(props) {
    super(props)

    if (ReactHighcharts.Highcharts) {
      addNoDataModule(ReactHighcharts.Highcharts)
    }
  }

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    title: PropTypes.string,
    name: PropTypes.string,
    valueKey: PropTypes.string,
    fetch: PropTypes.func,
  }

  static defaultProps = {
    // title: 'Chart title',
    title: '',
    name: 'chart-name',
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !_.isEqual(nextProps.data, this.props.data)
  }

  setDataToChartConfig = props => {
    const { intl } = this.context
    const dataCloned = _.cloneDeep(props.data.dates)
    let chartConfig = _.cloneDeep(DEFAULT_CHART_CONFIG)
    chartConfig.lang.noData = intl.formatMessage({ id: chartConfig.lang.noData })

    // if (dataCloned[ 0 ].count)
    if (props.valueKey === 'count')
      chartConfig.tooltip = {
        formatter: function () {
          return this.key + '<br/><b>' + numeral(this.point.y).format('0') + ' ' + intl.formatMessage({id: 'common.psc.text'}) + '</b><br/>'
        }
      }
    // if (dataCloned[ 0 ].amount)
    if (props.valueKey === 'amount')
      chartConfig.tooltip = {
        formatter: function () {
          return this.key + '<br/><b>' + numeral(this.point.y).format('0 a') + ' ' + intl.formatMessage({id: 'common.byn.text'}) + '</b><br/>'
        }
      }
    // if (dataCloned[ 0 ].avg)
    if (props.valueKey === 'avg')
      chartConfig.tooltip = {
        formatter: function () {
          return this.key + '<br/><b>' + numeral(this.point.y).format('0') + ' ' + intl.formatMessage({id: 'common.psc.text'}) + '</b><br/>'
        }
      }
    // if (dataCloned[ 0 ].share)
    if (props.valueKey === 'share')
      // chartConfig.series[ 0 ].tooltip.pointFormat = '<b>{point.y:.0f}%</b><br/>'
      chartConfig.tooltip = {
        formatter: function () {
          return this.key + '<br/><b>' + numeral(this.point.y).format('0') + '%' + '</b><br/>'
        }
      }

    chartConfig.series[ 0 ].data = _.map(
      dataCloned,
      // elem => [ elem.date, props.valueKey === 'avg' ? elem[ props.valueKey ].perSupplier : elem[ props.valueKey ] ],
      elem => [ elem.date, elem.value],
    )
    return chartConfig
  }

  render() {
    if (_.isEmpty(this.props.data)) return <Loader isActive={_.isEmpty(this.props.data)}/>
    return <Fragment>
      <div className="mini-grad-chart">
          <span className="value-info c-preset-blue-mono">
            {this.props.valueKey === 'count' && this.props.data.value.toLocaleString('ru')}
            {this.props.valueKey === 'amount' && numeral(this.props.data.value).format('0.0 a')}
            {this.props.valueKey === 'avg' && numeral(this.props.data.value).format('0')}
            {this.props.valueKey === 'share' && `${numeral(this.props.data.value).format('0')}%`}
          </span>
        <Divider borderBottom={0} borderLeft={'1px solid #E9EDF2'} marginLeft={15} width={1} />
        <p className="chart-info">{this.props.title}</p>
      </div>
      <div className="graph-wrapper">
        <ReactHighcharts
          key={generate()}
          config={this.setDataToChartConfig(this.props)}
          id={`${this.props.name}${generate()}`}
          ref={`${this.props.name}${generate()}`}
        />
      </div>
    </Fragment>
  }
}
