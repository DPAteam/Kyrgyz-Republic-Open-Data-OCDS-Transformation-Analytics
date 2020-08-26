import React, { Component } from 'react'
import {
  fetchDashboardBaseInfo,
  fetchDashboardBaseTopInfo,
  fetchDashboardCountByMonth,
  fetchDashboardAmountByMonth,
  fetchDashboardTopMethodsByRiskTendersCount,
  fetchDashboardTopMethodsByRiskTendersAmount,
  fetchDashboardTopRegionsByRiskTendersCount,
  fetchDashboardTopRegionsByRiskTendersAmount,
  fetchDashboardTopOkgzByRiskTendersCount,
  fetchDashboardTopOkgzByRiskTendersAmount,
  fetchDashboardRegionIndicatorCount,
  fetchDashboardRegionIndicatorAmount,
  fetchDashboardRegionIndicatorCountPercent,
  fetchDashboardRegionIndicatorAmountPercent,
} from '../../redux/action/home/HomeActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import { withTranslate } from 'react-redux-multilingual'
import { changeNavigationItem, setBreadCrumbsOptions } from '../../redux/action/navigation/NavigationActions'
import moment from 'moment/moment'
import { toISOFormat } from '../../utils/DateUtils'
import Slider from 'react-slick'
import { Row, Col, Tabs } from 'antd'
import HomeFilters from './components/HomeFilters'
import HomeCountByMonthChart from './components/HomeCountByMonthChart'
import HomeAmountByMonthChart from './components/HomeAmountByMonthChart'
import HomeTopMethodsByRiskTendersCountChart from './components/HomeTopMethodsByRiskTendersCountChart'
import HomeTopMethodsByRiskTendersAmountChart from './components/HomeTopMethodsByRiskTendersAmountChart'
import HomeTopRegionsByRiskTendersCountChart from './components/HomeTopRegionsByRiskTendersCountChart'
import HomeTopRegionsByRiskTendersAmountChart from './components/HomeTopRegionsByRiskTendersAmountChart'
import HomeTopOkgzByRiskTendersCountChart from './components/HomeTopOkgzByRiskTendersCountChart'
import HomeTopOkgzByRiskTendersAmountChart from './components/HomeTopOkgzByRiskTendersAmountChart'
import HomeRegionIndicatorCountTable from './components/HomeRegionIndicatorCountTable'
import HomeRegionIndicatorAmountTable from './components/HomeRegionIndicatorAmountTable'
import HomeRegionIndicatorCountPercentTable from './components/HomeRegionIndicatorCountPercentTable'
import HomeRegionIndicatorAmountPercentTable from './components/HomeRegionIndicatorAmountPercentTable'
import StatusCard from '../../components/statusCard/StatusCard'
import InfoCard from '../../components/infoCard/infoCard'
import { HOME_STATUS_CARD_OPTIONS, TOP_INFO_CONFIG } from './HomePageConstants'

import './HomePage.css'

class HomePage extends Component {
  constructor(props) {
    super(props)
    moment.locale(props.datePickerLocaleTitle)
    this.state = {
      filterRequestBody: {
        contractStartDate: toISOFormat(moment().startOf('year').format('MM/DD/YYYY')),
        contractEndDate: toISOFormat(moment().format('MM/DD/YYYY')),
      },
    }

    props.changeNavigationItem(props.menuKey.key)
    props.setBreadCrumbsOptions(props.menuKey.breadcrumb)
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.loadTenderTableData()
  }

  loadTenderTableData = () => {
    this.props.fetchDashboardBaseInfo(this.state.filterRequestBody)
    this.props.fetchDashboardBaseTopInfo(this.state.filterRequestBody)
    this.props.fetchDashboardCountByMonth(this.state.filterRequestBody)
    this.props.fetchDashboardAmountByMonth(this.state.filterRequestBody)
    this.props.fetchDashboardTopMethodsByRiskTendersCount(this.state.filterRequestBody)
    this.props.fetchDashboardTopMethodsByRiskTendersAmount(this.state.filterRequestBody)
    this.props.fetchDashboardTopRegionsByRiskTendersCount(this.state.filterRequestBody)
    this.props.fetchDashboardTopRegionsByRiskTendersAmount(this.state.filterRequestBody)
    this.props.fetchDashboardTopOkgzByRiskTendersCount(this.state.filterRequestBody)
    this.props.fetchDashboardTopOkgzByRiskTendersAmount(this.state.filterRequestBody)
    this.props.fetchDashboardRegionIndicatorCount(this.state.filterRequestBody)
    this.props.fetchDashboardRegionIndicatorAmount(this.state.filterRequestBody)
    this.props.fetchDashboardRegionIndicatorCountPercent(this.state.filterRequestBody)
    this.props.fetchDashboardRegionIndicatorAmountPercent(this.state.filterRequestBody)
  }

