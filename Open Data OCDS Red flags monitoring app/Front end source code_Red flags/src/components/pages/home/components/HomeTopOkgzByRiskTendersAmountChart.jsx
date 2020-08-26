import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import shortid from 'shortid'
import { Spin } from 'antd'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { CHART_COLORS, PIE_CHART_COLORS } from '../../../common/GlobalConstants'
import { toNumberFormat, toCurrencyWithPostfix, toPercentFormat } from '../../../utils/NumberUtils'

class HomeTopOkgzByRiskTendersAmountChart extends Component {

  render() {
    const {
      translate,
      dashboardBaseTopOkgzByRiskTendersAmount,
      dashboardBaseTopOkgzByRiskTendersAmountIsFetching,
      okgzKey,
      allMappings: { okgz }
    } = this.props
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
    _.forEach(dashboardBaseTopOkgzByRiskTendersAmount, (item, index) => {
      seriesData[0].data.push(parseInt(item.valueWithRisk, 10))
      seriesData[1].data.push(parseInt(item.value, 10))
    })

    return (
      <Spin spinning={dashboardBaseTopOkgzByRiskTendersAmountIsFetching} size="large">
        <HighchartsReact
          key={shortid.generate()}
          highcharts={Highcharts}
          options={{
            chart: {
              type: 'pie',
              height: 550,
              // spacing: [0, 0, 0, 0],
            },
            title: {
              text: translate('chart_title_top_5_categories_with_risked_procedures'),
              align: 'left',
              x: 20,
              y: 20,
              style: {
                fontSize: 16,
                fontWeight: '700',
              },
            },
            xxAxis: {
              visible: false,
              minPadding: 0,
              maxPadding: 0,
            },
            plotOptions: {
              pie: {
                innerSize: 50,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: false,
                },
                showInLegend: true,
                size: (window.innerWidth / 10) + ((window.innerWidth / 10) * 0.5),
                borderWidth: 0,
              },
            },
            legend: {
              itemStyle: {
                fontWeight: 400,
              },
            },
            yAxis: { visible: false },
            tooltip: {
              shared: true,
              outside: true,
              formatter: function () {
                return `<b>${this.point.pointDescription} - ${this.key}</b><br>${translate('dashboard_base_top_okgz_by_risk_tenders_amount_tooltip')} <b>${toCurrencyWithPostfix(this.y)}</b>`
              },
            },
            credits: { enabled: false },
            series: [
              {
                data: _.map(dashboardBaseTopOkgzByRiskTendersAmount, (item, index) => {
                  return {
                    // name: item.description,
                    name: _.find(okgz, { code: item.description })[okgzKey],
                    y: Math.round(item.result),
                    color: PIE_CHART_COLORS[index],
                    pointPercent: item.result,
                    pointDescription: item.description,
                    dataLabels: {
                      verticalAlign: 'top',
                      enabled: true,
                      color: '#000000',
                      connectorWidth: 1,
                      // distance: -60,
                      connectorColor: '#000000',
                      style: {
                        fontWeight: 400,
                      },
                      formatter: function () {
                        return `${toCurrencyWithPostfix(item.result)} (${toPercentFormat(this.point.percentage, '00')})`
                      },
                    },
                  }
                }),
              },
            ],
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
    dashboardBaseTopOkgzByRiskTendersAmount: homeStore.dashboardBaseTopOkgzByRiskTendersAmount,
    dashboardBaseTopOkgzByRiskTendersAmountIsFetching: homeStore.dashboardBaseTopOkgzByRiskTendersAmountIsFetching,
    allMappings: mappingsStore.allMappings,
    okgzKey: localizationStore.okgzKey,
  }
}

export default connect(
  mapStateToProps,
)(withTranslate(HomeTopOkgzByRiskTendersAmountChart))
