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

class HomeTopRegionsByRiskTendersCountChart extends Component {

  render() {
    const { translate, dashboardBaseTopRegionsByRiskTendersCount, dashboardBaseTopRegionsByRiskTendersCountIsFetching, allMappings: { regions }, regionsKey } = this.props
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
    _.forEach(dashboardBaseTopRegionsByRiskTendersCount, (item) => {
      seriesData[0].data.push(parseInt(item.valueWithRisk, 10))
      seriesData[1].data.push(parseInt(item.value, 10))
    })

    return (
      <Spin spinning={dashboardBaseTopRegionsByRiskTendersCountIsFetching} size="large">
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
              text: translate('chart_title_top_5_regions_with_risked_procedures'),
              align: 'left',
              x: 20,
              y: 20,
              style: {
                fontSize: 16,
                fontWeight: '700',
              },
            },
            xAxis: {
              categories: _.map(dashboardBaseTopRegionsByRiskTendersCount, (item) => (_.find(regions, { key: item.description})[regionsKey])),
              title: {
                text: translate('chart_axis_region'),
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
                  translate('dashboard_base_top_regions_by_risk_tenders_count_tooltip') + ' <b>' + toNumberFormatWithPC(this.y) + '</b>'
                )
              },
            },
            legend: { enabled: false },
            credits: { enabled: false },
            series: _.map(dashboardBaseTopRegionsByRiskTendersCount, (item, index) => {
              return {
                data: [{
                  y: Math.round(item.result),
                  // color: CHART_COLORS[index],
                  color: (index === 0) ? '#cc4748' : '#2f4074',
                  x: index,
                }],
                name: _.find(regions, { key: item.description})[regionsKey],

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
    dashboardBaseTopRegionsByRiskTendersCount: homeStore.dashboardBaseTopRegionsByRiskTendersCount,
    dashboardBaseTopRegionsByRiskTendersCountIsFetching: homeStore.dashboardBaseTopRegionsByRiskTendersCountIsFetching,
    allMappings: mappingsStore.allMappings,
    regionsKey: localizationStore.regionsKey,
  }
}

export default connect(
  mapStateToProps,
)(withTranslate(HomeTopRegionsByRiskTendersCountChart))