  reloadTableDataByFilter = (filterRequestBody) => {
    this.setState({
      filterRequestBody: filterRequestBody,
    }, () => {
      this.props.fetchDashboardBaseInfo(filterRequestBody)
      this.props.fetchDashboardBaseTopInfo(filterRequestBody)
      this.props.fetchDashboardCountByMonth(filterRequestBody)
      this.props.fetchDashboardAmountByMonth(filterRequestBody)
      this.props.fetchDashboardTopMethodsByRiskTendersCount(filterRequestBody)
      this.props.fetchDashboardTopMethodsByRiskTendersAmount(filterRequestBody)
      this.props.fetchDashboardTopRegionsByRiskTendersCount(filterRequestBody)
      this.props.fetchDashboardTopRegionsByRiskTendersAmount(filterRequestBody)
      this.props.fetchDashboardTopOkgzByRiskTendersCount(filterRequestBody)
      this.props.fetchDashboardTopOkgzByRiskTendersAmount(filterRequestBody)
      this.props.fetchDashboardRegionIndicatorCount(filterRequestBody)
      this.props.fetchDashboardRegionIndicatorAmount(filterRequestBody)
      this.props.fetchDashboardRegionIndicatorCountPercent(filterRequestBody)
      this.props.fetchDashboardRegionIndicatorAmountPercent(filterRequestBody)
    })
  }

