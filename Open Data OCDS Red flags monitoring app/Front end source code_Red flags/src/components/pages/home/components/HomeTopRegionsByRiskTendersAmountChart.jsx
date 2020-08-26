import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import shortid from 'shortid'
import { Spin } from 'antd'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { yAxisFormatter } from '../../../utils/ChartYAxisFormater'
import { toCurrencyWithPostfix } from '../../../utils/NumberUtils'

class HomeTopRegionsByRiskTendersAmountChart extends Component {

  render() {
    const { translate, dashboardBaseTopRegionsByRiskTendersAmount, dashboardBaseTopRegionsByRiskTendersAmountIsFetching, allMappings: { regions }, regionsKey } = this.props
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
    _.forEach(dashboardBaseTopRegionsByRiskTendersAmount, (item) => {
      seriesData[0].data.push(parseInt(item.valueWithRisk, 10))
      seriesData[1].data.push(parseInt(item.value, 10))
    })

    return (
      <Spin spinning={dashboardBaseTopRegionsByRiskTendersAmountIsFetching} size="large">
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
              categories: _.map(dashboardBaseTopRegionsByRiskTendersAmount, (item) => (_.find(regions, { key: item.description })[regionsKey])),
              title: {
                text: translate('chart_axis_region'),
              },
              // tickPositions: [],
            },
            yAxis: {
              title: {
                text: translate('chart_value_of_tenders_with_risks'),
              },
              labels: {
                formatter: function () {
                  return yAxisFormatter(this.value, 'amount')
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
                  translate('dashboard_base_top_regions_by_risk_tenders_amount_tooltip') + ' <b>' + toCurrencyWithPostfix(this.y) + '</b>'
                )
              },
            },
            legend: { enabled: false },
            credits: { enabled: false },
            series: _.map(dashboardBaseTopRegionsByRiskTendersAmount, (item, index) => {
              return {
                data: [{
                  y: Math.round(item.result),
                  // color: CHART_COLORS[index],
                  color: (index === 0) ? '#cc4748' : '#2f4074',
                  x: index,
                }],
                name: _.find(regions, { key: item.description })[regionsKey],

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
    dashboardBaseTopRegionsByRiskTendersAmount: homeStore.dashboardBaseTopRegionsByRiskTendersAmount,
    dashboardBaseTopRegionsByRiskTendersAmountIsFetching: homeStore.dashboardBaseTopRegionsByRiskTendersAmountIsFetching,
    allMappings: mappingsStore.allMappings,
    regionsKey: localizationStore.regionsKey,
  }
}

export default connect(
  mapStateToProps,
)(withTranslate(HomeTopRegionsByRiskTendersAmountChart))
