import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'
import _ from 'lodash'
import { generate } from 'shortid'
import Highcharts from 'highcharts/highcharts'

import { VERTICAL_BAR_CHART_COLORS } from '../pageChart/constants'
import addNoDataModule from 'highcharts/modules/no-data-to-display'

import './BuyersAvgContractsCharts.scss'


export default class BuyersAvgContractsCharts extends Component {
  constructor(props) {
    super(props)
    if (ReactHighcharts.Highcharts) {
      addNoDataModule(ReactHighcharts.Highcharts)
    }
  }
  static contextTypes = {
    intl: PropTypes.object,
  }

  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    title: PropTypes.string,
    translationI18nData: PropTypes.object,
    timeValues: PropTypes.array,
  }
  static defaultProps = {}

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !_.isEqual(nextProps.data, this.props.data)
  }

  getChartConfig = props => {
    const { intl } = this.context
    const { timeValues, translationI18nData } = this.props
    const DEFAULT_CONFIG = {
      chart: {
        height: 400,
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
        backgroundColor: '#EBF1F4',
      },
      lang: {
        noData: intl.formatMessage({ id: 'page.common.text.61' }),
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030',
        },
      },
      title: { text: '' },
      plotOptions: {
        series: {
          borderWidth: 0,
        },
        bar: {
          dataLabels: {
            enabled: false,
          },
        },
      },
      xAxis: [
        {
          categories: [],
          crosshair: true,
          labels: {
            style: {
              color: '#AFAFAF',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',
              letterSpacing: '0.05em',
            },
          },
        },
      ],
      yAxis: [
        {
          gridLineColor: '#CBCBCB',
          gridLineWidth: 1,
          gridZIndex: 4,
          labels: {
            format: '{value:,.0f}',
            style: {
              color: '#AFAFAF',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'right',
              letterSpacing: '0.05em',
            },
          },
          title: {
            text: intl.formatMessage({ id: 'page.statistic.text.009' }),
            style: {
              color: '#AFAFAF',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0.05em',
            },
          },
        },
        {
          visible: false,
          gridLineWidth: 0,
          title: {
            text: intl.formatMessage({ id: 'page.common.text.32' }),
            style: {
              color: '#64B5F6',
            },
          },
          labels: {
            format: '{value:,.0f}',
            style: {
              color: '#64B5F6',
            },
          },
          opposite: true,
        },
        {
          visible: false,
          gridLineWidth: 0,
          format: '{value:,.0f}',
          title: {
            text: intl.formatMessage({ id: 'page.common.text.33' }),
            style: {
              color: '#495865',
            },
          },
          labels: {
            style: {
              color: '#495865',
            },
          },
          opposite: true,
        },

      ],
      tooltip: {
        shared: true,
      },
      legend: {
        itemStyle: {
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '16px',
          lineHeight: '24px',
          letterSpacing: '0.05em',
          color: '#2A577F',
        },
      },
      series: [{
        name: intl.formatMessage({ id: 'page.statistic.text.009' }),
        type: 'column',
        // color: '#81C78480',
        // borderColor: '#81C784',
        yAxis: 0,
        tooltip: {
          valueSuffix: '',
        },
        data: [],
      }, {
        name: intl.formatMessage({ id: 'page.common.text.32' }),
        type: 'spline',
        color: '#72BBDB',
        yAxis: 1,
        data: [],
        marker: {
          enabled: false,
        },
        dashStyle: 'shortdot',
        tooltip: {
          // pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:,.2f} ' + intl.formatMessage({ id: 'page.contractsCustomer.text.1.1' }) + ' </b><br/>',
          pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:,.0f}</b><br/>',
        },
      }, {
        name: intl.formatMessage({ id: 'page.common.text.33' }),
        type: 'spline',
        color: '#A1A7AD',
        data: [],
        yAxis: 2,
        marker: {
          enabled: false,
        },
        tooltip: {
          pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:,.2f} ' + intl.formatMessage({ id: 'common.byn.text' }) + '</b><br/>',
        },
      }],
      credits: {
        enabled: false,
      },
    }
    const clonedData = _.cloneDeep(props.data)
    let valueExist = false
    // let i18nCpv = _.find(translationI18nData.entries, { key: item.name })
    // let translatedCpvName = !_.isEmpty(i18nCpv) ? (this.props.lang === 'en' ? i18nCpv.en : i18nCpv.ru) : ''

    let config = _.cloneDeep(DEFAULT_CONFIG)

    // config.xAxis[0].categories = _.map(clonedData.buyersCount, 'date')
    config.xAxis[0].categories = _.map(timeValues, (monthName) => (monthName))
    // config.series[0].data = _.map(clonedData.buyersCount, (item, index) => {
    //   // return item.buyers.count
    //   return {
    //     y: item.value,
    //     color: VERTICAL_BAR_CHART_COLORS[index],
    //     x: index,
    //   }
    // })
    config.series[0].data = _.map(timeValues, (monthName, index) => {
      let valueByDate = _.find(clonedData.buyersCount, { date: monthName })
      let value = valueByDate ? valueByDate.value : 0
      if (value !== 0) {
        valueExist = true
      }

      return {
        y: value,
        color: VERTICAL_BAR_CHART_COLORS[index],
        x: index,
      }
      // return item.buyers.count

    })
    // config.series[1].data = _.map(clonedData.avgBuyerLotsCount, item => {
    //   return item.value
    // })
    config.series[1].data = _.map(timeValues, (monthName, index) => {
      let valueByDate = _.find(clonedData.avgBuyerLotsCount, { date: monthName })
      let value = valueByDate ? valueByDate.value : 0
      if (value !== 0) {
        valueExist = true
      }

      return value
    })
    // config.series[2].data = _.map(clonedData.avgBuyerLotsAmount, item => {
    //   return item.value
    // })
    config.series[2].data = _.map(timeValues, (monthName, index) => {
      let valueByDate = _.find(clonedData.avgBuyerLotsAmount, { date: monthName })
      let value = valueByDate ? valueByDate.value : 0
      if (value !== 0) {
        valueExist = true
      }

      return value
    })

    if(!valueExist) {
      config.series = []
    }
    /*
        config.xAxis[0].categories = _.map(clonedData.dates, 'date')
        config.series[0].data = _.map(clonedData.dates, (item, index) => {
          // return item.buyers.count
          return {
            y: item.buyers.count,
            color: VERTICAL_BAR_CHART_COLORS[index],
            x: index,
          }
        })
        config.series[1].data = _.map(clonedData.dates, item => {
          return item.contracts.avgCount.perBuyer
        })
        config.series[2].data = _.map(clonedData.dates, item => {
          return item.contracts.avgAmount.perBuyer
        })
    */
    return config
  }

  render() {
    return <div className="d-flex flex-column chart-mobile-header BuyersAvgContractsCharts">
      <p>{this.props.title}</p>
      <ReactHighcharts
        key={generate()}
        config={this.getChartConfig(this.props)}
        id={`${this.props.name}${generate()}`}
        ref={`${this.props.name}${generate()}`}
      />
    </div>
  }
}