  handleStartDateSelected = (date, dateString) => {
    let { filterRequestBody } = this.state
    if (dateString) {
      if (!filterRequestBody.hasOwnProperty('contractStartDate')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          contractStartDate: toISOFormat(dateString),
        })
      } else {
        filterRequestBody.contractStartDate = toISOFormat(dateString)
      }
    } else {
      filterRequestBody.hasOwnProperty('contractStartDate') && (delete filterRequestBody.contractStartDate)
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  handleEndDateSelected = (date, dateString) => {
    let { filterRequestBody } = this.state
    if (dateString) {
      if (!filterRequestBody.hasOwnProperty('contractEndDate')) {
        filterRequestBody = _.merge({}, filterRequestBody, {
          contractEndDate: toISOFormat(dateString),
        })
      } else {
        filterRequestBody.contractEndDate = toISOFormat(dateString)
      }
    } else {
      filterRequestBody.hasOwnProperty('contractEndDate') && (delete filterRequestBody.contractEndDate)
    }

    this.reloadTableDataByFilter(filterRequestBody)
  }

  render() {
    const { translate } = this.props

    return (
      <Row className="HomePage">
        <Col span={24}>
          <HomeFilters
            allSelectedData={this.state.filterRequestBody}
            handleStartDateSelected={this.handleStartDateSelected}
            handleEndDateSelected={this.handleEndDateSelected}
          />
        </Col>
        <Col span={24} className="mb-5">
          <StatusCard
            cardOptions={HOME_STATUS_CARD_OPTIONS}
            dashboardInfoData={this.props.dashboardBaseInfoData}
            dashboardInfoDataIsFetching={this.props.dashboardBaseInfoDataIsFetching}
          />
        </Col>
        <Col span={12} className="mb-5 pr-1">
          <Tabs type="card" className="not-custom-tabs">
            <Tabs.TabPane tab={translate('chart_tabs_amount')} key="count_1">
              <HomeCountByMonthChart />
            </Tabs.TabPane>
            <Tabs.TabPane tab={translate('chart_tabs_sum')} key="amount_1">
              <HomeAmountByMonthChart />
            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col span={12} className="mb-5 pl-1">
          <Tabs type="card" className="not-custom-tabs">
            <Tabs.TabPane tab={translate('chart_tabs_amount')} key="count_2">
              <HomeTopMethodsByRiskTendersCountChart />
            </Tabs.TabPane>
            <Tabs.TabPane tab={translate('chart_tabs_sum')} key="amount_2">
              <HomeTopMethodsByRiskTendersAmountChart />
            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col span={12} className="mb-5 pr-1">
          <Tabs type="card" className="not-custom-tabs">
            <Tabs.TabPane tab={translate('chart_tabs_amount')} key="count_3">
              <HomeTopRegionsByRiskTendersCountChart />
            </Tabs.TabPane>
            <Tabs.TabPane tab={translate('chart_tabs_sum')} key="amount_3">
              <HomeTopRegionsByRiskTendersAmountChart />
            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col span={12} className="mb-5 pl-1">
          <Tabs type="card" className="not-custom-tabs">
            <Tabs.TabPane tab={translate('chart_tabs_amount')} key="count_4">
              <HomeTopOkgzByRiskTendersCountChart />
            </Tabs.TabPane>
            <Tabs.TabPane tab={translate('chart_tabs_sum')} key="amount_4">
              <HomeTopOkgzByRiskTendersAmountChart />
            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col span={24} className="mb-5">
          <InfoCard
            allMappings={this.props.allMappings}
            cardOptions={TOP_INFO_CONFIG}
            dashboardInfoData={this.props.dashboardBaseTopInfoData}
            dashboardInfoDataIsFetching={this.props.dashboardBaseTopInfoDataIsFetching}
          />
        </Col>
        <Col span={24}>
          <Tabs type="card" className="not-custom-tabs">
            <Tabs.TabPane tab={translate('chart_tabs_amount')} key="count_5">
              <HomeRegionIndicatorCountTable />
            </Tabs.TabPane>
            <Tabs.TabPane tab={translate('chart_status_card_percentage_of_the_total_procedures_number')} key="count_6">
              <HomeRegionIndicatorCountPercentTable />
            </Tabs.TabPane>
            <Tabs.TabPane tab={translate('chart_tabs_sum')} key="amount_5">
              <HomeRegionIndicatorAmountTable />
            </Tabs.TabPane>
            <Tabs.TabPane tab={translate('chart_status_card_percentage_of_the_total_procedures_sum')} key="amount_6">
              <HomeRegionIndicatorAmountPercentTable />
            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col span={24}>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps({
                           administrationStore,
                           localizationStore,
                           homeStore,
                           mappingsStore,
                         }) {
  return {
    allMappings: mappingsStore.allMappings,
    auditorSettingsData: administrationStore.auditorSettingsData,
    datePickerLocaleTitle: localizationStore.datePickerLocaleTitle,
    dashboardBaseInfoData: homeStore.dashboardBaseInfoData,
    dashboardBaseInfoDataIsFetching: homeStore.dashboardBaseInfoDataIsFetching,
    dashboardBaseTopInfoData: homeStore.dashboardBaseTopInfoData,
    dashboardBaseTopInfoDataIsFetching: homeStore.dashboardBaseTopInfoDataIsFetching,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
    setBreadCrumbsOptions: bindActionCreators(setBreadCrumbsOptions, dispatch),
    fetchDashboardBaseInfo: bindActionCreators(fetchDashboardBaseInfo, dispatch),
    fetchDashboardCountByMonth: bindActionCreators(fetchDashboardCountByMonth, dispatch),
    fetchDashboardAmountByMonth: bindActionCreators(fetchDashboardAmountByMonth, dispatch),
    fetchDashboardTopMethodsByRiskTendersCount: bindActionCreators(fetchDashboardTopMethodsByRiskTendersCount, dispatch),
    fetchDashboardTopMethodsByRiskTendersAmount: bindActionCreators(fetchDashboardTopMethodsByRiskTendersAmount, dispatch),
    fetchDashboardTopRegionsByRiskTendersCount: bindActionCreators(fetchDashboardTopRegionsByRiskTendersCount, dispatch),
    fetchDashboardTopRegionsByRiskTendersAmount: bindActionCreators(fetchDashboardTopRegionsByRiskTendersAmount, dispatch),
    fetchDashboardTopOkgzByRiskTendersCount: bindActionCreators(fetchDashboardTopOkgzByRiskTendersCount, dispatch),
    fetchDashboardTopOkgzByRiskTendersAmount: bindActionCreators(fetchDashboardTopOkgzByRiskTendersAmount, dispatch),
    fetchDashboardRegionIndicatorCount: bindActionCreators(fetchDashboardRegionIndicatorCount, dispatch),
    fetchDashboardRegionIndicatorAmount: bindActionCreators(fetchDashboardRegionIndicatorAmount, dispatch),
    fetchDashboardRegionIndicatorCountPercent: bindActionCreators(fetchDashboardRegionIndicatorCountPercent, dispatch),
    fetchDashboardRegionIndicatorAmountPercent: bindActionCreators(fetchDashboardRegionIndicatorAmountPercent, dispatch),
    fetchDashboardBaseTopInfo: bindActionCreators(fetchDashboardBaseTopInfo, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(HomePage))
