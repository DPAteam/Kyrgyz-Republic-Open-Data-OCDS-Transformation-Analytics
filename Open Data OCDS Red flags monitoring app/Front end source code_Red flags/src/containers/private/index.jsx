import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import md5 from 'react-native-md5'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Empty,
  Pagination,
  Tabs,
  Icon,
  message,
  Layout,
  Radio,
  Input,
  Form,
  Divider,
  Spin,
} from 'antd'

import { bindActionCreators } from 'redux'
import _ from 'lodash'
import * as numeral from 'numeral'
import classnames from 'classnames'
import ReactHighcharts from 'react-highcharts'
import addNoDataModule from 'highcharts/modules/no-data-to-display'
import { generate } from 'shortid'

import {
  changeTypeOfValues,
  updateData,
  getData,
  selectFilterOption,
  clearFiltersAndUpdate,
  deselectFilterOption,
  getBucketData,
  deleteBucketItemAndUpdate,
  setBucketItemAndUpdate,
  setRegions,
  exportToExcel,
  getRisks,
  updateFilterOptions,
  getAllProcIds,
  clearSelectedProcedureIds,
  getParameters,
  postParameters,
  postChecklist,
  getChecklist,
  getChecklistCreate,
  getMappings,
  dropFilterOption,
  clearChecklistData,
  getFakeForbidden,
  getMonitoringAllFilterData,
  setBucketData,
  clearNoFilterData,
} from '../../store/monitoring/actions'
import { changeLocale } from '../../store/locale/LocaleActions'
import { changeNavigationItem } from '../../store/navigation/actions'

import DateRangePicker from '../../components/dateRangePicker/DateRangePicker'
import Card from '../../components/card/Card'
import Table from '../../components/table/Table'
import FilterForm from '../../components/forms/filters/FilterForm'
import * as CONST from './constants'
import { createUser, deleteUserById, getUsers, userLogout } from '../../store/auth/actions'
import NavigationFixed from '../../components/navigation/NavigationFixed'
import KpisBlock from '../../components/kpisBlock/KpisBlock'
import LanguagesSelector from './components/LanguagesSelector'
import BarNavigation from '../../components/barNavigation/BarNavigation'
import {
  CHART_COLORS_A,
  CHART_COLORS_B,
  CHART_COLORS_C,
  CHART_COLORS_D,
  HIGHCHART_LOCALE,
} from './constants'
import { LOCALE_NAME } from '../../store/locale/LocaleConstants'
import { OKGZ_FIELD_BY_LANGUAGE, INDICATOR_FIELD_BY_LANGUAGE, TRANSLATED_FIELD_BY_LANGUAGE } from './constants'
import { FILTER_ITEM_TRANSLATION_OPTIONS } from './constants'

import './index.scss'
import numeralRu from 'numeral/locales/ru'

const { Content } = Layout

// moment.locale('ua')

class Private extends PureComponent {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    // props.getFakeForbidden()
    let nowLocale = localStorage.getItem(LOCALE_NAME) || 'ru'

    if (ReactHighcharts.Highcharts) {
      addNoDataModule(ReactHighcharts.Highcharts)
    }

    ReactHighcharts.Highcharts.setOptions({
      lang: {
        numericSymbols: HIGHCHART_LOCALE[nowLocale].symbols,
      },
    })

    this.handleSearshTenderDelay = _.debounce(this.handleSearshTenderDelay, 1000)

