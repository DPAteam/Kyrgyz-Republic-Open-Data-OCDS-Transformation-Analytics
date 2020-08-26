import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import shortid from 'shortid'
import { Spin } from 'antd'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { yAxisFormatter } from '../../../utils/ChartYAxisFormater'
import moment from 'moment'
import { toNumberFormatWithPC } from '../../../utils/NumberUtils'

class HomeCountByMonthChart extends Component {

  render() {
    const { translate, dashboardBaseCountByMonth, dashboardBaseCountByMonthIsFetching } = this.props

    // if (_.isEmpty(dashboardBaseCountByMonth)) {
    //   return null
    // }

    const categoriesData = _.map(dashboardBaseCountByMonth, (item) => {
      let dateString = moment(new Date(item.date)).format('MMMM YYYY')
      return {
        categoryName: dateString.charAt(0).toUpperCase() + dateString.slice(1),
        tooltipName: dateString.charAt(0).toUpperCase() + dateString.slice(1),
      }
    })

    let seriesData = [
      {
        name: translate('dashboard_base_count_by_month_chart_amount_tenders'),
        color: '#2f4074',
        data: [],
      },
      {
        name: translate('dashboard_base_count_by_month_chart_tenders_with_risk'),
        color: '#cc4748',
        data: [],
      },
    ]
    _.forEach(dashboardBaseCountByMonth, (item, index) => {
      seriesData[0].data.push(parseInt(item.value, 10))
      seriesData[1].data.push(parseInt(item.valueWithRisk, 10))
    })

    return (
      <Spin spinning={dashboardBaseCountByMonthIsFetching} size="large">
        <HighchartsReact
          key={shortid.generate()}
          highcharts={Highcharts}
          options={{
            chart: {
              // type: 'column',
              type: 'line',
              height: 550,
              // spacing: [0, 0, 0, 0],
            },
            title: {
              text: translate('chart_title_dynamics_of_procedures_in_the_system_of_everything_and_with_risk'),
              align: 'left',
              x: 20,
              y: 20,
              style: {
                fontSize: 16,
                fontWeight: '700',
              },
            },
            xAxis: {
              labels: {
                rotation: -45,
              },
              categories: _.map(categoriesData, (item) => (item.categoryName)),
              // title: {
              //   text: `<b>${categoriesData[0].categoryName} - ${categoriesData[categoriesData.length - 1].categoryName}</b>`,
              // },
            },
            yAxis: {
              title: {
                text: translate('chart_axis_number_of_procedures'),
              },
              labels: {
                formatter: function () {
                  return yAxisFormatter(this.value, 'count')
                },
              },
            },
            legend: {
              enabled: true,
              itemStyle: {
                fontWeight: 400,
              },
            },
            tooltip: {
              shared: true,
              outside: true,
              formatter: function () {
                let firstPoint = this.points[0] ? `</b>${translate('dashboard_base_count_by_month_chart_checked_tender')} <b>${toNumberFormatWithPC(this.points[0].y)}</b>` : ''
                let secondPoint = this.points[1] ? `<br></b>${translate('dashboard_base_count_by_month_chart_tenders_with_risk_tooltip')} <b>${toNumberFormatWithPC(this.points[1].y)}</b>` : ''
                return (
                  '<b>' + categoriesData[this.points[0].point.x].tooltipName + '</b>' +
                  '<br>' + firstPoint + secondPoint
                )
              },
            },
            credits: { enabled: false },
            series: seriesData,
          }}
        />
      </Spin>
    )
  }
}

function mapStateToProps({
                           prioritizationStore,
                           mappingsStore,
                           homeStore,
                         }) {
  return {
    filterRequestBody: prioritizationStore.filterRequestBody,
    dashboardBaseCountByMonth: homeStore.dashboardBaseCountByMonth,
    dashboardBaseCountByMonthIsFetching: homeStore.dashboardBaseCountByMonthIsFetching,
    allMappings: mappingsStore.allMappings,
  }
}

export default connect(
  mapStateToProps,
)(withTranslate(HomeCountByMonthChart))
