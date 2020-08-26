import React, { Component } from 'react'
import _ from 'lodash'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Table } from 'antd'
import { DASHBOARD_REGION_INDICATOR_AMOUNT_COLUMNS } from '../HomePageConstants'

class HomeRegionIndicatorAmountTable extends Component {
  componentDidMount() {
    // this.props.fetchTenderMethodIndicatorCount()
  }

  prepareTableColumns = () => {
    const { translate, allMappings: { regions }, regionsKey } = this.props

    let tableColumns = []
    let indicatorColumn = DASHBOARD_REGION_INDICATOR_AMOUNT_COLUMNS.mainColumn
    indicatorColumn.title = translate(indicatorColumn.translateKey)
    tableColumns.push(indicatorColumn)

    _.forEach(regions, (item) => {
      let tableColumnTemplate = _.cloneDeep(DASHBOARD_REGION_INDICATOR_AMOUNT_COLUMNS.childColumn)
      tableColumnTemplate.title = item[regionsKey]
      tableColumnTemplate.dataIndex = item.key
      tableColumnTemplate.sorter = (a, b) => {
        return a[item.key] - b[item.key]
      }
      tableColumns.push(tableColumnTemplate)
    })

    return tableColumns
  }

  prepareTableData = () => {
    const { translate, dashboardBaseRegionIndicatorAmount, allMappings: { indicators, regions }, indicatorsKey } = this.props
    let tableData = []
    let dataTemplate = {}
    let sortedIndicators = _.orderBy(indicators, 'id', 'asc')

    _.forEach(regions, (item) => {
      dataTemplate = _.merge({}, dataTemplate, {
        [item.key]: -1,
      })
    })

    let chainedData = _.chain(_.cloneDeep(dashboardBaseRegionIndicatorAmount))
      .groupBy('indicatorId')
      .map((values, key) => {
        return {
          indicatorId: parseInt(key, 10),
          data: values,
        }
      })
      .value()

    _.forEach(sortedIndicators, (indicator, index) => {
      let elementIndex = _.findIndex(chainedData, { indicatorId: indicator.id })
      if (elementIndex !== -1) {
        let copyTemplateOfData = _.cloneDeep(dataTemplate)
        copyTemplateOfData = _.merge({}, copyTemplateOfData, {
          id: index,
          name: `${indicator.name}%separator%${indicator[indicatorsKey]}`,
        })
        _.forEach(chainedData[elementIndex].data, (elementItem) => {
          copyTemplateOfData[elementItem.description] = elementItem.value
        })
        tableData.push(copyTemplateOfData)
      }
    })

    return tableData
  }

  render() {
    const { translate, dashboardBaseRegionIndicatorAmount, dashboardBaseRegionIndicatorAmountIsFetching, allMappings: { indicators } } = this.props

    // if (_.isEmpty(dashboardBaseRegionIndicatorAmount)) {
    //   return null
    // }

    return (
      <Spin spinning={dashboardBaseRegionIndicatorAmountIsFetching} size="large">
        <Table
          useFixedHeader
          rowKey='id'
          columns={this.prepareTableColumns()}
          dataSource={this.prepareTableData()}
          pagination={false}
          title={() => <div className="table-title-centered"><b>{translate('chart_title_procedures_distribution_by_indicators_and_regions')} ({translate('chart_tabs_sum')})</b></div>}
          scroll={(window.innerWidth < 1500) ? { y: 500, x: window.innerWidth } : { y: 500 }}
        />
      </Spin>
    )
  }
}

function mapStateToProps({
                           homeStore,
                           mappingsStore,
                           localizationStore,
                         }) {
  return {
    dashboardBaseRegionIndicatorAmount: homeStore.dashboardBaseRegionIndicatorAmount,
    dashboardBaseRegionIndicatorAmountIsFetching: homeStore.dashboardBaseRegionIndicatorAmountIsFetching,
    allMappings: mappingsStore.allMappings,
    regionsKey: localizationStore.regionsKey,
    indicatorsKey: localizationStore.indicatorsKey,
  }
}

export default connect(
  mapStateToProps,
)(withTranslate(HomeRegionIndicatorAmountTable))