    props.changeLocale(nowLocale)
    this.state = {
      proceduresTablePage: 1,
      qantityCostSelected: CONST.QANTITY_COST_OPTIONS[0].key,
      dateRange: {
        startDate: moment().subtract(31, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      },
      selectedProcedures: [],
      selectedRowKeys: [],
      isNavCollapsed: true,
      isNavCollapsedFixed: true,
      tenRegionsChartSelected: CONST.QANTITY_COST_OPTIONS[0].key,
      tenRisksChartSelected: CONST.QANTITY_COST_OPTIONS[0].key,
      procuringEntitiesBarChartSelected: CONST.QANTITY_COST_OPTIONS[0].key,
      topTenCPVChartSelected: CONST.QANTITY_COST_OPTIONS[0].key,
      riskTableSelected: CONST.QANTITY_COST_OPTIONS[0].key,
      riskChartSelected: CONST.QANTITY_COST_OPTIONS[0].key,
      growthChartSelected: CONST.QANTITY_COST_OPTIONS[0].key,
      sortField: null,
      sortDirection: 'DESC',
      controlPanelConfigure: false,
      visibleNotVerify: false,
      visibleVerify: false,
      editMode: false,
      tenderOuterId: null,
      linkId: null,
      page: null,
      size: null,
      showTextArea: false,
      showTextAreaVerify: false,
      radioButtonMonitoring: true,
      radioButtonMonitoringVerify: true,
      radioButtonProcedure: false,
      editMonitoring: true,
      defaultFormData: {},
      tableKey: generate(),
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }

  componentDidMount() {
    this.props.getMappings().then(() => {
      Promise.resolve(
        this.props.getMonitoringAllFilterData({
          startDate: this.state.dateRange.startDate,
          endDate: this.state.dateRange.endDate,
        }),
      )
    })
    this.props.changeNavigationItem('1')
    // Promise.resolve(
    //   this.props.getMonitoringAllFilterData({
    //     startDate: this.state.dateRange.startDate,
    //     endDate: this.state.dateRange.endDate,
    //   }),
    // )
    // .then(() => this.props.setRegions())
    // .then(() => this.props.getRisks())
    // this.props.getUsers()
    // this.props.getBucketData()
    // this.props.getParameters()
  }

  handleClickSelectCountOrAmount = (name, event) => {
    this.setState({ [name]: event.target.value })
  }

  handleSelectDate = e => {
    const { filtersSelected } = this.props
    let startDate = !_.isEmpty(e) ? moment(e[0]).format('YYYY-MM-DD') : moment().subtract(31, 'days').format('YYYY-MM-DD')
    let endDate = !_.isEmpty(e) ? moment(e[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
    Promise.resolve(
      this.setState({
        dateRange: {
          startDate: startDate,
          endDate: endDate,
        },
      }),
    ).then(() =>
      this.props.updateData({
        startDate: this.state.dateRange.startDate,
        endDate: this.state.dateRange.endDate,
        ...filtersSelected,
      }).then(() => {
        if (this.props.error) {
          message.error(this.props.error.description, 5)
        }
      }),
    )
  }

  renderKPIs = () => {
    if (_.isEmpty(this.props.allData)) return <Empty />

    const { intl } = this.context
    const { kpiInfoFiltered } = this.props.allData

    const infoCard = [
      {
        key: intl.formatMessage({ id: 'common.text.25' }),
        values: [
          {
            key: 'quantity',
            // value: numeral(kpiInfoFiltered.checkedProceduresCount).format('0,0'),
            value: kpiInfoFiltered.checkedProceduresCount.toLocaleString('ru'),
          },
          {
            key: 'amount',
            value:
              numeral(kpiInfoFiltered.checkedProceduresValue)
                .format('0.[00] a')
                .replace(/\d+,?\d*/, '$& ') + ` ${intl.formatMessage({ id: 'common.text.currency' })}`,
          },
        ],
      },
      {
        key: intl.formatMessage({ id: 'common.text.26' }),
        values: [
          {
            key: 'quantity',
            // value: numeral(kpiInfoFiltered.checkedRiskProceduresCount).format('0,0'),
            value: kpiInfoFiltered.checkedRiskProceduresCount.toLocaleString('ru'),
          },
          {
            key: 'amount',
            value:
              numeral(kpiInfoFiltered.checkedRiskProceduresValue)
                .format('0.[00] a')
                .replace(/\d+,?\d*/, '$& ') + ` ${intl.formatMessage({ id: 'common.text.currency' })}`,
          },
        ],
      },
      {
        key: intl.formatMessage({ id: 'common.text.27' }),
        values: [
          {
            key: 'quantity',
            // value: numeral(kpiInfoFiltered.checkedBuyersCount).format('0,0'),
            value: kpiInfoFiltered.checkedBuyersCount.toLocaleString('ru'),
          },
          {
            key: 'amount',
            value: `${numeral(kpiInfoFiltered.checkedRiskBuyersCount).format('0,0')} ${intl.formatMessage({ id: 'common.text.32.1' })}`,
          },
        ],
      },
      {
        key: intl.formatMessage({ id: 'common.text.28' }),
        values: [
          {
            key: 'quantity',
            // value: numeral(kpiInfoFiltered.indicatorsCount).format('0,0'),
            value: kpiInfoFiltered.indicatorsCount.toLocaleString('ru'),
          },
          {
            key: 'amount',
            value: `${numeral(kpiInfoFiltered.riskIndicatorsCount).format('0,0')} ${intl.formatMessage({ id: 'common.text.131' })}`,
          },
        ],
      },
    ]
    const card = _.map(infoCard, (record, index) => {
      return (
        // <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-3" key={generate()}>
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-3" key={`rotated_card_${index}`}>
          <div className="card">
            {!!record.values &&
            <div className="card_content">
              <div>
                <div className="flex-item-p">
                  <div className="flex-item-s">
                    <div className="flex-item-t">
                      <div className="flex-item-f">
                        <strong>{record.values[0].value}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h4 className="card_title">{record.key}</h4>
              <div className="card_value">{record.values[1].value}</div>
            </div>}
          </div>
        </div>
      )
    })
    return (
      <div className="kpis">
        <div className="kpis_row">{card}</div>
      </div>
    )
  }

  handleChangePage = (page, pageSize) => {

    const { filtersSelected } = this.props
    let filterOptions = {
      startDate: this.state.dateRange.startDate,
      endDate: this.state.dateRange.endDate,
      page: page - 1,
      size: pageSize,
      ...filtersSelected,
    }

    this.setState({
      page: page - 1,
      size: pageSize,
    })

    if (this.state.sortField) {
      filterOptions = _.merge({}, filterOptions, {
        sortField: this.state.sortField,
        sortDirection: this.state.sortDirection,
      })
    }

    this.props
      .updateData(filterOptions)
      .then(() =>
        this.setState({
          proceduresTablePage: page,
        }),
      )
  }

  prepareProceduresTableData = data => {
    // let tenders =
    //   this.props.bucket &&
    //   this.props.bucket.map(item => {
    //     return item.tenders.map(tender => tender.tenderId)
    //   })
    // let arrTenderId = _.flattenDeep(tenders)
    let objStructure = {
      gsw: null,
      buyerRegion: null,
      itemCpv2: null,
      itemCpv: null,
      tenderId: null,
      tenderStatusDetails: null,
      procedureType: null,
      monitoringStatus: null,
      buyerName: null,
      buyerId: null,
      tenderAmount: null,
      tenderProcurementMethodDetails: null,
      riskLevel: null,
      indicatorsWithRisk: null,
      withRisk: null,
      tenderDatePublished: null,
      isDisabled: false,
      linkId: null,
      inQueue: null,
      hasComplaints: null,
      materialityScore: null,
      icon: null,
      monitoringAppeal: null,
      tenderOuterId: null,
      hasChecklist: null,
      availableForChecklist: null,
    }
    return _.map(data.procedures, item => {
      let procedureLogOptions = _.find(this.props.mappings.procedureLogTypes, { id: item.procedureLogType })

      let obj = _.cloneDeep(objStructure)
      // obj.key = item.buyerId
      obj.key = item.tenderId
      obj.gsw = item.gsw
      // obj.buyerRegion = _.find(this.props.mappings.translatedValues, { value: `region.${item.buyerRegion.replace(' ', '_')}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]]
      obj.buyerRegion = _.find(this.props.mappings.translatedValues, { value: `region.${md5.hex_md5(item.buyerRegion)}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]]
      // obj.cpv = item.cpv
      obj.itemCpv = _.map(item.itemCpv, (itemCpv) => {
        let findCpvMappingByCode = _.find(this.props.mappings.cpvList, { code: itemCpv })
        if (findCpvMappingByCode) {
          return findCpvMappingByCode[this.props.lang === 'en' ? 'nameEn' : 'name'] ? `${itemCpv} - ${findCpvMappingByCode[this.props.lang === 'en' ? 'nameEn' : 'name']}` : itemCpv
        } else {
          return itemCpv
        }
      }).join(', ')
      // obj.cpv = item.cpvName
      obj.itemCpv2 = _.map(item.itemCpv2, (okgzCode) => {
        let findCpvMappingByCode = _.find(this.props.mappings.okgzList, { code: okgzCode })
        if (findCpvMappingByCode) {
          return findCpvMappingByCode[OKGZ_FIELD_BY_LANGUAGE[this.props.lang]]
        } else {
          return okgzCode
        }
      }).join(', ')
      // obj.tenderId = item.buyerId
      obj.tenderId = item.tenderId
      obj.tenderStatusDetails = _.find(this.props.mappings.translatedValues, { value: `status-detail.${item.tenderStatusDetails}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]]
      obj.procedureType = item.procedureType
      // obj.monitoringStatus = item.monitoringStatus
      // obj.procuringEntityName = item.buyerName
      obj.buyerName = item.buyerName
      obj.buyerId = item.buyerId
      // obj.expectedValue = parseInt(numeral(item.tenderAmount).format('0')).toLocaleString(this.props.lang === 'en' ? 'en' : 'ru')
      obj.tenderAmount = parseInt(numeral(item.tenderAmount).format('0')).toLocaleString(this.props.lang === 'en' ? 'en' : 'ru')
      obj.tenderProcurementMethodDetails = _.find(this.props.mappings.translatedValues, { value: `procurement-method-details.${item.tenderProcurementMethodDetails}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]]
      // obj.indicatorsWithRisk = item.indicatorsWithRisk
      obj.riskLevel = _.find(this.props.mappings.translatedValues, { value: `risk-level.${item.riskLevel}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]]
      obj.indicatorsWithRisk = _.map(item.indicatorsWithRisk, (indKey) => (
        _.find(this.props.mappings.indicators, { id: parseInt(indKey) }).name
      )).join(', ')
      obj.tenderDatePublished = item.tenderDatePublished
      obj.linkId = item.tenderOuterId
      obj.inQueue = item.inQueue
      obj.hasComplaints = item.hasComplaints
      obj.withRisk = item.withRisk
      obj.materialityScore = item.materialityScore
      obj.icon = (
        <span>
          {/*{arrTenderId.includes(item.tenderId) ? <Icon type="shopping-cart" style={{ fontSize: 16 }} /> : null}{' '}*/}
          {/*<Icon type="close-circle" theme="filled" style={{ color: '#fd3d3d', fontSize: 16 }} />*/}
          {/*<i className="anticon feedback-icon"></i>*/}
        </span>
      )
      obj.monitoringAppeal = item.monitoringAppeal
      obj.tenderOuterId = item.tenderOuterId
      // obj.checklist = data.checklistInfo.filter(info => info.tenderOuterId === item.tenderOuterId)
      // obj.checklist = [{
      //   hasChecklist: hasChecklistStatus,
      //   availableForChecklist: availableForChecklist,
      //   tenderOuterId: item.tenderOuterId,
      // }]
      return obj
    })
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedProcedures: selectedRows,
      selectedRowKeys: selectedRowKeys,
    })
  }

  handleSetProcedoresToBucket = () => {
    const { intl } = this.context
    const { selectedRowKeys } = this.state

    this.props.setBucketData({
      tenderIds: selectedRowKeys,
    }).then(() => {
      if (this.props.error) {
        message.error(this.props.error.description)
      } else {
        message.success(intl.formatMessage({ id: 'common.text.144' }))
      }
    })
  }

  handleExportToExcel = () => {
    const { intl } = this.context
    const FILE_NAME = `selected_procedures_${moment().format('DD-MM-YYYY_HH-mm')}`
    const { selectedRowKeys } = this.state
    if (selectedRowKeys.length < 60000)
      this.props.exportToEXCEL({
        locale: this.props.lang.toUpperCase(),
        tenderIds: selectedRowKeys,
      }, FILE_NAME).then(() =>
        this.setState({
          selectedProcedures: [],
          selectedRowKeys: [],
        }),
      )
    else message.error(intl.formatMessage({ id: 'common.text.137' }))
  }

  handleSelectAllProcedures = () => {
    const { filtersSelected } = this.props

    if (this.props.procedureIds && !!this.props.procedureIds.tenderIds)
      Promise.resolve(this.props.clearSelectedProcedureIds()).then(() => {
        this.setState({
          selectedRowKeys: [],
        })
      })
    else
      Promise.resolve(
        this.props.getAllProcIds({
          startDate: this.state.dateRange.startDate,
          endDate: this.state.dateRange.endDate,
          ...filtersSelected,
        }),
      ).then(() => {
        this.setState({
          selectedRowKeys: this.props.procedureIds.tenderIds,
        })
      })
  }

  handleColumnSorter = (pagination, filters, sorter) => {
    let filtersSelected = _.cloneDeep(this.props.filtersSelected)
    let filterOptions = {
      startDate: this.state.dateRange.startDate,
      endDate: this.state.dateRange.endDate,
      page: 0,
      ...filtersSelected,
    }

    let sorterOrder, sortField = null

    const SORT = { ascend: 'ASC', descend: 'DESC' }

    if (!_.isEmpty(sorter)) {
      if (sorter.hasOwnProperty('order')) {
        sortField = sorter.field
        sorterOrder = SORT[sorter.order]
        filterOptions = _.merge({}, filterOptions, {
          sortField: sortField,
          sortDirection: sorterOrder,
        })
      } else {
        delete filterOptions['sortDirection']
        delete filterOptions['sortField']
      }
    } else {
      delete filterOptions['sortDirection']
      delete filterOptions['sortField']
    }

    this.setState({
      sortField: sortField,
      sortDirection: sorterOrder,
    })

    this.props
      .updateData(filterOptions)
      .then(() =>
        this.setState({
          proceduresTablePage: 1,
        }),
      )
  }

  getRowClassName = (record, i) => {
    const ROW_CLASS = {
      inQueue: 'table-row-in-queue',
      monitoringStatus: 'table-row-monitoring-status',
      monitoringAppeal: 'table-row-monitoring-appeal',
      complaints: 'table-row-complaints',
      riskedProcedures: 'table-row-indicators-with-risk',
    }

    // if (!!record.inQueue)
    //   return ROW_CLASS.inQueue
    if (record.hasComplaints) return ROW_CLASS.complaints

    if (record.monitoringAppeal) return ROW_CLASS.monitoringAppeal

    // if (!_.isEmpty(record.indicatorsWithRisk)) return ROW_CLASS.riskedProcedures
    if (record.withRisk) return ROW_CLASS.riskedProcedures

    return ''
  }

  renderSqeare = (fillColor) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill={fillColor}
      >
        <rect width="15" height="15" fill={fillColor} />
      </svg>
    )
  }

  renderTableLegend = () => {
    return (
      <Fragment>
        <div className="ml-3 mt-3 mb-3">
          <div className="monitoring">{this.renderSqeare('#AAD6E9')} <FormattedMessage id="common.text.73" /></div>
          <div className="have">{this.renderSqeare('#DAE6E7')} <FormattedMessage id="common.text.74" /></div>
        </div>
      </Fragment>
    )
  }

  renderProceduresTable = () => {
    if (_.isEmpty(this.props.allData)) return <Empty />

    const { intl } = this.context
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    }
    const objStructure = [
      {
        title: '',
        dataIndex: 'icon',
        width: 0,
      },
      {
        title: intl.formatMessage({ id: 'common.text.59' }),
        dataIndex: 'tenderId',
        width: 130,
        sorter: true,
      },
      {
        title: intl.formatMessage({ id: 'common.text.60' }),
        dataIndex: 'tenderAmount',
        width: 100,
        sorter: true,
      },
      {
        title: intl.formatMessage({ id: 'common.text.60.1' }),
        dataIndex: 'tenderProcurementMethodDetails',
        width: 100,
        sorter: true,
      },
      {
        title: intl.formatMessage({ id: 'common.text.61' }),
        dataIndex: 'buyerName',
        width: 300,
        sorter: true,
      },
      {
        title: intl.formatMessage({ id: 'common.text.68' }),
        dataIndex: 'buyerId',
        width: 120,
        sorter: true,
      },
      {
        title: intl.formatMessage({ id: 'common.text.62' }),
        dataIndex: 'itemCpv',
        width: 350,
        // sorter: true,
      },
      // {
      //   title: intl.formatMessage({ id: 'common.text.63' }),
      //   dataIndex: 'itemCpv2',
      //   width: 250,
      //   // sorter: true,
      // },
      // {
      //   title: intl.formatMessage({id: 'common.text.64'}),
      //   dataIndex: 'procedureType',
      //   width: 100,
      //   sorter: true,
      // },
      {
        title: intl.formatMessage({ id: 'common.text.64' }),
        dataIndex: 'tenderStatusDetails',
        width: 130,
        sorter: true,
      },
      {
        title: intl.formatMessage({ id: 'common.text.65' }),
        dataIndex: 'buyerRegion',
        width: 160,
        sorter: true,
      },
      {
        title: intl.formatMessage({ id: 'common.text.66' }),
        dataIndex: 'tenderDatePublished',
        width: 100,
        sorter: true,
      },
      {
        title: intl.formatMessage({ id: 'common.text.67' }),
        dataIndex: 'riskLevel',
        width: 100,
        sorter: true,
      },
      {
        title: intl.formatMessage({ id: 'common.text.67.1' }),
        dataIndex: 'indicatorsWithRisk',
        width: 100,
        sorter: true,
      },
      // {
      //   title: 'Моніторинг',
      //   dataIndex: 'monitoringStatus',
      //   width: 120,
      //   sorter: true,
      // },
      {
        title: intl.formatMessage({ id: 'common.text.69' }),
        dataIndex: 'linkId',
        render: id => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`http://zakupki.gov.kg/popp/view/order/view.xhtml?id=${id}`}
          >{`http://zakupki.gov.kg/${id}`}</a>
        ),
        width: 150,
      },
    ]
    const hasSelected = selectedRowKeys.length > 0
    return (
      <Fragment>
        <div className="row mt-3 mb-2">
          <div className="d-flex procedure-table-header justify-content-between col-md-12">
            <Button
              className="ml-3"
              ghost={this.props.procedureIds && !!this.props.procedureIds.tenderIds ? false : true}
              htmlType="button"
              type={
                this.props.procedureIds && !!this.props.procedureIds.tenderIds
                  ? 'default'
                  : 'primary'
              }
              onClick={this.handleSelectAllProcedures}
            >
              <Icon
                type={
                  this.props.procedureIds && !!this.props.procedureIds.tenderIds
                    ? 'close'
                    : 'check-square'
                }
                style={{ color: '#63D4B1', fontSize: 16 }}
              />
              {!_.isEmpty(this.state.selectedRowKeys)
                ? intl.formatMessage({ id: 'common.text.136' })
                : intl.formatMessage({ id: 'common.text.70' })}
            </Button>
            {/*<div className={'d-flex flex-row justify-content-center align-items-center ml-3'}>*/}
            {/*  {hasSelected && (*/}
            {/*    <Fragment>*/}
            {/*      <Icon type="check-square" />*/}
            {/*      <div className="ml-1 mr-2">*/}
            {/*        {this.state.selectedRowKeys.length} вибраних процедур*/}
            {/*      </div>*/}
            {/*    </Fragment>*/}
            {/*  )}*/}
            {/*</div>*/}
            <Button.Group>
              <Button
                ghost
                disabled={!hasSelected}
                htmlType="button"
                type="primary"
                onClick={this.handleExportToExcel}
              >
                <Icon type="vertical-align-bottom" style={{ fontSize: 16 }} />
                <FormattedMessage id='common.text.71' />
              </Button>
              <Button
                htmlType="button"
                className="mr-3"
                disabled={
                  !hasSelected
                  // || (this.props.procedureIds && !!this.props.procedureIds.tenderIds)
                }
                type="primary"
                onClick={this.handleSetProcedoresToBucket}
              >
                <Icon type="profile" style={{ color: '#FFFFFF', fontSize: 16 }} />
                <FormattedMessage id='common.text.72' />
              </Button>
            </Button.Group>
          </div>
        </div>
        <div className="custom-table-wrapper">
          <Table
            key={this.state.tableKey}
            filtered={true}
            onChange={this.handleColumnSorter}
            rowSelection={rowSelection}
            columns={objStructure}
            pagination={false}
            rowClassName={this.getRowClassName}
            data={this.prepareProceduresTableData(this.props.allData.data)}
            scroll={{ x: 3200 }}
            isFetching={this.props.allDataIsFetching}
            // onRow={(record, rowIndex) => {
            //   return {
            //     onClick: e => this.handleRowSelectChange([record.tenderId], record),
            //   }
            // }}
          />
        </div>
        <div className="d-flex table-footer-block">
          {this.renderTableLegend()}
          <Pagination
            current={this.state.proceduresTablePage}
            className="mt-4 mb-4 mr-3"
            total={this.props.allData.data.totalCount}
            onChange={this.handleChangePage}
          />
        </div>
      </Fragment>
    )
  }

  renderGrowthChart = () => {
    if (_.isEmpty(this.props.allData)) return <Empty />

    const { intl } = this.context
    const { dynamicChartData } = this.props.allData.chartsDataWraper
    const { dynamicChartDataAmount } = this.props.allData.chartsDataWraper
    let tempDate = _.map(dynamicChartData, elem => {
      return elem.dateAsString
    })
    let state = this.state
    let selectDynamic =
      this.state.growthChartSelected === 'count' ? dynamicChartData : dynamicChartDataAmount
    let label =
      this.state.growthChartSelected === 'count'
        ? intl.formatMessage({ id: 'common.text.42' })
        : intl.formatMessage({ id: 'common.text.43' })
    let cost = this.state.growthChartSelected === 'count' ? '' : ` ${intl.formatMessage({ id: 'common.text.currency' })}`

    return (
      <ReactHighcharts
        key={generate()}
        config={{
          chart: {
            spacing: [3, 0, 5, 0],
            style: {
              fontFamily: 'Oswald', //'Open Sans'
            },
            backgroundColor: null,
            plotBackgroundColor: null,
          },
          lang: {
            noData: intl.formatMessage({ id: 'common.text.152' }),
          },
          noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#303030',
            },
          },
          title: {
            margin: 20,
            text: intl.formatMessage({ id: 'common.text.52' }),
            align: 'left',
            style: {
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '20px',
              lineHeight: '30px',
              letterSpacing: '0.05em',
              color: '#FFFFFF',
            },
          },
          // text: `Інтервал часу з ${state.dateRange.startDate} до ${state.dateRange.endDate} (потижнево)`,
          xAxis: {
            categories: tempDate,
            lineColor: '#75BADC',
            tickColor: '#75BADC',
            // gridLineWidth: 1,
            title: {
              text: `${intl.formatMessage({ id: 'common.text.53' })} ${state.dateRange.startDate} ${intl.formatMessage({ id: 'common.text.54' })} ${state.dateRange.endDate} (${intl.formatMessage({ id: 'common.text.55' })})`,
              style: {
                color: '#75BADC',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '14px',
                lineHeight: '21px',
                letterSpacing: '0.05em',
              },
            },
            labels: {
              rotation: -35,
              useHTML: true,
              style: {
                color: '#75BADC',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '14px',
                lineHeight: '21px',
                textAlign: 'center',
                letterSpacing: '0.05em',
              },
            },
            minPadding: 0,
            maxPadding: 0,
          },
          yAxis: {
            gridLineColor: '#75BADC',
            gridLineWidth: 1,
            title: {
              text: label,
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.05em',
              },
            },
            labels: {
              useHTML: true,
              // formatter: function () {
              //   return this.value
              // },
              style: {
                color: '#75BADC',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                letterSpacing: '0.05em',
              },
            },
          },
          tooltip: {
            formatter: function () {
              return (
                intl.formatMessage({ id: 'common.text.134' }) + ' <b>' +
                this.key +
                '</b><br />' +
                this.series.name +
                ': <b>' +
                numeral(this.y).format('0.[00] a') +
                `${cost}</b>`
              )
            },
          },
          legend: {
            itemStyle: {
              color: '#FFFFFF',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '14px',
              lineHeight: '21px',
              letterSpacing: '0.05em',
            },
          },
          credits: { enabled: false },
          series: [
            {
              name: intl.formatMessage({ id: 'common.text.56' }),
              color: '#8ECACE',
              data: _.map(selectDynamic, item => {
                return item.totalCount
              }),
            },
            {
              name: intl.formatMessage({ id: 'common.text.57' }),
              color: '#2A577F',
              data: _.map(selectDynamic, item => {
                return item.countWithRisk
              }),
            },
            // {
            //   name: intl.formatMessage({ id: 'common.text.58' }),
            //   color: '#63D4B1',
            //   data: _.map(selectDynamic, item => {
            //     return item.countWithPriority
            //   }),
            // },
          ],
        }}
      />
    )
  }

  renderRiskChart = () => {
    if (_.isEmpty(this.props.allData)) return <Empty />

    const { intl } = this.context
    const { proceduresByPurchaseMethod } = this.props.allData.chartsDataWraper
    const { proceduresByPurchaseMethodAmount } = this.props.allData.chartsDataWraper
    let selectProcedures =
      this.state.riskChartSelected === 'count'
        ? proceduresByPurchaseMethod
        : proceduresByPurchaseMethodAmount
    let label = this.state.riskChartSelected === 'count' ? intl.formatMessage({ id: 'common.text.44' }) : intl.formatMessage({ id: 'common.text.45' })
    let cost = this.state.riskChartSelected === 'count' ? '' : ` ${intl.formatMessage({ id: 'common.text.currency' })}`
    let allValue =
      this.state.riskChartSelected === 'count'
        ? _.reduce(proceduresByPurchaseMethod, (sum, item) => sum + item.value, 0)
        : _.reduce(proceduresByPurchaseMethodAmount, (sum, item) => sum + item.value, 0)

    return (
      <ReactHighcharts
        key={generate()}
        config={{
          chart: {
            type: 'pie',
            spacing: [0, 0, 0, 0],
            style: {
              fontFamily: 'Oswald', //'Open Sans'
            },
            backgroundColor: null,
            plotBackgroundColor: null,
          },
          lang: {
            noData: intl.formatMessage({ id: 'common.text.152' }),
          },
          noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#303030',
            },
          },
          title: {
            margin: 10,
            text: intl.formatMessage({ id: 'common.text.51' }),
            // align: 'left',
            style: {
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '20px',
              lineHeight: '30px',
              letterSpacing: '0.05em',
              color: '#FFFFFF',
            },
          },
          xAxis: {
            visible: false,
            minPadding: 0,
            maxPadding: 0,
          },
          plotOptions: {
            pie: {
              innerSize: 100,
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false,
              },
              showInLegend: true,
            },
          },
          yAxis: { visible: false },
          tooltip: {
            outside: true,
            formatter: function () {
              return (
                '<b>' +
                this.point.name +
                '</b><br/>' +
                intl.formatMessage({ id: 'common.text.135' }) + ' <b>' +
                numeral((this.y / allValue) * 100).format('0.0') +
                '%</b><br>' +
                label +
                ': <b>' +
                numeral(this.y).format('0.[00] a') +
                `${cost}</b>`
              )
            },
          },
          legend: { enabled: false },
          credits: { enabled: false },
          series: [
            {
              borderWidth: 0,
              innerSize: '50%',
              data: _.map(selectProcedures, (item, index) => {
                return {
                  // name: item.key,
                  name: _.find(this.props.mappings.translatedValues, { value: `procurement-method-details.${item.key}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]],
                  y: Math.round(item.value),
                  color: CHART_COLORS_D[index],
                }
              }),
            },
          ],
        }}
      />
    )
  }

  renderTenRegionsChart = () => {
    if (_.isEmpty(this.props.allData && this.props.allData.chartsDataWraper)) return <Empty />

    const { intl } = this.context
    const _self = this
    const { top10Regions } = this.props.allData.chartsDataWraper
    const { top10RegionsAmount } = this.props.allData.chartsDataWraper
    let topTemp = this.state.tenRegionsChartSelected === 'count' ? top10Regions : top10RegionsAmount
    // let top10 = this.state.tenRegionsChartSelected === 'count' ? top10Regions.splice(5,5) : top10RegionsAmount.splice(5,5)
    // let top10 = _.orderBy(topTemp, ['count'], ['desc']).filter((v, i) => (i < 5))
    let top10 = topTemp.filter((v, i) => (i < 5))
    let label =
      this.state.tenRegionsChartSelected === 'count'
        ? intl.formatMessage({ id: 'common.text.35' })
        : intl.formatMessage({ id: 'common.text.36' })
    let cost = this.state.tenRegionsChartSelected === 'count' ? '' : ` ${intl.formatMessage({ id: 'common.text.currency' })}`

    if (_.isEmpty(top10)) return <Empty />

    let tempName = _.map(top10, elem => {
      // return elem.name
      // return _.find(this.props.mappings.translatedValues, { value: `region.${elem.name.replace(' ', '_')}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]]
      return _.find(this.props.mappings.translatedValues, { value: `region.${md5.hex_md5(elem.name)}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]]
    })
    let tempPriori = _.map(top10, elem => {
      // return elem.withRiskCount
      return elem.count
    })

    return (
      <ReactHighcharts
        key={generate()}
        config={{
          chart: {
            type: 'column',
            height: 400,
            spacing: [15, 0, 15, 0],
            style: {
              fontFamily: 'Oswald', //'Open Sans'
            },
            backgroundColor: null,
            plotBackgroundColor: null,
          },
          lang: {
            noData: intl.formatMessage({ id: 'common.text.152' }),
          },
          noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#303030',
            },
          },
          title: {
            margin: 50,
            text: intl.formatMessage({ id: 'common.text.37' }),
            // x: 20,
            // y: 20,
            // align: 'left',
            style: {
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '20px',
              lineHeight: '30px',
              letterSpacing: '0.05em',
              color: '#FFFFFF',
            },
          },
          xAxis: {
            minPadding: 0,
            maxPadding: 0,
            title: {
              text: intl.formatMessage({ id: 'common.text.34' }),
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.05em',
              },
            },
            tickPositions: [],
            labels: {
              useHTML: true,
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                letterSpacing: '0.05em',
              },
            },
          },
          yAxis: {
            gridLineColor: '#75BADC',
            gridLineWidth: 1,
            title: {
              text: label,
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.05em',
              },
            },
            labels: {
              useHTML: true,
              formatter: function () {
                return _self.state.tenRegionsChartSelected === 'count' ? this.value : numeral(this.value).format('0.[00] a')
                // return this.value
              },
              style: {
                color: '#75BADC',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                letterSpacing: '0.05em',
              },
            },
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              stacking: 'normal',
              pointWidth: 15,
            },
          },
          tooltip: {
            outside: true,
            useHTML: true,
            formatter: function () {
              return (
                '<div class="tooltip-chart-wrapper">'
                + '<div class="tooltip-card-title">' + tempName[this.x] + '</div>'
                + '<div class="tooltip-simple-text"><span>' + this.point.stackTotal + ' - </span><span>' + intl.formatMessage({ id: 'common.text.31' }) + '</span></div>'
                + '<div class="tooltip-simple-text"><span>' + this.point.withRisk + ' - </span><span>' + intl.formatMessage({ id: 'common.text.32' }) + '</span></div>'
                + '<div class="tooltip-simple-text"><span>' + this.point.percent + '% - </span><span>' + intl.formatMessage({ id: 'common.text.38' }) + '</span></div>'
                + '</div>'
              )
              // return (
              //   '<b>' +
              //   tempName[this.x] +
              //   '</b><br/>Пріоритезовані: <b>' +
              //   numeral(tempPriori[this.x]).format('0.[00] a') +
              //   `${cost}</b><br>` +
              //   '</b>Частка пріоритезованих в усіх ризикованих: <b>' +
              //   numeral((tempPriori[this.x] / this.point.stackTotal) * 100).format('0.0') +
              //   '%</b><br/>Всього: <b>' +
              //   numeral(this.point.stackTotal).format('0.[00] a') +
              //   `${cost}</b>`
              // )
            },
          },
          legend: { enabled: false },
          credits: { enabled: false },
          responsive: {
            rules: [
              {
                condition: {
                  minWidth: 500,
                },
                chartOptions: {
                  series: [
                    {
                      pointWidth: 40,
                    },
                    {
                      pointWidth: 40,
                    },
                  ],
                },
              },
            ],
          },
          series: [
            {
              name: 'Всього',
              data: _.map(top10, (elem, index) => {
                // return elem.allWithRiskCount - elem.prioritizedOfThem
                // return elem.allWithRiskCount
                return {
                  name: '',
                  // y: elem.withRiskCount,
                  y: elem.count,
                  color: index % 2 ? '#72BBDB' : '#A8E2D1',
                  withRisk: elem.withRiskCount,
                  percent: ((elem.withRiskCount / elem.count) * 100).toFixed(1),
                }
              }),
              // color: index % 2 ? '#A8E2D1' : '#72BBDB',
            },
            // {
            //   name: 'Пріоритетних',
            //   data: _.map(top10, elem => {
            //     return elem.prioritizedOfThem
            //   }),
            //   color: '#72BBDB',
            // },
          ],
        }}
      />
    )
  }

  renderTenRisksChart = () => {
    if (_.isEmpty(this.props.allData)) return <Empty />

    const _self = this
    const { intl } = this.context
    const { top10RiskIndicators } = this.props.allData.chartsDataWraper
    const { top10RiskIndicatorsAmount } = this.props.allData.chartsDataWraper
    const { risks } = this.props

    let top10 =
      this.state.tenRisksChartSelected === 'count' ? top10RiskIndicators : top10RiskIndicatorsAmount
    // let tempCat = []
    let tempDat = []
    let temp = []
    // let tooltip = []
    let label =
      this.state.tenRisksChartSelected === 'count'
        ? intl.formatMessage({ id: 'common.text.42' })
        : intl.formatMessage({ id: 'common.text.43' })
    let cost = this.state.tenRisksChartSelected === 'count' ? '' : ` ${intl.formatMessage({ id: 'common.text.currency' })}`

    let indicatorsSearchOptions = FILTER_ITEM_TRANSLATION_OPTIONS['riskedIndicators']

    _.forEach(top10, (elem, i) => {
      let findCpvMappingByCode = _.find(this.props.mappings.indicators, { id: parseInt(elem.key) })
      let preparedString = ''
      if (findCpvMappingByCode) {
        preparedString = findCpvMappingByCode.name + ' - ' + findCpvMappingByCode[indicatorsSearchOptions[this.props.lang]]
      } else {
        preparedString = elem.key
      }

      // tooltip.push({
      //   name: preparedString,
      //   value:
      //     this.state.tenRisksChartSelected === 'count'
      //       ? numeral(elem.value).format('0,0a')
      //       : numeral(elem.value).format('0,0a') + ` ${intl.formatMessage({ id: 'common.text.currency' })}`,
      // })
      // tempCat.push(i)
      tempDat.push({
        // name: elem.key,
        name: preparedString,
        y: Math.round(elem.value),
        color: CHART_COLORS_A[i % 2],
        maxPointWidth: 100,
      })
      return true
    })

    temp.push({
      data: tempDat,
    })

    return (
      <ReactHighcharts
        key={generate()}
        config={{
          chart: {
            type: 'column',
            height: 400,
            spacing: [15, 0, 15, 0],
            style: {
              fontFamily: 'Oswald', //'Open Sans'
            },
            backgroundColor: null,
            plotBackgroundColor: null,
          },
          lang: {
            noData: intl.formatMessage({ id: 'common.text.152' }),
          },
          noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#303030',
            },
          },
          title: {
            margin: 50,
            text: intl.formatMessage({ id: 'common.text.39' }),
            align: 'left',
            style: {
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '20px',
              lineHeight: '30px',
              letterSpacing: '0.05em',
              color: '#FFFFFF',
            },
          },
          xAxis: {
            minPadding: 0,
            maxPadding: 0,
            title: {
              text: intl.formatMessage({ id: 'common.text.46' }),
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.05em',
              },
            },
            tickPositions: [],
            labels: {
              useHTML: true,
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                letterSpacing: '0.05em',
              },
            },
          },
          yAxis: {
            gridLineColor: '#75BADC',
            gridLineWidth: 1,
            title: {
              text: label,
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.05em',
              },
            },
            labels: {
              useHTML: true,
              formatter: function () {
                return _self.state.tenRisksChartSelected === 'count' ? this.value : numeral(this.value).format('0.[00] a')
                // return this.value
              },
              style: {
                color: '#75BADC',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                letterSpacing: '0.05em',
              },
            },
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              groupPadding: 0.01,
            },
          },
          tooltip: {
            className: 'custom-tooltip',
            useHTML: true,
            outside: true,
            formatter: function () {
              return (
                '<div class="tooltip-chart-wrapper">'
                + '<div class="tooltip-card-title">' + this.point.name + '</div>'
                + '<div class="tooltip-simple-text"><span>' + numeral(this.y).format('0.[00] a') + ' ' + cost + ' - </span><span>' + label + '</span></div>'
                + '</div>'
              )
              // return (
              //   'Ризик: <b>' +
              //   tooltip[this.x].name +
              //   '</b><br>' +
              //   label +
              //   ': <b>' +
              //   numeral(this.y).format('0.[00] a') +
              //   `${cost}</b>`
              // )
            },
          },
          legend: { enabled: false },
          credits: { enabled: false },
          series: temp,
        }}
      />
    )
  }

  renderTopTenCPVChart = () => {
    if (_.isEmpty(this.props.allData)) return <Empty />

    const _self = this
    const { intl } = this.context
    const { top10Cpv } = this.props.allData.chartsDataWraper
    const { top10CpvAmount } = this.props.allData.chartsDataWraper
    let top10 = this.state.topTenCPVChartSelected === 'count' ? top10Cpv : top10CpvAmount
    // let tempCat = []
    let tempDat = []
    let temp = []
    let label =
      this.state.topTenCPVChartSelected === 'count'
        ? intl.formatMessage({ id: 'common.text.42' })
        : intl.formatMessage({ id: 'common.text.43' })
    let cost = this.state.topTenCPVChartSelected === 'count' ? '' : ` ${intl.formatMessage({ id: 'common.text.currency' })}`

    let indicatorsSearchOptions = FILTER_ITEM_TRANSLATION_OPTIONS['itemCpv2']

    _.map(top10, (elem, i) => {
      let findCpvMappingByCode = _.find(this.props.mappings[indicatorsSearchOptions.mappingKey], { [indicatorsSearchOptions.searchKey]: elem.key })
      findCpvMappingByCode = findCpvMappingByCode ? findCpvMappingByCode[indicatorsSearchOptions[this.props.lang]] : elem.key
      // tempCat.push(i)
      tempDat.push({
        // name: elem.key,
        name: findCpvMappingByCode,
        y: Math.round(elem.value),
        color: CHART_COLORS_C[i % 2],
        maxPointWidth: 100,
      })
      return true
    })

    temp.push({
      data: tempDat,
    })

    return (
      <ReactHighcharts
        key={generate()}
        config={{
          chart: {
            type: 'column',
            height: 400,
            spacing: [15, 0, 15, 0],
            style: {
              fontFamily: 'Oswald', //'Open Sans'
            },
            backgroundColor: null,
            plotBackgroundColor: null,
          },
          lang: {
            noData: intl.formatMessage({ id: 'common.text.152' }),
          },
          noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#303030',
            },
          },
          title: {
            margin: 50,
            text: intl.formatMessage({ id: 'common.text.50' }),
            align: 'left',
            style: {
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '20px',
              lineHeight: '30px',
              letterSpacing: '0.05em',
              color: '#FFFFFF',
            },
          },
          xAxis: {
            minPadding: 0,
            maxPadding: 0,
            title: {
              text: intl.formatMessage({ id: 'common.text.49' }),
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.05em',
              },
            },
            tickPositions: [],
            labels: {
              useHTML: true,
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                letterSpacing: '0.05em',
              },
            },
          },
          yAxis: {
            gridLineColor: '#75BADC',
            gridLineWidth: 1,
            title: {
              text: label,
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.05em',
              },
            },
            labels: {
              useHTML: true,
              formatter: function () {
                return _self.state.topTenCPVChartSelected === 'count' ? this.value : numeral(this.value).format('0.[00] a')
                // return this.value
              },
              style: {
                color: '#75BADC',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                letterSpacing: '0.05em',
              },
            },
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              groupPadding: 0.01,
            },
          },
          legend: { enabled: false },
          tooltip: {
            useHTML: true,
            outside: true,
            formatter: function () {
              return (
                '<div class="tooltip-chart-wrapper">'
                + '<div class="tooltip-card-title">' + tempDat[this.x].name + '</div>'
                + '<div class="tooltip-simple-text"><span>' + numeral(this.y).format('0.[00] a') + ' ' + cost + ' - </span><span>' + label + '</span></div>'
                + '</div>'
              )
              // return (
              //   'Назва CPV: <b>' +
              //   tempDat[this.x].name +
              //   '</b><br>' +
              //   label +
              //   ': <b>' +
              //   numeral(this.y).format('0.[00] a') +
              //   `${cost}</b>`
              // )
            },
          },
          credits: { enabled: false },
          series: temp,
        }}
      />
    )
  }

  renderTenRegionsChartLegend = () => {
    if (_.isEmpty(this.props.allData)) return <Empty />

    const { intl } = this.context
    const { top10Regions } = this.props.allData.chartsDataWraper
    const { top10RegionsAmount } = this.props.allData.chartsDataWraper
    // let top10 = this.state.tenRegionsChartSelected === 'count' ? top10Regions : top10RegionsAmount
    let topTemp = this.state.tenRegionsChartSelected === 'count' ? top10Regions : top10RegionsAmount
    let top10 = topTemp.filter((x, i) => (i < 5))
    let legend = []

    _.forEach(top10, elem => {
      legend.push({
        id: generate(),
        // name: elem.name,
        // name: _.find(this.props.mappings.translatedValues, { value: `region.${elem.name.replace(' ', '_')}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]],
        name: _.find(this.props.mappings.translatedValues, { value: `region.${md5.hex_md5(elem.name)}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]],
        value:
          this.state.tenRegionsChartSelected === 'count'
            // ? numeral(elem.prioritizedOfThem).format('0.[00]a')
            ? elem.withRiskCount
            : numeral(elem.withRiskCount).format('0.[00]a') + ` ${intl.formatMessage({ id: 'common.text.currency' })}`,
        allValue:
          this.state.tenRegionsChartSelected === 'count'
            // ? numeral(elem.allWithRiskCount).format('0.[00]a')
            // ? elem.allWithRiskCount
            ? elem.count
            // : numeral(elem.allWithRiskCount).format('0.[00]a') + ` ${intl.formatMessage({ id: 'common.text.currency' })}`,
            : numeral(elem.count).format('0.[00]a') + ` ${intl.formatMessage({ id: 'common.text.currency' })}`,
        valueNumber: elem.prioritizedOfThem,
        allValueNumber: elem.allWithRiskCount,
        percent: ((elem.withRiskCount / elem.count) * 100).toFixed(1),
      })
      return true
    })


    let resultArray = []

    if (window.innerWidth > 575) {
      let chunkedArray = _.chunk(legend, 5)
      if (!_.isEmpty(chunkedArray)) {
        _.forEach(chunkedArray[0], (firsData, index) => {
          resultArray.push(firsData)
          if (!_.isEmpty(chunkedArray[1]) && !_.isEmpty(chunkedArray[1][index])) {
            resultArray.push(chunkedArray[1][index])
          }
        })
      }
    } else {
      resultArray = legend
    }

    const legendList = _.map(resultArray, item => {
      return (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 margin-bottom-30" key={item.id}>
          <div className="legend-card-title">{item.name}</div>
          <div className="legend-simple-text"><FormattedMessage id="common.text.31" /> - {item.allValue}</div>
          <div className="legend-simple-text"><FormattedMessage id="common.text.32" /> - {item.value}</div>
          <div className="legend-simple-text"><FormattedMessage
            id="common.text.33" /> - {item.percent}%
          </div>
        </div>
      )
      // return (
      //   <li key={item.id}>
      //     <b>{item.name}</b> Пріоритезовані: <b>{item.value}</b> Частка пріоритезованих в усіх
      //     ризикованих:{' '}
      //     <b>{numeral((item.valueNumber / item.allValueNumber) * 100).format('0.0')}% </b>
      //     Всього: <b>{item.allValue}</b>
      //   </li>
      // )
    })
    // return <ol>{legendList}</ol>
    return legendList
  }

  renderTenRisksChartLegend = () => {
    if (_.isEmpty(this.props.allData)) return <Empty />

    const { intl } = this.context
    const { risks } = this.props
    const { top10RiskIndicators } = this.props.allData.chartsDataWraper
    const { top10RiskIndicatorsAmount } = this.props.allData.chartsDataWraper
    let top10 = _.cloneDeep(
      this.state.tenRisksChartSelected === 'count'
        ? top10RiskIndicators
        : top10RiskIndicatorsAmount,
    )
    let legend = []
    let label =
      this.state.tenRisksChartSelected === 'count'
        ? intl.formatMessage({ id: 'common.text.41' })
        : intl.formatMessage({ id: 'common.text.43' })

    let indicatorsSearchOptions = FILTER_ITEM_TRANSLATION_OPTIONS['riskedIndicators']

    _.forEach(top10, (elem, i) => {
      let findCpvMappingByCode = _.find(this.props.mappings.indicators, { id: parseInt(elem.key) })
      let preparedString = ''
      if (findCpvMappingByCode) {
        preparedString = (i + 1) + '. ' + findCpvMappingByCode.name + ' - ' + findCpvMappingByCode[indicatorsSearchOptions[this.props.lang]]
        preparedString = preparedString.length > 155 ? preparedString.slice(0, 155) + '...' : preparedString
      } else {
        preparedString = elem.key
      }

      legend.push({
        id: generate(),
        position: i + 1,
        // name: `${elem.key}`,
        name: preparedString,
        value:
          this.state.tenRisksChartSelected === 'count'
            ? numeral(elem.value).format('0.[00]a')
            : numeral(elem.value).format('0.[00]a') + ` ${intl.formatMessage({ id: 'common.text.currency' })}`,
      })
    })

    let resultArray = []

    if (window.innerWidth > 575) {
      let chunkedArray = _.chunk(legend, 5)
      if (!_.isEmpty(chunkedArray)) {
        _.forEach(chunkedArray[0], (firsData, index) => {
          resultArray.push(firsData)
          if (!_.isEmpty(chunkedArray[1]) && !_.isEmpty(chunkedArray[1][index])) {
            resultArray.push(chunkedArray[1][index])
          }
        })
      }
    } else {
      resultArray = legend
    }


    // !_.isEmpty(legend) && (legendTemp = legend)
    const legendList = _.map(resultArray, item => {
      return (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 margin-bottom-30" key={item.id}>
          <div className="legend-card-title">{item.name}</div>
          <div className="legend-simple-text">{label} - {item.value}</div>
        </div>
      )
      // return (
      //   <li key={item.id}>
      //     <b>{item.name}</b>
      //     <br />
      //     {label}:<b>{item.value}</b>
      //   </li>
      // )
    })

    // return <ol>{legendList}</ol>
    return legendList
  }

  renderProcuringEntitiesBarChartLegend = () => {
    if (_.isEmpty(this.props.allData)) return <Empty />

    const { intl } = this.context
    const { top10ProcuringEntities } = this.props.allData.chartsDataWraper
    const { top10ProcuringEntitiesAmount } = this.props.allData.chartsDataWraper
    let top10 =
      this.state.procuringEntitiesBarChartSelected === 'count'
        ? top10ProcuringEntities
        : top10ProcuringEntitiesAmount
    let legend = []
    let label =
      this.state.procuringEntitiesBarChartSelected === 'count'
        ? intl.formatMessage({ id: 'common.text.41' })
        : intl.formatMessage({ id: 'common.text.43' })
    _.forEach(top10, (elem, i) => {
      legend.push({
        id: generate(),
        // name: elem.key.length > 55 ? elem.key.slice(0, 55) + '...' : elem.key,
        name: (i + 1) + '. ' + elem.key,
        value:
          this.state.procuringEntitiesBarChartSelected === 'count'
            ? numeral(elem.value).format('0.[00]a')
            : numeral(elem.value).format('0.[00]a') + ` ${intl.formatMessage({ id: 'common.text.currency' })}`,
      })
      return true
    })

    let resultArray = []

    if (window.innerWidth > 575) {
      let chunkedArray = _.chunk(legend, 5)
      if (!_.isEmpty(chunkedArray)) {
        _.forEach(chunkedArray[0], (firsData, index) => {
          resultArray.push(firsData)
          if (!_.isEmpty(chunkedArray[1]) && !_.isEmpty(chunkedArray[1][index])) {
            resultArray.push(chunkedArray[1][index])
          }
        })
      }
    } else {
      resultArray = legend
    }

    const legendList = _.map(resultArray, item => {
      return (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 margin-bottom-30" key={item.id}>
          <div className="legend-card-title">{item.name}</div>
          <div className="legend-simple-text">{label} - {item.value}</div>
        </div>
      )
      // return (
      //   <li key={item.id}>
      //     <b>{item.name}</b>
      //     <br />
      //     {label}:<b>{item.value}</b>
      //   </li>
      // )
    })
    // return <ol>{legendList}</ol>
    return legendList
  }

  renderTopTenCPVChartLegend = () => {
    if (_.isEmpty(this.props.allData)) return <Empty />

    const { intl } = this.context
    const { top10Cpv } = this.props.allData.chartsDataWraper
    const { top10CpvAmount } = this.props.allData.chartsDataWraper
    let top10 = this.state.topTenCPVChartSelected === 'count' ? top10Cpv : top10CpvAmount
    let legend = []
    let label =
      this.state.topTenCPVChartSelected === 'count'
        ? intl.formatMessage({ id: 'common.text.41' })
        : intl.formatMessage({ id: 'common.text.43' })
    // ? intl.formatMessage({ id: 'common.text.35' })
    // : intl.formatMessage({ id: 'common.text.138' })

    let indicatorsSearchOptions = FILTER_ITEM_TRANSLATION_OPTIONS['itemCpv2']

    _.forEach(top10, (elem, i) => {
      let findCpvMappingByCode = _.find(this.props.mappings[indicatorsSearchOptions.mappingKey], { [indicatorsSearchOptions.searchKey]: elem.key })
      findCpvMappingByCode = findCpvMappingByCode ? findCpvMappingByCode[indicatorsSearchOptions[this.props.lang]] : elem.key

      legend.push({
        id: generate(),
        // name: elem.key.length > 55 ? elem.key.slice(0, 55) + '...' : elem.key,
        name: findCpvMappingByCode.length > 55 ? (i + 1) + '. ' + findCpvMappingByCode.slice(0, 55) + '...' : (i + 1) + '. ' + findCpvMappingByCode,
        value:
          this.state.topTenCPVChartSelected === 'count'
            ? numeral(elem.value).format('0.[00]a')
            : numeral(elem.value).format('0.[00]a') + ` ${intl.formatMessage({ id: 'common.text.currency' })}`,
      })
      return true
    })

    let resultArray = []

    if (window.innerWidth > 575) {
      let chunkedArray = _.chunk(legend, 5)
      if (!_.isEmpty(chunkedArray)) {
        _.forEach(chunkedArray[0], (firsData, index) => {
          resultArray.push(firsData)
          if (!_.isEmpty(chunkedArray[1]) && !_.isEmpty(chunkedArray[1][index])) {
            resultArray.push(chunkedArray[1][index])
          }
        })
      }
    } else {
      resultArray = legend
    }

    const legendList = _.map(resultArray, item => {
      return (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 margin-bottom-30" key={item.id}>
          <div className="legend-card-title">{item.name}</div>
          <div className="legend-simple-text">{label} - {item.value}</div>
        </div>
      )
      // return (
      //   <li key={item.id}>
      //     <b>{item.name}</b>
      //     <br />
      //     {label}:<b>{item.value}</b>
      //   </li>
      // )
    })
    // return <ol>{legendList}</ol>
    return legendList
  }

  renderCards = () => {
    const RadioButton = Radio.Button
    const RadioGroup = Radio.Group
    const childs = [
      {
        child: this.renderTenRegionsChart(),
        delay: 300,
        key: 'ten-regions-chart',
        legend: this.renderTenRegionsChartLegend(),
        selectedState: this.state.tenRegionsChartSelected,
        name: 'tenRegionsChartSelected',
      },
      {
        child: this.renderTenRisksChart(),
        delay: 350,
        key: 'ten-risks-chart',
        legend: this.renderTenRisksChartLegend(),
        selectedState: this.state.tenRisksChartSelected,
        name: 'tenRisksChartSelected',
      },
      {
        child: this.renderProcuringEntitiesBarChart(),
        delay: 250,
        key: 'risk-chart',
        legend: this.renderProcuringEntitiesBarChartLegend(),
        selectedState: this.state.procuringEntitiesBarChartSelected,
        name: 'procuringEntitiesBarChartSelected',
      },
      {
        child: this.renderTopTenCPVChart(),
        delay: 400,
        key: 'ten-cpv-chart',
        legend: this.renderTopTenCPVChartLegend(),
        selectedState: this.state.topTenCPVChartSelected,
        name: 'topTenCPVChartSelected',
      },
    ]

    return _.map(childs, elem => {
      return (
        <div className="mt-3 row_chart" key={elem.key}>
          <div className="row justify-content-start row_radiogroup">
            <RadioGroup
              onChange={e => this.handleClickSelectCountOrAmount(elem.name, e)}
              defaultValue={elem.selectedState}
            >
              <RadioButton value={CONST.QANTITY_COST_OPTIONS[0].key}><FormattedMessage
                id='common.text.44' /></RadioButton>
              <RadioButton value={CONST.QANTITY_COST_OPTIONS[1].key}><FormattedMessage
                id='common.text.45' /></RadioButton>
            </RadioGroup>
          </div>
          <div className="row row_chart-wrapper">
            <div className="col-md-6 col_chart">{elem.child}</div>
            <div className="col-md-6 col_legend">
              <div className="row">
                {elem.legend}
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  renderProcuringEntitiesBarChart = () => {
    if (_.isEmpty(this.props.allData)) return <Empty />

    const _self = this
    const { intl } = this.context
    const { top10ProcuringEntities } = this.props.allData.chartsDataWraper
    const { top10ProcuringEntitiesAmount } = this.props.allData.chartsDataWraper
    let top10 =
      this.state.procuringEntitiesBarChartSelected === 'count'
        ? top10ProcuringEntities
        : top10ProcuringEntitiesAmount
    let tempCat = []
    let tempDat = []
    let temp = []
    let label =
      this.state.procuringEntitiesBarChartSelected === 'count'
        ? intl.formatMessage({ id: 'common.text.42' })
        : intl.formatMessage({ id: 'common.text.43' })
    let cost = this.state.procuringEntitiesBarChartSelected === 'count' ? '' : ` ${intl.formatMessage({ id: 'common.text.currency' })}`
    let tempName = _.map(top10, elem => {
      return elem.key
    })

    _.map(top10, (elem, i) => {
      tempCat.push(i)
      tempDat.push({
        name: elem.key,
        y: Math.round(elem.value),
        color: CHART_COLORS_B[i % 2],
        maxPointWidth: 100,
      })
      return true
    })

    temp.push({
      data: tempDat,
    })

    return (
      <ReactHighcharts
        key={generate()}
        config={{
          chart: {
            type: 'column',
            height: 400,
            spacing: [15, 0, 15, 0],
            style: {
              fontFamily: 'Oswald', //'Open Sans'
            },
            backgroundColor: null,
            plotBackgroundColor: null,
          },
          lang: {
            noData: intl.formatMessage({ id: 'common.text.152' }),
          },
          noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#303030',
            },
          },
          title: {
            margin: 50,
            text: intl.formatMessage({ id: 'common.text.47' }),
            align: 'left',
            style: {
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '20px',
              lineHeight: '30px',
              letterSpacing: '0.05em',
              color: '#FFFFFF',
            },
          },
          xAxis: {
            categories: tempCat,
            minPadding: 0,
            maxPadding: 0,
            title: {
              text: intl.formatMessage({ id: 'common.text.48' }),
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.05em',
              },
            },
            tickPositions: [],
            labels: {
              useHTML: true,
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                letterSpacing: '0.05em',
              },
            },
          },
          yAxis: {
            gridLineColor: '#75BADC',
            gridLineWidth: 1,
            title: {
              text: label,
              style: {
                color: '#FFFFFF',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.05em',
              },
            },
            labels: {
              useHTML: true,
              formatter: function () {
                return _self.state.procuringEntitiesBarChartSelected === 'count' ? this.value : numeral(this.value).format('0.[00] a')
                // return this.value
              },
              style: {
                color: '#75BADC',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                letterSpacing: '0.05em',
              },
            },
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              groupPadding: 0.01,
            },
          },
          tooltip: {
            useHTML: true,
            outside: true,
            formatter: function (tooltip) {
              return (
                '<div class="tooltip-chart-wrapper">'
                + '<div class="tooltip-card-title">' + tempName[this.x] + '</div>'
                + '<div class="tooltip-simple-text"><span>' + numeral(this.y).format('0.[00] a') + ' ' + cost + ' - </span><span>' + label + '</span></div>'
                + '</div>'
              )
              // return `Замовник: <b>${tempDat[this.x].name}</b><br>${label}: <b>${numeral(
              //   this.y,
              // ).format('0.[00] a')}${cost}</b>`
            },
          },
          legend: { enabled: false },
          credits: { enabled: false },
          series: temp,
        }}
      />
    )
  }

  renderRiskTable = () => {
    // if (_.isEmpty(this.props.allData && this.props.allData.chartsDataWraper)) return <Empty />
    if (_.isEmpty(this.props.allData)) return <Empty />

    const { intl } = this.context
    const { risksByProceduresTable, risksByProceduresTableAmount } = this.props.allData.chartsDataWraper
    // if (_.isEmpty(risksByProceduresTable)) return <Empty />

    let TEMP_DATA =
      this.state.riskTableSelected === 'count'
        ? _.cloneDeep(risksByProceduresTable)
        : _.cloneDeep(risksByProceduresTableAmount)
    const RadioButton = Radio.Button
    const RadioGroup = Radio.Group
    // let TEMP_DATA = DATA.splice(1, 5)

    let columns = [
      {
        title: intl.formatMessage({ id: 'common.text.75' }),
        dataIndex: 'procedureRisk',
        render: data => {
          return (
            <>
              <b>{data.key}</b>
              <span> - </span>
              <span>{data.value}</span>
            </>
          )
        },
      },
    ]
    _.map(TEMP_DATA, item => {
      columns.push({
        title: _.find(this.props.mappings.translatedValues, { value: `procurement-method-details.${item.key}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]],
        dataIndex: item.key,
        sorter: (a, b) => {
          let aValue = a[item.key] ? (a[item.key] === 'X' ? 0 : a[item.key]) : 0
          let bValue = b[item.key] ? (b[item.key] === 'X' ? 0 : b[item.key]) : 0
          return aValue - bValue
        },
        align: 'center',
        // render: value => (value === -1 ? 'X' : numeral(value).format('0.[00]a')),
        render: value => (value ? numeral(value).format('0.[00]a') : 'X'),
      })
    })

    let result = []
    _.forEach(TEMP_DATA, items => {
      _.forEach(items.value, item => {
        let findIndicatorData = _.find(this.props.mappings.indicators, { id: parseInt(item.key) })
        // let findIncicatorsData = _.find(this.props.mappings.indicators, { id: parseInt(item.key) })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]].

        let existsIndex = _.findIndex(result, { dataIndex: item.key })
        if (existsIndex === -1) {
          result.push({
            // procedureRisk: item.key,
            riskId: findIndicatorData.id,
            procedureRisk: {
              key: findIndicatorData.name,
              value: findIndicatorData[INDICATOR_FIELD_BY_LANGUAGE[this.props.lang]],
            },
            // dataIndex: item.key.key,
            // dataIndex: findIndicatorData.name,
            dataIndex: findIndicatorData.id,
            // [items.key]: item.value === 'X' ? -1 : item.value,
            // [items.key]: item.value === 0 ? 'X' : item.value,
            [items.key]: item.value,
            key: generate(),
            valueSum: item.value,
          })
        } else {
          result[existsIndex] = _.merge({}, result[existsIndex], {
            [items.key]: item.value === 'X' ? -1 : item.value,
            valueSum: result[existsIndex].valueSum + item.value,
          })
        }
      })
    })

    result = _.orderBy(result, ['riskId'], ['asc'])
    // if (!_.isEmpty(this.props.filtersSelected)) {
    //   let temp = []
    //
    //   if (!_.isEmpty(this.props.filtersSelected.riskedIndicators)) {
    //     _.forEach(this.props.filtersSelected.riskedIndicators, risk => {
    //       let findIndicatorData = _.find(this.props.mappings.indicators, { id: risk })
    //       temp.push(_.filter(result, item => item.dataIndex === findIndicatorData.name)[0])
    //     })
    //     result = _.cloneDeep(temp)
    //   }
    // }
    let preparedTableData = _.filter(result, res => res.valueSum)

    return (
      <>
        <div className="col-radiogroup">
          <RadioGroup
            onChange={e => this.handleClickSelectCountOrAmount('riskTableSelected', e)}
            defaultValue={this.state.riskTableSelected}
          >
            <RadioButton value={CONST.QANTITY_COST_OPTIONS[0].key}>
              <FormattedMessage id='common.text.44' />
            </RadioButton>
            <RadioButton value={CONST.QANTITY_COST_OPTIONS[1].key}>
              <FormattedMessage id='common.text.45' />
            </RadioButton>
          </RadioGroup>
        </div>
        <div className="custom-table-wrapper">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="statistic_block_title">{intl.formatMessage({ id: 'common.text.107' })}</div>
          </div>
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            {!_.isEmpty(preparedTableData) ?
              <Table
                columns={columns}
                data={preparedTableData}
                pagination={false}
                // title={() => (<div className="block_title">{intl.formatMessage({ id: 'common.text.107' })}</div>)}
                scroll={{ x: true }}
              /> : <Empty />}
          </div>
        </div>
      </>
    )
  }

  handleUpdateFiltersData = () => {
    this.setState({
      proceduresTablePage: 1,
      tableKey: generate(),
    })
    const { filtersSelected } = this.props
    this.props.updateData({
      startDate: this.state.dateRange.startDate,
      endDate: this.state.dateRange.endDate,
      ...filtersSelected,
    })
  }

  handleFilterData = (filterKey, selectedElem, options, keyUA, translationOptions, props, uaKeys) => {
    Promise.resolve(
      this.props.selectFilterOption({
        key: filterKey,
        keyUA: keyUA,
        selected: selectedElem,
        props: props,
        prevOptions: options,
        selectedUA: uaKeys,
        translationOptions: translationOptions,
      }),
    )
      .then(() => {
        // if (filterKey === 'inQueue' && !selectedElem) {
        //   this.props.selectFilterOption({
        //     key: 'hasPriorityStatus',
        //     keyUA: 'Черга',
        //     prevOptions: [],
        //     props: false,
        //     selected: undefined,
        //     selectedUA: undefined,
        //   })
        // }
      })
      .then(() => this.handleUpdateFiltersData())
  }

  handleSearchFilterData = (filterKey, value) => {
    const { filtersSelected } = this.props

    this.props.updateFilterOptions({
      startDate: this.state.dateRange.startDate,
      endDate: this.state.dateRange.endDate,
      searchField: filterKey,
      searchValue: value,
      ...filtersSelected,
    })
  }

  handleDeselectFilter = (filterKey, selectedElem, options) => {
    Promise.resolve(
      this.props.deselectFilterOption({
        key: filterKey,
        selected: selectedElem,
        prevOptions: options,
      }),
    ).then(() => this.handleUpdateFiltersData())
  }

  handleDropFilterOption = (filterKey, updateStatus) => {
    Promise.resolve(
      this.props.dropFilterOption(filterKey)).then(() => updateStatus && this.handleUpdateFiltersData())
  }

  handleClearFilter = () => {
    this.props.clearFiltersAndUpdate({
      startDate: this.state.dateRange.startDate,
      endDate: this.state.dateRange.endDate,
    })
  }

  handleClosePanel = () => {
    this.setState({
      controlPanel: false,
    }, () => this.props.changeNavigationItem('1'))
  }

  handleDeleteUser = id => {
    this.props.deleteUserById(id)
  }

  renderTableTab = () => {
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-12 mt-3">
            <Card animdelay={300} bodyStyle={{ padding: '0' }}>
              {this.renderProceduresTable()}
            </Card>
          </div>
        </div>
      </Fragment>
    )
  }

  renderChartsTab = () => {
    const RadioButton = Radio.Button
    const RadioGroup = Radio.Group
    return (
      <Fragment>
        <div className="row row_charts">{this.renderCards()}</div>
        <div className="row">
          <div className="col-md-4 mt-3">
            <div className="col-radiogroup">
              <RadioGroup
                onChange={e => this.handleClickSelectCountOrAmount('riskChartSelected', e)}
                defaultValue={this.state.riskChartSelected}
              >
                <RadioButton value={CONST.QANTITY_COST_OPTIONS[0].key}>
                  <FormattedMessage id='common.text.44' />
                </RadioButton>
                <RadioButton value={CONST.QANTITY_COST_OPTIONS[1].key}>
                  <FormattedMessage id='common.text.45' />
                </RadioButton>
              </RadioGroup>
            </div>
            <Card className="custom-card" animdelay={250}>{this.renderRiskChart()}</Card>
          </div>
          <div className="col-md-8 mt-3 risk-table-wrapper">
            <div className="col-radiogroup">
              <RadioGroup
                onChange={e => this.handleClickSelectCountOrAmount('growthChartSelected', e)}
                defaultValue={this.state.growthChartSelected}
              >
                <RadioButton value={CONST.QANTITY_COST_OPTIONS[0].key}>
                  <FormattedMessage id='common.text.44' />
                </RadioButton>
                <RadioButton value={CONST.QANTITY_COST_OPTIONS[1].key}>
                  <FormattedMessage id='common.text.45' />
                </RadioButton>
              </RadioGroup>
            </div>
            <Card className="custom-card" animdelay={300}>{this.renderGrowthChart()}</Card>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mt-3">
            <Card animdelay={300} bodyStyle={{ padding: '0' }} className="risk-table">
              {this.renderRiskTable()}
            </Card>
          </div>
        </div>
      </Fragment>
    )
  }

  toggleNavigationCollapsed = () => {
    this.setState({
      isNavCollapsed: !this.state.isNavCollapsed,
      isNavCollapsedFixed: !this.state.isNavCollapsedFixed,
    })
  }

  renderNavHeader = () => {
    const { credentials } = this.props
    return (
      <Fragment>
        <div className="nav-wrapper">
          {!this.state.isNavCollapsed && (
            <React.Fragment>
              <div className="page_title">
                <span className="text-f"><FormattedMessage id="common.text.84" /></span>
                <span className="text-s"><FormattedMessage id="common.text.85" /></span>
                <span className="text-t"><FormattedMessage id="common.text.86" /></span>
                {/*<h1 className="page_title__text--primary">KYRGYZ REPUBLIC</h1>*/}
                {/*<span className="page_title__text--sub">Open Data OCDS Red Flags Monitoring App</span>*/}
              </div>

              <Divider prefixCls="blue-divider" />
              <LanguagesSelector />
            </React.Fragment>
          )}
          {/*<div className="user-info__wrapper">*/}
          {/*  <div>*/}
          {/*    {!this.state.isNavCollapsed && (*/}
          {/*      <span className="user-info__name mr-1">*/}
          {/*        {credentials.firstName} {credentials.lastName}*/}
          {/*      </span>*/}
          {/*    )}*/}
          {/*  </div>*/}
          {/*  {!this.state.isNavCollapsed && (*/}
          {/*    <span className="user-info__region--wrapper">*/}
          {/*      <Icon type="environment" />*/}
          {/*      <span className="user-info__region--name">{credentials.region}</span>*/}
          {/*    </span>*/}
          {/*  )}*/}
          {/*</div>*/}
          {/*{!this.state.isNavCollapsed && (*/}
          {/*  <div className="user-info__email">{credentials.email}</div>*/}
          {/*)}*/}
        </div>
      </Fragment>
    )
  }

  renderNavHeaderFixed = () => {
    const { credentials } = this.props
    return (
      <Fragment>
        <div className="nav-wrapper">
          {!this.state.isNavCollapsedFixed && (
            <React.Fragment>
              <div className="page_title">
                <span className="text-f"><FormattedMessage id="common.text.84" /></span>
                <span className="text-s"><FormattedMessage id="common.text.85" /></span>
                <span className="text-t"><FormattedMessage id="common.text.86" /></span>
                {/*<h1 className="page_title__text--primary">KYRGYZ REPUBLIC</h1>*/}
                {/*<span className="page_title__text--sub">Open Data OCDS Red Flags Monitoring App</span>*/}
              </div>

              <Divider prefixCls="blue-divider" />
              <LanguagesSelector />
            </React.Fragment>
          )}
          {/*<div className="user-info__wrapper">*/}
          {/*  <div>*/}
          {/*    {!this.state.isNavCollapsed && (*/}
          {/*      <span className="user-info__name mr-1">*/}
          {/*        {credentials.firstName} {credentials.lastName}*/}
          {/*      </span>*/}
          {/*    )}*/}
          {/*  </div>*/}
          {/*  {!this.state.isNavCollapsed && (*/}
          {/*    <span className="user-info__region--wrapper">*/}
          {/*      <Icon type="environment" />*/}
          {/*      <span className="user-info__region--name">{credentials.region}</span>*/}
          {/*    </span>*/}
          {/*  )}*/}
          {/*</div>*/}
          {/*{!this.state.isNavCollapsed && (*/}
          {/*  <div className="user-info__email">{credentials.email}</div>*/}
          {/*)}*/}
        </div>
      </Fragment>
    )
  }

  handleSearshTender = value => {
    const { filtersSelected } = this.props
    this.props.updateData({
      startDate: this.state.dateRange.startDate,
      endDate: this.state.dateRange.endDate,
      procedureId: value,
      ...filtersSelected,
    })
  }

  handleSearshTenderDelay = value => {
    const { filtersSelected } = this.props
    this.props.updateData({
      startDate: this.state.dateRange.startDate,
      endDate: this.state.dateRange.endDate,
      procedureId: value,
      ...filtersSelected,
    })
  }

  handleUserLogOut = () => {
    this.props.userLogout()
  }

  showNoDataErrorMessage = () => {
    const { intl } = this.context
    if (this.props.noDataFound) {
      message.error(intl.formatMessage({ id: 'common.text.133' }))
      this.props.clearNoFilterData()
    }
  }

  render() {
    const { intl } = this.context
    // let sortedBucket = this.props.bucket ? _.sortBy(this.props.bucket, (bucketObject) => {
    //   return new Date(bucketObject.date)
    // }).reverse() : []
    let sortedBucket = []
    let menuButtonLeftPosition = this.state.isNavCollapsedFixed ? 0 : 330

    return (
      <Layout>
        {this.showNoDataErrorMessage()}
        <BarNavigation
          onChangeLocale={this.props.changeLocale}
          appLang={this.props.lang}
          onSignOut={() => this.handleUserLogOut()}
        />
        <div className='navigation-collapsed-button' style={{ left: menuButtonLeftPosition }}
             onClick={this.toggleNavigationCollapsed}>
          <Icon type={this.state.isNavCollapsedFixed ? 'right' : 'left'} style={{ color: '#FFFFFF', fontSize: 16 }} />
          {/*<Icon type={this.state.isNavCollapsedFixed ? "right" : "left"} theme="filled" style={{ color: '#1b28a0', fontSize: 16 }} />*/}
        </div>
        <div
          className={classnames('sider-navigation_wrapper', this.state.isNavCollapsedFixed && 'sider-navigation-hide')}>
          {this.renderNavHeaderFixed()}
          <NavigationFixed
            isCollapsed={this.state.isNavCollapsedFixed}
            user={this.props.credentials}
            onSignOut={this.props.userLogout}
          />
        </div>
        <Layout>
          <Content className="main-content">
            <Spin spinning={this.props.allDataIsFetching || this.props.mappingsIsFetching} size="large">
              <div className="private container-fluid mb-5"
                   style={{ maxWidth: window.innerWidth - (window.innerWidth / 20) }}>
                <div className="row mt-4 mb-5">
                  <div className="col-md-12">
                    <KpisBlock
                      kpiInfo={!!this.props.allData ? this.props.allData.kpiInfo : {}}
                      kpiCharts={!!this.props.allData ? this.props.allData.chartsDataWraper.kpiCharts : {}}
                      lang={this.props.lang}
                      // kpiInfo={!!this.props.allData ? this.props.allData.kpiInfo : {}}
                      // kpiCharts={!!this.props.allData ? this.props.allData.chartsDataWraper.kpiCharts : {}}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <h2 className="block_title"><FormattedMessage id="common.text.17" /></h2>
                  </div>
                </div>
                <div className="row mt-1 mb-md-4">
                  <div className="col-md-12 d-flex justify-content-between wrapper-search-calendar">
                    <Input.Search
                      placeholder={intl.formatMessage({ id: 'common.text.18' })}
                      onSearch={this.handleSearshTender}
                      onChange={e => this.handleSearshTenderDelay(e.target.value)}
                      enterButton
                      allowClear
                      style={{ width: 405 }}
                      className="ant-search-col"
                    />
                    <DateRangePicker
                      onSubmit={this.handleSelectDate}
                      placeholder={[intl.formatMessage({ id: 'common.text.105' }), intl.formatMessage({ id: 'common.text.106' })]}
                      defaultValue={[moment().subtract(31, 'days'), moment()]}
                      className="ant-calendar-col"
                    />
                  </div>
                </div>
                <FilterForm
                  filters={this.props.filters}
                  filtersSelected={this.props.filtersSelected}
                  filtersDisplay={this.props.filtersDisplay}
                  onSearch={this.handleSearchFilterData}
                  onFilterData={this.handleFilterData}
                  onDeselectFilter={this.handleDeselectFilter}
                  onClearFilter={this.handleClearFilter}
                  isFetching={this.props.dataIsFetching}
                  onChangeCheckbox={this.handleFilterData}
                  onDropFilterOption={this.handleDropFilterOption}
                  lang={this.props.lang}
                  mappings={this.props.mappings}
                />
                <div className="row">
                  <div className="col-md-12">
                    {this.renderKPIs()}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Tabs defaultActiveKey="1" className="mt-3">
                      <Tabs.TabPane
                        tab={
                          <span>
                      {/*<Icon type="table" />*/}
                            <FormattedMessage id="common.text.29" />
                    </span>
                        }
                        key="1"
                      >
                        {this.renderTableTab()}
                      </Tabs.TabPane>

                      <Tabs.TabPane
                        tab={
                          <span>
                      {/*<Icon type="bar-chart" />*/}
                            <FormattedMessage id="common.text.30" />
                    </span>
                        }
                        key="2"
                      >
                        {this.renderChartsTab()}
                      </Tabs.TabPane>
                    </Tabs>
                  </div>
                </div>
              </div>
            </Spin>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = ({ monitoring, auth, locale }) => {
  return {
    allData: monitoring.allData,
    allDataIsFetching: monitoring.allDataIsFetching,
    allDataError: monitoring.allDataError,
    error: monitoring.error,
    noDataFound: monitoring.noDataFound,
    lang: locale.lang,

//OLD UKRAINE DATA
    data: monitoring.data,
    filters: monitoring.filters,
    filtersSelected: monitoring.filtersSelected,
    filtersDisplay: monitoring.filtersDisplay,
    typeOfValues: monitoring.typeOfValues,
    dataIsFetching: monitoring.dataIsFetching,
    credentials: auth.user.credentials,
    users: auth.users,
    bucket: monitoring.bucket,
    bucketIsFetching: monitoring.bucketIsFetching,
    regions: monitoring.regions,
    risks: monitoring.risks,
    procedureIds: monitoring.procedureIds,
    indicators: monitoring.indicators,
    importanceCoefficient: monitoring.importanceCoefficient,
    tendersCompletedDays: monitoring.tendersCompletedDays,
    prioritizationPercent: monitoring.prioritizationPercent,
    bucketRiskGroupParameters: monitoring.bucketRiskGroupParameters,
    tenderOuterId: monitoring.tenderOuterId,
    tenderId: monitoring.tenderId,
    indicatorQuestions: monitoring.indicatorQuestions,
    reason: monitoring.reason,
    indicatorsChecklist: monitoring.indicatorsChecklist,
    id: monitoring.id,
    mappings: monitoring.mappings,
    mappingsIsFetching: monitoring.mappingsIsFetching,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    selectFilterOption: bindActionCreators(selectFilterOption, dispatch),
    updateFilterOptions: bindActionCreators(updateFilterOptions, dispatch),
    deselectFilterOption: bindActionCreators(deselectFilterOption, dispatch),
    dropFilterOption: bindActionCreators(dropFilterOption, dispatch),
    getData: bindActionCreators(getData, dispatch),
    updateData: bindActionCreators(updateData, dispatch),
    changeTypeOfValues: bindActionCreators(changeTypeOfValues, dispatch),
    clearFiltersAndUpdate: bindActionCreators(clearFiltersAndUpdate, dispatch),
    userLogout: bindActionCreators(userLogout, dispatch),
    getUsers: bindActionCreators(getUsers, dispatch),
    deleteUserById: bindActionCreators(deleteUserById, dispatch),
    createUser: bindActionCreators(createUser, dispatch),

    getBucketData: bindActionCreators(getBucketData, dispatch),
    deleteBucketItemAndUpdate: bindActionCreators(deleteBucketItemAndUpdate, dispatch),
    setBucketItemAndUpdate: bindActionCreators(setBucketItemAndUpdate, dispatch),

    setRegions: bindActionCreators(setRegions, dispatch),
    exportToEXCEL: bindActionCreators(exportToExcel, dispatch),
    getRisks: bindActionCreators(getRisks, dispatch),

    getAllProcIds: bindActionCreators(getAllProcIds, dispatch),
    clearSelectedProcedureIds: bindActionCreators(clearSelectedProcedureIds, dispatch),

    getParameters: bindActionCreators(getParameters, dispatch),
    postParameters: bindActionCreators(postParameters, dispatch),

    postChecklist: bindActionCreators(postChecklist, dispatch),
    getChecklist: bindActionCreators(getChecklist, dispatch),
    getChecklistCreate: bindActionCreators(getChecklistCreate, dispatch),
    getMappings: bindActionCreators(getMappings, dispatch),
    changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
    clearChecklistData: bindActionCreators(clearChecklistData, dispatch),
    changeLocale: bindActionCreators(changeLocale, dispatch),

    //ToDo delete this aftrer test
    getFakeForbidden: bindActionCreators(getFakeForbidden, dispatch),
    getMonitoringAllFilterData: bindActionCreators(getMonitoringAllFilterData, dispatch),
    setBucketData: bindActionCreators(setBucketData, dispatch),
    clearNoFilterData: bindActionCreators(clearNoFilterData, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Private))
