import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
// import { generate } from 'shortid'
import { Empty } from 'antd'
import * as classnames from 'classnames'
import ReactHighcharts from 'react-highcharts'
import * as numeral from 'numeral'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import { BAR_CHART_COLORS, LINE_CHART_COLORS } from './KpisBlockConstants'

import './KpisBlock.scss'

class KpisBlock extends PureComponent {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  state = {
    rotateCard1: false,
    rotateCard2: false,
    rotateCard3: false,
    rotateCard4: false,
  }

  renderProceduresCountBarChart = () => {
    if (_.isEmpty(this.props.kpiCharts)) return <Empty />

    const { intl } = this.context
    const { checkedProceduresCount } = this.props.kpiCharts
    const { dates } = this.props.kpiCharts
    let data = []
    let temp = []
    _.map(checkedProceduresCount, (elem, i) => {
      data.push({
        y: elem,
        maxPointWidth: 10,
        color: BAR_CHART_COLORS[i],
      })
      return true
    })

    temp.push({
      data: data,
    })

    return (
      <ReactHighcharts
        // key={generate()}
        key={'chart_1_1'}
        config={{
          chart: {
            type: 'column',
            height: 155,
            // width: 200,
            marginTop: 0,
            animation: false,
          },
          xAxis: {
            lineColor: '#74BADC',
            lineWidth: 1,
            categories: dates,
            tickPositions: [],
          },
          yAxis: {
            endOnTick: false,
            title: {
              text: null,
            },
            visible: false,
          },
          plotOptions: {
            series: {
              groupPadding: 0.01,
              pointPadding: 0.15,
              fillOpacity: 1,
              animation: false,
            },
          },
          tooltip: {
            outside: true,
            formatter: function () {
              return (
                intl.formatMessage({ id: 'common.text.chart.date' }) + ': <b>' +
                moment(this.x).format('MMMM YYYY') +
                '</b><br>' + intl.formatMessage({ id: 'common.text.12' }) +
                ': <b>' +
                numeral(this.y).format('0,0') +
                '</b>'
              )
            },
          },
          title: {
            text: null,
          },
          legend: { enabled: false },
          credits: { enabled: false },
          series: temp,
        }}
      />
    )
  }

  renderRiskedProceduresCountChart = () => {
    if (_.isEmpty(this.props.kpiCharts)) return <Empty />

    const { intl } = this.context
    const { checkedProceduresCount } = this.props.kpiCharts
    const { riskedProceduresCount } = this.props.kpiCharts
    const { dates } = this.props.kpiCharts

    return (
      <ReactHighcharts
        // key={generate()}
        key={'chart_1_2'}
        config={{
          chart: {
            height: 155,
            animation: false,
          },
          title: {
            text: null,
          },
          xAxis: {
            lineColor: '#74BADC',
            title: {
              text: null,
            },
            categories: dates,
            tickPositions: [],
          },
          yAxis: {
            endOnTick: false,
            lineWidth: 1,
            title: {
              text: null,
            },
            visible: false,
          },
          plotOptions: {
            series: {
              animation: false,
            },
          },
          tooltip: {
            outside: true,
            formatter: function () {
              return (
                intl.formatMessage({ id: 'common.text.chart.date' }) + ': <b>' +
                moment(this.x).format('MMMM YYYY') +
                '</b><br>' + this.series.name +
                ': <b>' +
                numeral(this.y).format('0,0') +
                '</b>'
              )
            },
          },
          credits: { enabled: false },
          legend: { enabled: false },
          series: [
            {
              // name: <FormattedMessage id={'common.text.9'} />,
              name: intl.formatMessage({ id: 'common.text.9' }),
              data: checkedProceduresCount,
              color: LINE_CHART_COLORS[0],
            },
            {
              // name: <FormattedMessage id={'common.text.10'} />,
              name: intl.formatMessage({ id: 'common.text.10' }),
              data: riskedProceduresCount,
              color: LINE_CHART_COLORS[1],
            },
          ],
        }}
      />
    )
  }

