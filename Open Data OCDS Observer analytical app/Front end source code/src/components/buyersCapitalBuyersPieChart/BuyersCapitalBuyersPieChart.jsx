import React, { Component } from 'react'
import PropTypes            from 'prop-types'
import ReactHighcharts      from "react-highcharts"
import * as _               from 'lodash'
import Loader               from "../loader/Loader"
import { formatMessage }    from 'react-intl/src/format'


export default class BuyersCapitalBuyersPieChart extends Component {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    isFetching: PropTypes.bool,
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !_.isEqual(nextProps.data, this.props.data)
  }

  getChartConfig = data => {
    const {intl} = this.context
    const getItemKey = (inf) => {
      if (this.props.lang === 'ru') {
        return inf
      } else {
        if (inf === 'Столица') {
          return 'Capital'
        } else {
          return 'Other regions'
        }
      }
    }

    let amount = 0
    _.forEach(Object.keys(data), (dataKey) => (
      amount += data[dataKey]
    ))

    let series = [
      {
        type: 'pie',
        dataLabels: false,
        size: '54%',
        showInLegend: false,
        data: [{
          name: '',
          y: 7,
          color: '#599EC0',
        }],
        innerSize: '95%',
      },
      {
        innerSize: '60%',
        borderWidth: 5,
        borderColor: '#EBF1F4',
        data: _.map(Object.keys(data), (key, index) => {
          let percent = data[key] === 0 ? 0 : Math.round(((data[key] / amount) * 100))

          return {
            name: `${percent}%`,
            y: percent,
            color: index === 0 ? '#5FBBC2' : '#A8E2D1',
            pointPercent: data[key],
            pointDescription: key === 'capital' ? 'page.statistic.text.038' : 'page.statistic.text.039',
            legendText: intl.formatMessage({ id: key === 'capital' ? 'page.statistic.text.038' : 'page.statistic.text.039' }),
            sliced: index === 0,
            dataLabels: {
              verticalAlign: 'top',
              enabled: true,
              connectorWidth: 1,
              distance: 20,
              connectorColor: '#000000',
              style: {
                fontWeight: 600,
                fontSize: '18px',
                color: '#2A577F',
                textOutline: 0,
              },
            },
          }
        }),
      },
    ]

    let config = {
      // chart: {
      //   height: 250,
      //   plotBackgroundColor: null,
      //   plotBorderWidth: null,
      //   plotShadow: false,
      //   type: 'pie',
      //   style: {
      //     fontFamily: 'Oswald' //'Open Sans'
      //   }
      // },
      // title: {
      //   text: intl.formatMessage({id: 'page.statistic.text.037'}),
      //   align: 'left',
      //   style: { 'font-weigth': 'bold' },
      // },
      // credits: {
      //   enabled: false,
      // },
      // colors: ['#81C78480', '#64B5F680'],
      // tooltip: {
      //   headerFormat:'',
      //   pointFormat: '<b>{point.name}: </b><br> ' + intl.formatMessage({id: 'page.statistic.text.065.2'}) + ': {point.y:,.0f} <br> ' + intl.formatMessage({id: 'page.statistic.text.066'}) + ': {point.percentage:.0f}%'
      // },
      // plotOptions: {
      //   pie: {
      //     allowPointSelect: true,
      //     cursor: 'pointer',
      //     dataLabels: {
      //       enabled: true,
      //       style: {
      //         textOutline: false,
      //         color: '#212121'
      //       },
      //       format: '<b>{point.percentage:.0f} %</b>',
      //       distance: -25,
      //       filter: {
      //         property: 'percentage',
      //         operator: '>',
      //         value: 4,
      //       },
      //     },
      //     showInLegend: true,
      //   },
      // },
      // series: [ {
      //   name: 'Capital',
      // } ],

      chart: {
        type: 'pie',
        height: 380,
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
      },
      title: {
        text: intl.formatMessage({id: 'page.statistic.text.037'}),
        style: {
          fontSize: '28px',
          color: '#2A577F',
        },
      },
      xAxis: {
        categories: ['A', 'B'],
        title: {
          text: null,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: '',
          align: 'high',
        },
        labels: {
          overflow: 'justify',
        },
      },
      legend: {
        // layout: 'vertical',
        // backgroundColor: '#FFFFFF',
        // floating: true,
        // align: 'left',
        // verticalAlign: 'top',
        // x: 90,
        // y: 45,
        // margin: 30,
        symbolHeight: 17,
        symbolWidth: 17,
        symbolRadius: 0,
        align: 'center',
        verticalAlign: 'bottom',
        // y: -35,
        padding: 0,
        // itemMarginTop: 30,
        // itemMarginBottom: 0,
        itemStyle: {
          color: '#2A577F',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '16px',
          // lineHeight: '24px',
          letterSpacing: '0.05em',
          display: 'inline-block',
        },
        labelFormatter: function () {
          return this.legendText
        },
      },
      tooltip: {
        formatter: function () {
          return this.point.pointDescription ? '<span style="font-size: 14px">' + intl.formatMessage({ id: this.point.pointDescription }) + '</span><br/>'
            + '<span style="font-size: 14px">' + intl.formatMessage({ id: 'tooltip.common.text.9.2' }) + ': ' + this.point.pointPercent + '</span><br/>'
            + '<span style="font-size: 14px">' + intl.formatMessage({ id: 'tooltip.common.text.9.3' }) + ': ' + this.key + '</span>' : false
        },
        // valueSuffix: ' millions',
      },
      plotOptions: {
        pie: {
          // enableMouseTracking: false,
          startAngle: 244,
          slicedOffset: 10,
          dataLabels: {
            enabled: true,
          },
          showInLegend: true,
          events: {
            legendItemClick: function (e) {
              e.preventDefault()
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: series
      // series: [
      //   {
      //     type: 'pie',
      //     dataLabels: false,
      //     size: '55%',
      //     showInLegend: false,
      //     data: [{
      //       name: '',
      //       y: 7,
      //       color: '#599EC0',
      //     }],
      //     innerSize: '95%',
      //   },
      //   {
      //     innerSize: '60%',
      //     borderWidth: 5,
      //     borderColor: '#EBF1F4',
      //     data: [
      //       {
      //         name: '15%',
      //         y: 15,
      //         color: '#A8E2D1',
      //         pointPercent: 15,
      //         pointDescription: 'page.statistic.text.038',
      //         legendText: intl.formatMessage({id: 'page.statistic.text.038'}),
      //         sliced: true,
      //         dataLabels: {
      //           verticalAlign: 'top',
      //           enabled: true,
      //           connectorWidth: 1,
      //           distance: -15,
      //           connectorColor: '#000000',
      //           style: {
      //             fontWeight: 600,
      //             fontSize: '18px',
      //             color: '#2A577F',
      //             textOutline: 0,
      //           },
      //         },
      //       },
      //       {
      //         name: '85%',
      //         y: 85,
      //         color: '#5FBBC2',
      //         pointPercent: 85,
      //         pointDescription: 'page.statistic.text.039',
      //         legendText: intl.formatMessage({id: 'page.statistic.text.039'}),
      //         dataLabels: {
      //           verticalAlign: 'top',
      //           enabled: true,
      //           connectorWidth: 1,
      //           distance: -25,
      //           connectorColor: '#000000',
      //           style: {
      //             fontWeight: 600,
      //             fontSize: '18px',
      //             color: '#FFFFFF',
      //             textOutline: 0,
      //           },
      //         },
      //       },
      //     ],
      //   },
      // ],
    }

    // config.series[ 0 ].data = _.map(data, item => {
    //   return {
    //     name: getItemKey(item.key.ru),
    //     y: item.buyers.count,
    //   }
    // })

    return config
  }

  render() {
    if (this.props.isFetching) return <Loader isActive={this.props.isFetching} />
    return <ReactHighcharts
      config={this.getChartConfig(this.props.data)}
    />
  }
}
