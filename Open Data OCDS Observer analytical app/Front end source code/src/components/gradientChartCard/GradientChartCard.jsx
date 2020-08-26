import React from 'react'
import PropTypes from 'prop-types'
import { generate } from 'shortid'
import _ from 'lodash'
import ReactHighcharts from 'react-highcharts'
import addNoDataModule from 'highcharts/modules/no-data-to-display'

import Card from '../card/Card'
import Divider from '../divider/Divider'

import { KPI_CHART_CONFIG } from './constants'

import './GradientChartCard.scss'
import * as numeral from 'numeral'
import { FormattedMessage } from 'react-intl'


class GradientChartCard extends React.Component {

  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]).isRequired,
    config: PropTypes.object.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    lang: PropTypes.string,
    activeDays: PropTypes.array,
    intl: PropTypes.any,
  }

  constructor(props) {
    if (ReactHighcharts.Highcharts) {
      addNoDataModule(ReactHighcharts.Highcharts)
    }

    super(props)
    const chartIdString = `mini-chart_${generate()}`
    this.state = {
      chartId: chartIdString,
      config: this.getChartConfig(chartIdString),
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (!_.isEqual(nextProps.data, this.props.data)) return true
    return false
  }

  getChartConfig = chartId => {
    const { intl, data, config, lang, activeDays } = this.props

    let sortedActiveDays = _.orderBy(activeDays, [], ['asc'])
    let valueExist = false

    let CHART_CONFIG = _.cloneDeep(KPI_CHART_CONFIG)
    CHART_CONFIG.id = chartId
    CHART_CONFIG.config.lang.noData = intl.formatMessage({ id: CHART_CONFIG.config.lang.noData })
    CHART_CONFIG.config.xAxis.categories = data.map(item => {
      return item.date
    })
    // CHART_CONFIG.config.series[0].data = data.map((item) => {
    //   // return [item.date, item.avg.perSupplier || item.avg.perProcedure]
    //   return [item.date, item.value]
    // })
    CHART_CONFIG.config.series[0].data = sortedActiveDays.map((dayName) => {
      let valueByDate = _.find(data, {date: dayName})
      let value = valueByDate ? valueByDate.value : 0
      if (value !== 0) {
        valueExist = true
      }
      // return [item.date, item.avg.perSupplier || item.avg.perProcedure]
      return valueByDate ? [valueByDate.date, valueByDate.value] : [dayName, 0]
    })
    if (this.props.config.localeId === 'common.home.kpiChart.averageCost.label') {
      CHART_CONFIG.config.series[0].tooltip.pointFormat = '<span style="color:{point.color}">●</span> <b>{point.y:,.2f} ' + intl.formatMessage({ id: 'common.mln.text' }) + '. ' + config.unit + '</b><br/>'
    } else {
      CHART_CONFIG.config.series[0].tooltip.pointFormat = '<span style="color:{point.color}">●</span> <b>{point.y:,.2f} ' + ' ' + config.unit + '</b><br/>'
    }

    let tooltipPostfix = config.format === 'quantity' ? intl.formatMessage({ id: 'common.psc.text' }) : intl.formatMessage({ id: 'common.byn.text' })

    CHART_CONFIG.config.tooltip = {
      useHTML: true,
      formatter: function () {
        let value =  config.format === 'currency' ? this.y.toLocaleString(lang === 'en' ? 'en' : 'ru') : Math.round(this.y)
        return '<div><span style="font-size: 14px">' + this.key + '</span><br/>'
          + '<b><span style="font-size: 14px">' + value + ' ' + tooltipPostfix + '</span></b></div>'
      },
    }

    return CHART_CONFIG
  }

  addExtraTextTo = (translateKey, amount) => {
    const { intl } = this.props
    let translateText = intl.formatMessage({id: translateKey})
    let abr = numeral(this.props.amount).format('a').replace(/\d+/, '')
    translateText = translateText.replace('(KGS)', `(${abr} KGS)`)
    return translateText

  }

  render() {
    const domKey = `card-chart-${generate()}`
    return <div
      className="col-md-12 col-xl-4 home-cards"
      key={domKey}
      id={domKey}
    >
      <Card
        className="card-chart-wrapper-home"
        cardClass="shadow-border"
        cardFluid
      >
        <div className="content-wrapper-home">
          {/*<span className={`value-info-home ${this.props.config.colorPreset}`}>*/}
          {/*  {*/}
          {/*    this.props.config.localeId === 'common.home.kpiChart.averageNumberLots.label'*/}
          {/*    || this.props.config.localeId === 'common.home.kpiChart.averageDifferent.label'*/}
          {/*      // ? Math.round(this.props.data.avg.perSupplier || this.props.data.avg.perProcedure)*/}
          {/*      // : numeral(this.props.data.avg.perSupplier || this.props.data.avg.perProcedure).format('0.00')*/}
          {/*      ? Math.round(this.props.data.avg.perSupplier || this.props.data.avg.perProcedure)*/}
          {/*      : numeral(this.props.data.avg.perSupplier || this.props.data.avg.perProcedure).format('0.00')*/}
          {/*  }*/}
          {/*</span>*/}
          <span className={`value-info-home ${this.props.config.colorPreset}`}>
            {/*{numeral(this.props.amount).format('0.00')}*/}
            {this.props.config.format === 'currency' ? numeral(this.props.amount).format('0.0 a').split(' ')[0] : this.props.amount}
            {/*{this.props.amount}*/}
          </span>
          <Divider borderBottom={0} borderLeft={'1px solid #E9EDF2'} marginLeft={15} width={1} />
          <p style={{ marginLeft: '15px' }} className="chart-info-home">
            {this.props.config.localeId === 'page.common.text.7' ? this.addExtraTextTo('page.common.text.7', this.props.amount): <FormattedMessage id={this.props.config.localeId} />}
          </p>
        </div>
        <div className="graph-wrapper-home">
          <ReactHighcharts
            key={generate()}
            config={this.state.config.config}
            id={this.state.chartId}
            ref={this.state.chartId}
          />
        </div>

      </Card>
    </div>
  }
}

export default GradientChartCard
