import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Empty, Icon, Modal, Button, Collapse, Col, Layout, Divider, message } from 'antd'
import _ from 'lodash'
import md5 from 'react-native-md5'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  deleteBucketItemAndUpdate, exportToExcel,
  getBucketData,
  getData,
  getMappings,
  deleteBucketItem,
} from '../../store/monitoring/actions'
import { changeNavigationItem } from '../../store/navigation/actions'
import { userLogout } from '../../store/auth/actions'

import Table from '../../components/table/Table'
import classnames from 'classnames'
import NavigationFixed from '../../components/navigation/NavigationFixed'
import { FormattedMessage } from 'react-intl'
import LanguagesSelector from '../private/components/LanguagesSelector'
import * as numeral from 'numeral'
import { generate } from 'shortid'
import DateRangePicker from '../../components/dateRangePicker/DateRangePicker'
import BarNavigation from '../../components/barNavigation/BarNavigation'
import { changeLocale } from '../../store/locale/LocaleActions'
import { OKGZ_FIELD_BY_LANGUAGE, TRANSLATED_FIELD_BY_LANGUAGE } from '../private/constants'


import '../../index.scss'
// import './Bucket.scss'

const Panel = Collapse.Panel
const { Content } = Layout

class ListComponent extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    isVisible: PropTypes.bool,
    isFetching: PropTypes.bool,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  }

  state = {
    selectedProcedureKeys: [],
    isNavCollapsedFixed: true,
    dateRange: {
      startDate: moment().subtract(31, 'days').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    },
    showConfirmDeleteTender: false,
  }

  componentDidMount() {
    this.props.getMappings().then(() => {
      Promise.resolve(
        this.props.getBucketData(this.state.dateRange),
        // this.props.getData({
        //   startDate: this.state.dateRange.startDate,
        //   endDate: this.state.dateRange.endDate,
        // })
      )
    })

    this.props.changeNavigationItem('2')
  }

  askBeforeDelete = () => {
    this.setState({
      showConfirmDeleteTender: true,
    }, () => {
      this.renderDeleteConfirmModal()
    })
  }

  renderDeleteConfirmModal = () => {
    const { showConfirmDeleteTender } = this.state
    const { intl } = this.context

    return Modal.confirm({
      visible: showConfirmDeleteTender,
      title: '',
      content: intl.formatMessage({ id: 'common.text.145' }),
      keyboard: false,
      maskClosable: false,
      okText: 'Ok',
      cancelText: 'Cancel',
      onOk: () => this.handleDeleteProcedures(),
      onCancel: () => this.handleCloseDeleteConfirm(),
    })
  }

  handleCloseDeleteConfirm = () => {
    this.setState({
      showConfirmDeleteTender: false,
    }, () => {
      Modal.destroyAll()
    })
  }

  handleDeleteProcedures = () => {
    const { selectedProcedureKeys } = this.state
    const { intl } = this.context

    this.props.deleteBucketItem({
      tenderIds: selectedProcedureKeys,
    }).then(() => {
      if (this.props.error) {
        message.error(this.props.error.description)
      } else {
        message.success(intl.formatMessage({ id: 'common.text.146' }))
        this.setState({
          selectedProcedureKeys: [],
        }, () => {
          Promise.resolve(
            this.props.getBucketData(this.state.dateRange),
          )
        })
      }

    })
  }

  prepareBucketTableData = data => {
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
      riskLevel: null,
      indicatorsWithRisk: null,
      tenderDatePublished: null,
      hasComplaints: false,
      linkId: null,
      icon: null,
      monitoringAppeal: null,
      withRisk: null,
    }

    return _.map(data, item => {
      let obj = _.cloneDeep(objStructure)
      obj.key = item.tenderId
      obj.gsw = item.gsw
      // obj.buyerRegion = _.find(this.props.mappings.translatedValues, { value: `region.${item.buyerRegion.replace(' ', '_')}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]]
      obj.buyerRegion = _.find(this.props.mappings.translatedValues, { value: `region.${md5.hex_md5(item.buyerRegion)}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]]
      obj.itemCpv = _.map(item.itemCpv, (itemCpv) => {
        let findCpvMappingByCode = _.find(this.props.mappings.cpvList, { code: itemCpv })
        if (findCpvMappingByCode) {
          // return findCpvMappingByCode[this.props.lang === 'en' ? 'nameEn' : 'name'] ? findCpvMappingByCode[this.props.lang === 'en' ? 'nameEn' : 'name'] : itemCpv
          return findCpvMappingByCode[this.props.lang === 'en' ? 'nameEn' : 'name'] ? `${itemCpv} - ${findCpvMappingByCode[this.props.lang === 'en' ? 'nameEn' : 'name']}` : itemCpv
        } else {
          return itemCpv
        }
      }).join(', ')
      obj.itemCpv2 = _.map(item.itemCpv2, (okgzCode) => {
        let findCpvMappingByCode = _.find(this.props.mappings.okgzList, { code: okgzCode })
        if (findCpvMappingByCode) {
          return findCpvMappingByCode[OKGZ_FIELD_BY_LANGUAGE[this.props.lang]]
        } else {
          return okgzCode
        }
      }).join(', ')
      obj.tenderId = item.tenderId
      obj.tenderStatusDetails = _.find(this.props.mappings.translatedValues, { value: `status-detail.${item.tenderStatusDetails}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]]
      obj.procedureType = item.procedureType
      obj.monitoringStatus = item.monitoringStatus
      obj.buyerName = item.buyerName
      obj.buyerId = item.buyerId
      obj.tenderAmount = parseInt(numeral(item.tenderAmount).format('0')).toLocaleString(this.props.lang === 'en' ? 'en' : 'ru')
      obj.riskLevel = _.find(this.props.mappings.translatedValues, { value: `risk-level.${item.riskLevel}` })[TRANSLATED_FIELD_BY_LANGUAGE[this.props.lang]]
      obj.indicatorsWithRisk = _.map(item.indicatorsWithRisk, (indKey) => (
        _.find(this.props.mappings.indicators, { id: parseInt(indKey) }).name
      )).join(', ')
      obj.tenderDatePublished = item.tenderDatePublished
      obj.hasComplaints = item.hasOwnProperty('hasComplaints') ? item.hasComplaints : false
      obj.linkId = item.tenderOuterId
      obj.inQueue = item.inQueue
      obj.withRisk = item.withRisk
      obj.monitoringAppeal = item.monitoringAppeal
      return obj
    })
  }

  handleExportToExcel = () => {
    const { intl } = this.context
    const { selectedProcedureKeys } = this.state
    const FILE_NAME = `basket_${moment().format('DD-MM-YYYY_HH-mm')}`
    if (selectedProcedureKeys.length < 60000)
      this.props.exportToEXCEL({
        locale: this.props.lang.toUpperCase(),
        tenderIds: selectedProcedureKeys,
      }, FILE_NAME).then(() =>
        this.setState({
          selectedProcedureKeys: [],
        }),
      )
    else message.error(intl.formatMessage({ id: 'common.text.137' }))
  }

  // handleExportToExcel = () => {
  //   const { selectedProcedureKeys } = this.state
  //   const FILE_NAME = `basket_${moment().format('DD-MM-YYYY_HH-mm')}`
  //   Promise.resolve(
  //     this.props.exportToEXCEL({ tenderIds: selectedProcedureKeys }, FILE_NAME),
  //   ).then(() =>
  //     this.setState({
  //       selectedProcedureKeys: [],
  //     }),
  //   )
  // }

  handleSelectProcedures = selectedProcedureKeys => {
    this.setState({
      selectedProcedureKeys: selectedProcedureKeys,
    })
  }

  getRowClassName = (record, i) => {
    const ROW_CLASS = {
      activeMonitoring: 'table-row-monitoring-active',
      monitoringAppeal: 'table-row-monitoring-appeal',
      unsuccess: 'table-row-unsuccess',
      complaints: 'table-row-complaints',
      riskedProcedures: 'table-row-indicators-with-risk',
    }

    if (record.withRisk) return ROW_CLASS.riskedProcedures

    if (record.monitoringAppeal) return ROW_CLASS.monitoringAppeal

    return ''
  }

  handleSelectAll = (selected) => {
    if (!_.isEmpty(selected)) {
      this.setState({
        selectedProcedureKeys: [],
      })
    } else {
      let result = []
      _.forEach(this.props.bucket.buckets, item => {
        result.push(_.map(item.tenders, 'tenderId'))
      })
      this.setState({
        selectedProcedureKeys: _.concat(...result),
      })
    }
  }

  renderBuckets = data => {
    if (_.isEmpty(data)) return <Empty />

    data = _.orderBy(data, ['date'], ['asc'])
    const { intl } = this.context
    const { selectedProcedureKeys } = this.state
    const rowSelection = {
      selectedRowKeys: selectedProcedureKeys,
      onChange: this.handleSelectProcedures,
    }

    // const colWidth = 150
    const objStructure = [
      {
        title: '',
        dataIndex: 'icon',
        width: 0,
      },
      { title: intl.formatMessage({ id: 'common.text.59' }), dataIndex: 'tenderId', width: 100 },
      { title: intl.formatMessage({ id: 'common.text.60' }), dataIndex: 'tenderAmount', width: 100 },
      { title: intl.formatMessage({ id: 'common.text.61' }), dataIndex: 'buyerName', width: 200 },
      { title: intl.formatMessage({ id: 'common.text.68' }), dataIndex: 'buyerId', width: 120 },
      { title: intl.formatMessage({ id: 'common.text.62' }), dataIndex: 'itemCpv', width: 150 },
      // { title: intl.formatMessage({ id: 'common.text.63' }), dataIndex: 'itemCpv2', width: 100 },
      // { title: intl.formatMessage({ id: 'common.text.64' }), dataIndex: 'procedureType', width: 100 },
      { title: intl.formatMessage({ id: 'common.text.64' }), dataIndex: 'tenderStatusDetails', width: 100 },
      { title: intl.formatMessage({ id: 'common.text.65' }), dataIndex: 'buyerRegion', width: 150 },
      {
        title: intl.formatMessage({ id: 'common.text.66' }),
        dataIndex: 'tenderDatePublished',
        width: 100,
        // defaultSortOrder: 'descend',
        // sorter: (a, b) => new Date(a.datePublished) - new Date(b.datePublished),
        // sortDirections: ['descend'],
      },
      {
        title: intl.formatMessage({ id: 'common.text.67' }),
        dataIndex: 'riskLevel',
        // render: risks =>
        //   _.map(risks, (risk, i) => {
        //     if (i + 1 === risks.length) return <span key={risk}>{risk}</span>
        //     return <span key={risk}>{risk}, </span>
        //   }),
        width: 100,
      },
      {
        title: intl.formatMessage({ id: 'common.text.67.1' }),
        dataIndex: 'indicatorsWithRisk',
        width: 100,
        sorter: true,
      },
      // { title: intl.formatMessage({ id: 'common.text.68' }), dataIndex: 'monitoringStatus', width: 100 },

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
    return _.map(data, (item, i) => {
      return (
        <Panel header={item.date} key={`bucket_${item.key}_${i}`}>
          <Table
            key="tenderId"
            rowClassName={this.getRowClassName}
            className="bucket-table"
            filtered={true}
            rowSelection={rowSelection}
            columns={objStructure}
            pagination={false}
            data={this.prepareBucketTableData(item.tenders)}
            scroll={{ x: 3000 }}
            isFetching={this.props.isFetching}
          />
        </Panel>
      )
    })
  }

  renderNavHeaderFixed = () => {
    // const { credentials } = this.props
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

  toggleNavigationCollapsed = () => {
    this.setState({
      isNavCollapsed: !this.state.isNavCollapsed,
      isNavCollapsedFixed: !this.state.isNavCollapsedFixed,
    })
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
          <div className="monitoring">{this.renderSqeare('#AAD6E9')} <FormattedMessage id="common.text.102" /></div>
          <div className="have">{this.renderSqeare('#DAE6E7')} <FormattedMessage id="common.text.103" /></div>
        </div>
      </Fragment>
    )
  }

  renderKPIs = () => {
    if (_.isEmpty(this.props.bucket)) return <Empty />

    const { intl } = this.context
    const {
      buyerCount,
      indicatorCount,
      procedureAmount,
      procedureCount,
      riskBuyerCount,
      riskIndicatorCount,
      riskProcedureAmount,
      riskProcedureCount,
    } = this.props.bucket

    const infoCard = [
      {
        key: intl.formatMessage({ id: 'common.text.25' }),
        values: [
          {
            key: 'quantity',
            // value: numeral(procedureCount).format('0,0'),
            value: procedureCount ? procedureCount.toLocaleString('ru') : 0,
          },
          {
            key: 'amount',
            value:
              numeral(procedureAmount)
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
            // value: numeral(riskProcedureCount).format('0,0'),
            value: riskProcedureCount ? riskProcedureCount.toLocaleString('ru') : 0,
          },
          {
            key: 'amount',
            value:
              numeral(riskProcedureAmount)
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
            // value: numeral(buyerCount).format('0,0'),
            value: buyerCount ? buyerCount.toLocaleString('ru') : 0,
          },
          {
            key: 'amount',
            value: `${numeral(riskBuyerCount).format('0,0')} ` + intl.formatMessage({ id: 'common.text.32.1' }),
          },
        ],
      },
      {
        key: intl.formatMessage({ id: 'common.text.28' }),
        values: [
          {
            key: 'quantity',
            // value: numeral(indicatorCount).format('0,0'),
            value: indicatorCount ? indicatorCount.toLocaleString('ru') : 0,
          },
          {
            key: 'amount',
            value: `${numeral(riskIndicatorCount).format('0,0')} ` + intl.formatMessage({ id: 'common.text.131' }),
          },
        ],
      },
    ]
    const card = _.map(infoCard, (record, index) => {
      return (
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-3" key={`bucket_kpi_info_${index}`}>
          <div className="card" key={generate()}>
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

  handleSelectDate = e => {
    const { filtersSelected } = this.props
    let startDate = !_.isEmpty(e) ? moment(e[0]).format('YYYY-MM-DD') : moment().subtract(31, 'days').format('YYYY-MM-DD')
    let endDate = !_.isEmpty(e) ? moment(e[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
    let newDateRange = {
      startDate: startDate,
      endDate: endDate,
    }

    Promise.resolve(
      this.setState({
        dateRange: newDateRange,
      }),
    ).then(() =>
        this.props.getBucketData(newDateRange),
      // this.props.updateData({
      //   startDate: this.state.dateRange.startDate,
      //   endDate: this.state.dateRange.endDate,
      //   ...filtersSelected,
      // }),
    )
  }

  handleUserLogOut = () => {
    this.props.userLogout()
  }

  render() {
    const hasSelected = this.state.selectedProcedureKeys.length > 0
    let menuButtonLeftPosition = this.state.isNavCollapsedFixed ? 0 : 330
    const { intl } = this.context

    return (
      <Layout>
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
          <Content className="main-content container-fluid mb-5"
                   style={{ maxWidth: window.innerWidth - (window.innerWidth / 20) }}>
            <div className="row mt-4 mb-5">
              <div className="col-md-12">
                <div className="d-flex bucket_header ">
                  <div className="block_title"><FormattedMessage id='common.text.101' /></div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="row mt-3 mb-2">
                  <div className="d-flex procedure-table-header justify-content-between col-md-12">
                    <div>
                      <Button
                        ghost={this.props.procedureIds && !!this.props.procedureIds.tenderIds ? false : true}
                        htmlType="button"
                        type={
                          this.props.procedureIds && !!this.props.procedureIds.tenderIds
                            ? 'default'
                            : 'primary'
                        }
                        // onClick={this.handleSelectAllProcedures}
                        onClick={() => this.handleSelectAll(this.state.selectedProcedureKeys)}
                        style={{ marginRight: 15 }}
                      >
                        <Icon
                          type={
                            // this.props.procedureIds && !!this.props.procedureIds.tenderIds
                            !_.isEmpty(this.state.selectedProcedureKeys)
                              ? 'close'
                              : 'check-square'
                          }
                          style={{ color: '#63D4B1', fontSize: 16 }}
                        />
                        {/*{this.props.procedureIds && !!this.props.procedureIds.tenderIds*/}
                        {!_.isEmpty(this.state.selectedProcedureKeys)
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
                      <DateRangePicker
                        onSubmit={this.handleSelectDate}
                        placeholder={[intl.formatMessage({ id: 'common.text.105' }), intl.formatMessage({ id: 'common.text.106' })]}
                        defaultValue={[moment().subtract(31, 'days'), moment()]}
                        className="ant-calendar-col"
                      />
                    </div>
                    <div>
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
                          // onClick={this.handleDeleteButton}
                          onClick={this.askBeforeDelete}
                        >
                          <Icon type="delete" style={{ color: '#FFFFFF', fontSize: 16 }} />
                          <FormattedMessage id='common.text.104' />
                        </Button>
                      </Button.Group>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                {this.props.bucket.hasOwnProperty('buckets') &&
                <Collapse accordion>{this.renderBuckets(this.props.bucket.buckets)}</Collapse>}
              </div>
              <Col span={24}>
                <div className="d-flex table-footer-block">
                  {this.renderTableLegend()}
                </div>
              </Col>

              <div className="col-md-12">
                {this.renderKPIs()}
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = ({ monitoring, locale }) => {
  return {
    data: monitoring.data,
    error: monitoring.error,
    bucket: monitoring.bucket,
    mappings: monitoring.mappings,
    lang: locale.lang,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getBucketData: bindActionCreators(getBucketData, dispatch),
    deleteBucketItemAndUpdate: bindActionCreators(deleteBucketItemAndUpdate, dispatch),
    getData: bindActionCreators(getData, dispatch),
    changeNavigationItem: bindActionCreators(changeNavigationItem, dispatch),
    userLogout: bindActionCreators(userLogout, dispatch),
    changeLocale: bindActionCreators(changeLocale, dispatch),
    getMappings: bindActionCreators(getMappings, dispatch),
    deleteBucketItem: bindActionCreators(deleteBucketItem, dispatch),
    exportToEXCEL: bindActionCreators(exportToExcel, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ListComponent))