  renderPartsRiskedProceduresChart = () => {
    if (_.isEmpty(this.props.kpiCharts)) return <Empty />

    const { intl } = this.context
    const { partsRiskedProceduresCount } = this.props.kpiCharts
    const { dates } = this.props.kpiCharts

    return (
      <ReactHighcharts
        // key={generate()}
        key={'chart_1_3'}
        config={{
          chart: {
            type: 'area',
            height: 155,
            animation: false,
            // width: 200,
          },
          title: {
            text: null,
          },
          xAxis: {
            lineColor: '#74BADC',
            lineWidth: 1,
            title: {
              text: null,
            },
            categories: dates,
            tickPositions: [],
            // visible: false,
          },
          yAxis: {
            endOnTick: false,
            lineWidth: 1,
            title: {
              text: null,
            },
            visible: false,
          },
          tooltip: {
            outside: true,
            formatter: function () {
              return (
                intl.formatMessage({ id: 'common.text.chart.date' }) + ': <b>' +
                moment(this.x).format('MMMM YYYY') +
                '</b><br>' + intl.formatMessage({ id: 'common.text.38' }) +
                ': <b>' +
                numeral(this.y).format('0.[0]') +
                '%</b>'
              )
            },
          },
          plotOptions: {
            series: {
              animation: false,
              // pointPlacement: 'on',
              // marker: {
              //   radius: 0,
              //   states: {
              //     hover: {
              //       radius: 8,
              //       lineWidth: 5,
              //       lineWidthPlus: 10,
              //     },
              //   },
              // },
              fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, '#599EC0'],
                  [1, '#D2F1E6'],
                ],
              },
            },
          },
          credits: { enabled: false },
          legend: { enabled: false },
          series: [
            {
              data: partsRiskedProceduresCount,
              color: '#599EC0',
            },
          ],
        }}
      />
    )
  }

  renderAddressedProceduresAmountChart = () => {
    if (_.isEmpty(this.props.kpiCharts)) return <Empty />

    const { intl } = this.context
    const _self = this
    // const { addressedProceduresAmount } = this.props.kpiCharts
    const { allProceduresCount } = this.props.kpiCharts
    const { dates } = this.props.kpiCharts
    let data = []
    let temp = []
    _.map(allProceduresCount, (elem, i) => {
      data.push({
        y: elem,
        maxPointWidth: 10,
        color: BAR_CHART_COLORS[i],
      })
      return true
    })

    temp.push({
      data: data,
    })

    return (
      <ReactHighcharts
        // key={generate()}
        key={'chart_1_4'}
        config={{
          chart: {
            type: 'column',
            height: 155,
            animation: false,
            // width: 200,
          },
          xAxis: {
            lineColor: '#74BADC',
            lineWidth: 1,
            categories: dates,
            tickPositions: [],
          },
          yAxis: {
            endOnTick: false,
            title: {
              text: null,
            },
            visible: false,
          },
          plotOptions: {
            series: {
              groupPadding: 0.01,
              animation: false,
            },
          },
          title: {
            text: null,
          },
          tooltip: {
            outside: true,
            formatter: function () {
              return (
                intl.formatMessage({ id: 'common.text.chart.date' }) + ': <b>' +
                moment(this.x).format('MMMM YYYY') +
                // '</b><br>' + intl.formatMessage({ id: 'common.text.139' }) +
                '</b><br>' + intl.formatMessage({ id: 'common.text.42' }) +
                ': <b>' +
                // numeral(this.y).format('0.0[0] a') + ' ' + intl.formatMessage({ id: 'common.text.currency' }) +
                this.y.toLocaleString(_self.props.lang === 'en' ? 'en' : 'ru') + '</b>'
              )
            },
          },
          legend: { enabled: false },
          credits: { enabled: false },
          series: temp,
        }}
      />
    )
  }

  prepareData = data => {
    const { intl } = this.context
    return [
      {
        key: <FormattedMessage id={'common.text.5'} />,
        values: [
          {
            key: intl.formatMessage({ id: 'common.text.44' }),
            state: this.state.rotateCard1,
            nameState: 'rotateCard1',
            // param1: numeral(data.checkedProceduresCount).format('0,0'),
            param1: data.hasOwnProperty('checkedProceduresCount') ? data.checkedProceduresCount.toLocaleString('ru') : 0,
            chart: this.renderProceduresCountBarChart(),
            param2:
              numeral(data.checkedProceduresValue)
                .format('0.0[0] a')
                .replace(/\d+,?\d+/, '$& ') + ' ' + intl.formatMessage({ id: 'common.text.currency' }),
            infoData: {
              'description': 'common.text.125',
              'period': 'common.text.124.3',
              'source': 'common.text.124.5',
            },
          },
        ],
      },
      {
        key: <FormattedMessage id={'common.text.6'} />,
        values: [
          {
            key: intl.formatMessage({ id: 'common.text.44' }),
            state: this.state.rotateCard2,
            nameState: 'rotateCard2',
            // param1: numeral(data.checkedRiskProceduresCount).format('0,0'),
            param1: data.hasOwnProperty('checkedRiskProceduresCount') ? data.checkedRiskProceduresCount.toLocaleString('ru') : 0,
            chart: this.renderRiskedProceduresCountChart(),
            param2:
              numeral(data.checkedRiskProceduresValue)
                .format('0.0[0] a')
                .replace(/\d+,?\d+/, '$& ') + ' ' + intl.formatMessage({ id: 'common.text.currency' }),
            infoData: {
              'description': 'common.text.126',
              'period': 'common.text.124.3',
              'source': 'common.text.124.5',
            },
          },
        ],
      },
      {
        key: <FormattedMessage id={'common.text.7'} />,
        values: [
          {
            key: intl.formatMessage({ id: 'common.text.44' }),
            state: this.state.rotateCard3,
            nameState: 'rotateCard3',
            param1: numeral(data.riskProcedureAmountPercent).format('0.0') + ' %',
            chart: this.renderPartsRiskedProceduresChart(),
            param2:
              numeral(data.riskProcedureCountPercent).format('0.00') + ' ' +
              intl.formatMessage({ id: 'common.text.11' }),
            infoData: {
              'description': 'common.text.127',
              'period': 'common.text.124.3',
              'source': 'common.text.124.5',
            },
          },
        ],
      },
      {
        key: <FormattedMessage id={'common.text.8'} />,
        values: [
          {
            key: intl.formatMessage({ id: 'common.text.44' }),
            state: this.state.rotateCard4,
            nameState: 'rotateCard4',
            // param1: numeral(data.allProcedureCount).format('0,0'),
            param1: data.hasOwnProperty('allProcedureCount') ? data.allProcedureCount.toLocaleString('ru') : 0,
            chart: this.renderAddressedProceduresAmountChart(),
            param2:
              numeral(data.allProcedureValue)
                .format('0.0[0] a')
                .replace(/\d+,?\d+/, '$& ') + ' ' + intl.formatMessage({ id: 'common.text.currency' }),
            infoData: {
              'description': 'common.text.128',
              'period': 'common.text.124.3',
              'source': 'common.text.124.5',
            },
          },
        ],
      },
    ]
  }

  handleClickRotateCard = nameState => {
    this.setState(state => ({
      [nameState]: !state[nameState],
    }))
  }

  prepareDataRow = data => {
    const { intl } = this.context

    return [
      {
        title: intl.formatMessage({ id: 'common.text.13' }),
        // value: numeral(data.indicatorsCount).format('0,0'),
        value: data.hasOwnProperty('indicatorsCount') ? data.indicatorsCount.toLocaleString('ru') : 0,
      },
      {
        title: intl.formatMessage({ id: 'common.text.14' }),
        // value: numeral(data.riskIndicatorsCount).format('0,0'),
        value: data.hasOwnProperty('riskIndicatorsCount') ? data.riskIndicatorsCount.toLocaleString('ru') : 0
      },
      {
        title: intl.formatMessage({ id: 'common.text.15' }),
        // value: numeral(data.allBuyerCount).format('0,0'),
        value: data.hasOwnProperty('allBuyerCount') ? data.allBuyerCount.toLocaleString('ru') : 0
      },
      {
        title: intl.formatMessage({ id: 'common.text.16' }),
        // value: numeral(data.checkedRiskBuyersCount).format('0,0'),
        value: data.hasOwnProperty('checkedRiskBuyersCount') ? data.checkedRiskBuyersCount.toLocaleString('ru') : 0
      },
    ]
  }

  renderSwitchCardInfoContent = (infoData) => {
    const { intl } = this.context

    return (
      <div className="switch-card-info-wrapper">
        <div className="switch-card-info-row">
          <span className="switch-card-info-bold-text">{intl.formatMessage({ id: 'common.text.124.1' })}: </span>
          <span className="switch-card-info-simple-text">{intl.formatMessage({ id: infoData.description })}</span>
        </div>
        <div className="switch-card-info-row">
          <span className="switch-card-info-bold-text">{intl.formatMessage({ id: 'common.text.124.2' })}: </span>
          <span className="switch-card-info-simple-text">{intl.formatMessage({ id: infoData.period })}</span>
        </div>
        <div className="switch-card-info-row">
          <span className="switch-card-info-bold-text">{intl.formatMessage({ id: 'common.text.124.4' })}: </span>
          <span className="switch-card-info-simple-text">{intl.formatMessage({ id: infoData.source })}</span>
        </div>
      </div>
    )
  }

  renderKPIrecord = (record, ind) => {
    return !!record.values &&
      record.values.map((elem) => {
        return (
          <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 margin-top-15" key={`${elem.nameState}_${ind}`}>
            <div
              className={classnames('card', {
                active: this.state[elem.nameState],
              })}
              // key={`${elem.param1}_${ind}`}
              // key={`${elem.nameState}_${ind}`}
            >
              <div className="card_face card_face--front">
                <div className="card_wrap--header">
                  <div className="card_wrap--content">
                    <div className="card_block">
                      <div className="card-value">{elem.param1}</div>
                    </div>
                    <h4 className="card_title">{record.key}</h4>
                    {elem.img ? elem.img : null}
                    <div className="card_chart">{elem.chart}</div>
                    <div className="card_block">
                      <div className="card-bottom-value">{elem.param2}</div>
                    </div>
                  </div>
                  <div className="switch-rectangle-icon-info"
                       onClick={() => this.handleClickRotateCard(elem.nameState)}>
                    <div className="info-icon"><span>i</span></div>
                  </div>
                  {/*<button*/}
                  {/*  className="card_btn"*/}
                  {/*  onClick={() => this.handleClickRotateCard(elem.nameState)}*/}
                  {/*>*/}
                  {/*  /!*<Icon type="info-circle" />*!/*/}
                  {/*  */}
                  {/*</button>*/}
                </div>

              </div>

              <div className="card_face card_face--back">
                <div className="card_wrap--header">
                  <h4 className="card_title">{record.key}</h4>
                  <div className="switch-rectangle-icon-close"
                       onClick={() => this.handleClickRotateCard(elem.nameState)}>
                    <div className="info-icon"><span>X</span></div>
                  </div>
                </div>
                <div className="card_wrap--content">
                  {this.renderSwitchCardInfoContent(elem.infoData)}
                </div>
              </div>
            </div>
          </div>
        )
      })
  }

  renderRecords = data => {
    return _.map(this.prepareData(data), (record, ind) => {
      return this.renderKPIrecord(record, ind)
    })
  }

  renderRecordsRow = data => {
    return _.map(this.prepareDataRow(data), (record, index) => {
      return (
        // <div className="kpis-block_card" key={generate()}>
        <div className="kpis-block_card" key={`kpi_${index}`}>
          <div className="kpis-block_card_value">{record.value}</div>
          <div className="kpis-block_card_title">{record.title}</div>
        </div>
      )
    })
  }

  render() {
    const { kpiInfo } = this.props
    if (!kpiInfo) return <div />

    return (
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 kpis-block">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h2 className="kpis-block_title"><FormattedMessage id="common.text.4" /></h2>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-8 col-xl-8">
              <div className="row">
                {this.renderRecords(kpiInfo)}
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4  margin-top-15">
              <div className="kpis-block_wrapper">
                {this.renderRecordsRow(kpiInfo)}
              </div>
            </div>
          </div>
          {/*<div className="kpis-block_row">{this.renderRecords(kpiInfo)}</div>*/}
          {/*<div className="kpis-block_row kpis-block_row--white">{this.renderRecordsRow(kpiInfo)}</div>*/}
        </div>
      </div>
    )
  }
}

KpisBlock.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

export default KpisBlock
