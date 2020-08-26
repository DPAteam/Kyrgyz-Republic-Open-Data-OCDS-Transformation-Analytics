import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'
import * as _ from 'lodash'
import * as numeral from 'numeral'


export default class SuppliersResidencyPieChart extends Component {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    lang: PropTypes.string,
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !_.isEqual(nextProps.data, this.props.data)
  }

  getChartConfig = data => {
    const { intl } = this.context
    const getItemKey = (inf) => {
      if (this.props.lang === 'ru') {
        return inf
      } else {
        if (inf === 'Нерезиденты') {
          return intl.formatMessage({ id: 'common.story.nonresidents.label' })
        } else {
          return intl.formatMessage({ id: 'common.story.residents.label' })
        }
      }
    }


    // {
    //   name: '2%',
    //     y: 2,
    //   color: '#A8E2D1',
    //   pointPercent: 2,
    //   pointDescription: 'common.story.nonresidents.label',
    //   legendText: intl.formatMessage({id: 'common.story.nonresidents.label'}),
    //   sliced: true,
    //   dataLabels: {
    //   verticalAlign: 'top',
    //     enabled: true,
    //     connectorWidth: 1,
    //     distance: 20,
    //     connectorColor: '#000000',
    //     style: {
    //     fontWeight: 600,
    //       fontSize: '18px',
    //       color: '#2A577F',
    //       textOutline: 0,
    //   },
    // },
    // },
    // {
    //   name: '98%',
    //     y: 98,
    //   color: '#5FBBC2',
    //   pointPercent: 98,
    //   pointDescription: 'common.story.residents.label',
    //   legendText: intl.formatMessage({id: 'common.story.residents.label'}),
    //   dataLabels: {
    //   verticalAlign: 'top',
    //     enabled: true,
    //     connectorWidth: 1,
    //     distance: -20,
    //     connectorColor: '#000000',
    //     style: {
    //     fontWeight: 600,
    //       fontSize: '18px',
    //       color: '#FFFFFF',
    //       textOutline: 0,
    //   },
    // },
    // },

    let amount = 0
    _.forEach(Object.keys(data), (dataKey) => (
      amount += data[dataKey]
    ))

    let series = [
      {
        type: 'pie',
        dataLabels: false,
        size: '55%',
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
            pointDescription: key === 'resident' ? 'common.story.residents.label' : 'common.story.nonresidents.label',
            legendText: intl.formatMessage({ id: key === 'resident' ? 'common.story.residents.label' : 'common.story.nonresidents.label' }),
            sliced: index > 0,
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
      //   text: intl.formatMessage({id: 'page.statistic.text.033'}),
      //   align: 'left',
      //   style: { 'font-weigth': 'bold' },
      // },
      // tooltip: {
      //   formatter: function () {
      //     return '<b>' + this.point.name + ': </b><br>' + intl.formatMessage({ id: 'page.statistic.text.065.1' }) + ': ' + numeral(this.point.y).format('0') + ' ' + ' <br>' + intl.formatMessage({ id: 'page.statistic.text.066' }) + ': ' + numeral(this.point.percentage).format('0') + '%'
      //   },
      // },
      // credits: {
      //   enabled: false,
      // },
      // colors: ['#E5737380', '#64B5F680'],
      // plotOptions: {
      //   pie: {
      //     allowPointSelect: true,
      //     cursor: 'pointer',
      //     dataLabels: {
      //       enabled: true,
      //       format: '<b>{point.percentage:.0f} %</b>',
      //       distance: -35,
      //       style: {
      //         textOutline: false,
      //         color: '#212121'
      //       },
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
      //   name: 'Residency',
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
        text: intl.formatMessage({ id: 'page.statistic.text.033' }),
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
          startAngle: 265,
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
      series: series,
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
      //         name: '2%',
      //         y: 2,
      //         color: '#A8E2D1',
      //         pointPercent: 2,
      //         pointDescription: 'common.story.nonresidents.label',
      //         legendText: intl.formatMessage({id: 'common.story.nonresidents.label'}),
      //         sliced: true,
      //         dataLabels: {
      //           verticalAlign: 'top',
      //           enabled: true,
      //           connectorWidth: 1,
      //           distance: 20,
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
      //         name: '98%',
      //         y: 98,
      //         color: '#5FBBC2',
      //         pointPercent: 98,
      //         pointDescription: 'common.story.residents.label',
      //         legendText: intl.formatMessage({id: 'common.story.residents.label'}),
      //         dataLabels: {
      //           verticalAlign: 'top',
      //           enabled: true,
      //           connectorWidth: 1,
      //           distance: -20,
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
    //     y: item.count,
    //   }
    // })

    return config
  }

  render() {
    return <ReactHighcharts
      config={this.getChartConfig(this.props.data)}
    />
  }
}
