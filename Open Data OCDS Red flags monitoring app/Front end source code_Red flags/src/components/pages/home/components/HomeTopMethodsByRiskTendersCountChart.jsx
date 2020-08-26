import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import shortid from 'shortid'
import { Spin } from 'antd'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { yAxisFormatter } from '../../../utils/ChartYAxisFormater'
import { toNumberFormatWithPC } from '../../../utils/NumberUtils'

class HomeTopMethodsByRiskTendersCountChart extends Component {

  render() {
    const { translate, dashboardBaseTopMethodsByRiskTendersCount, dashboardBaseTopMethodsByRiskTendersCountIsFetching, allMappings: { procurementMethodDetails } } = this.props
    let seriesData = [
      {
        name: 'withRisk',
        color: '#cc4748',
        data: [],
      },
      {
        name: 'withoutRisk',
        color: '#2f4074',
        data: [],
      },
    ]
    _.forEach(dashboardBaseTopMethodsByRiskTendersCount, (item) => {
      seriesData[0].data.push(parseInt(item.valueWithRisk, 10))
      seriesData[1].data.push(parseInt(item.value, 10))
    })

    return (
      <Spin spinning={dashboardBaseTopMethodsByRiskTendersCountIsFetching} size="large">
        <HighchartsReact
          key={shortid.generate()}
          highcharts={Highcharts}
          options={{
            chart: {
              type: 'bar',
              height: 550,
              // spacing: [0, 0, 0, 0],
            },
            title: {
              text: translate('chart_title_procedures_with_risks_by_procurement_method'),
              align: 'left',
              x: 20,
              y: 20,
              style: {
                fontSize: 16,
                fontWeight: '700',
              },
            },
            xAxis: {
              categories: _.map(dashboardBaseTopMethodsByRiskTendersCount, (item) => (_.find(procurementMethodDetails, { nameEn: item.description })[this.props.procurementMethodDetailsKey])),
              title: {
                text: translate('chart_axis_procurement_method'),
              },
              // tickPositions: [],
            },
            yAxis: {
              title: {
                text: translate('chart_axis_tenders_with_risk'),
              },
              labels: {
                formatter: function () {
                  return yAxisFormatter(this.value, 'count')
                },
              },
            },
            plotOptions: {
              series: {
                // groupPadding: 0.01,
                // pointWidth: 30,
                stacking: 'normal',
              },
            },
            tooltip: {
              shared: false,
              outside: false,
              formatter: function () {
                return (
                  '<b>' + this.x + '</b>' +
                  '<br>' +
                  translate('dashboard_base_top_methods_by_risk_tenders_count_tooltip') + ' <b>' + toNumberFormatWithPC(this.y) + '</b>'
                )
              },
            },
            legend: { enabled: false },
            credits: { enabled: false },
            series: _.map(dashboardBaseTopMethodsByRiskTendersCount, (item, index) => {
              return {
                data: [{
                  y: Math.round(item.result),
                  // color: CHART_COLORS[index],
                  color: (index === 0) ? '#cc4748' : '#2f4074',
                  x: index,
                }],
                name: _.find(procurementMethodDetails, { nameEn: item.description })[this.props.procurementMethodDetailsKey],

              }
            }),
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
                           localizationStore,
                         }) {
  return {
    filterRequestBody: prioritizationStore.filterRequestBody,
    dashboardBaseTopMethodsByRiskTendersCount: homeStore.dashboardBaseTopMethodsByRiskTendersCount,
    dashboardBaseTopMethodsByRiskTendersCountIsFetching: homeStore.dashboardBaseTopMethodsByRiskTendersCountIsFetching,
    allMappings: mappingsStore.allMappings,
    procurementMethodDetailsKey: localizationStore.procurementMethodDetailsKey,
  }
}

export default connect(
  mapStateToProps,
)(withTranslate(HomeTopMethodsByRiskTendersCountChart))
