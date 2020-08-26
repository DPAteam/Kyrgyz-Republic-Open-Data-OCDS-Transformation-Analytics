import React from 'react'

import ReactHighcharts from 'react-highcharts'
import Parallel from 'highcharts/modules/parallel-coordinates'
import Highcharts from 'highcharts'
import addNoDataModule from 'highcharts/modules/no-data-to-display'
import { connect } from 'react-redux'
import { generate } from 'shortid'
import _ from 'lodash'
import { bindActionCreators } from 'redux'

import { getContractsCommonInfo } from '../../store/dashboard/DashboardActions'

import './PageChart.scss'
import SlideArrow from '../slideArrow/SlideArrow'
import ViewChartByDate from './components/ViewChartByDate'
import PropTypes from 'prop-types'
import { getDayTranslate } from '../pages/dashboard/DashboardPage'
import Loader from '../loader/Loader'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { MOK_DATA_BAR_CHART, HORIZONTAL_BAR_CHART_COLORS } from './constants'
import { FormattedMessage } from 'react-intl'
import { getExplorationData } from '../../store/dashboard/exploration/explorationActions'
import { setCurrentRoute } from '../../store/navigation/NavActions'


Parallel(Highcharts)

class NewPageChart extends React.Component {

  constructor(props) {
    super(props)
    // this.props.getContractsCommonInfo()
    // this.props.getExplorationData()
    // let sortedDaysArray = _.orderBy(_.map(MOK_DATA_BAR_CHART, (data) => ({ date: data.date })), 'date', 'asc')
    if (ReactHighcharts.Highcharts) {
      addNoDataModule(ReactHighcharts.Highcharts)
    }

    props.setCurrentRoute('/dashboard/weekly')
    this.state = {
      playStatus: false,
      // sortedDaysArray: sortedDaysArray,
      sortedDaysArray: [],
      // startDay: daysArray[daysArray.length - 1].date,
      startDay: '',
      // playIndex: sortedDaysArray.length - 1,
      playIndex: 0,
      // defaultSelectedDayIndex: sortedDaysArray.length - 1,
      defaultSelectedDayIndex: 0,
    }
  }

  componentDidMount() {
    const { intl } = this.context
    this.props.getExplorationData().then(() => {
      let sortedDaysArray = _.orderBy(_.map(this.props.explorationData.days, (data) => ({ date: data.date })), 'date', 'asc')
      sortedDaysArray.unshift({
        date: intl.formatMessage({ id: 'page.common.text.64' }),
        procurementMethodAmounts: this.props.indicatorsData.procurementMethodAmounts,
        top10Buyers: this.props.indicatorsData.top10Buyers,
      })

      this.setState({
        sortedDaysArray: sortedDaysArray,
        // startDay: sortedDaysArray[sortedDaysArray.length - 1].date,
        startDay: sortedDaysArray[0].date,
        playIndex: 0,
        defaultSelectedDayIndex: 0,
      })
    })

  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   return !_.isEqual(nextProps.contractsCommonInfo, this.props.contractsCommonInfo)
  // }

  getWeekDays = ({ days, dates }) => {
    const { lang } = this.props
    let concated = _.zip(dates, days)
    let res = []
    _.forEach(concated, item => {
      res.push(`<span>${item[0]}<br />${lang === 'ru' ? item[1] : getDayTranslate(item[1])}</span>`)
    })
    return res
  }

  getSeries = () => {
    const { contractsCommonInfo } = this.props
    const series = contractsCommonInfo.info
    return series.map(item => {
      return {
        data: [
          item.dayNumber,
          item.tenderCount,
          item.tendersCompetitiveShare,
          item.contractsCount,
          item.contractsAmount,
          item.contractBudgetShare,
        ],
        boostThreshold: 1,
        turboThreshold: 1,
        lineWidth: 2,
        name: this.getWeekDays(contractsCommonInfo)[item.dayNumber],
      }
    })
  }

  handleScrollToFirstBlock = () => {
    document.getElementById('start-page').scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  changeViewChart = () => {
    // this.state.sortedDaysArray[this.state.playIndex]
    const { sortedDaysArray, playIndex } = this.state
    let nextIndex = playIndex + 1

    if (nextIndex === sortedDaysArray.length) {
      nextIndex = 0
    }

    this.setState({
      playIndex: nextIndex,
      defaultSelectedDayIndex: nextIndex,
    })
  }

  handlePlayPauseChange = (e, playStatus) => {
    let intervalId = null
    if (playStatus) {
      intervalId = setInterval(this.changeViewChart, 3000)
      // store intervalId in the state so it can be accessed later:
      this.setState({ intervalId: intervalId })
    } else {
      clearInterval(this.state.intervalId)
    }

    this.setState({
      playStatus: playStatus,
      intervalId: intervalId,
    })
  }


  render() {
    const { contractsCommonInfo, explorationData, indicatorsData, lang } = this.props
    if (_.isEmpty(explorationData) || _.isEmpty(indicatorsData) || _.isEmpty(this.state.sortedDaysArray)) return <div
      className="page-chart-new">
      <div className="container page-chart__wrapper d-flex pt-110">
        <div style={{ 'alignSelf': 'center', 'width': '100%' }}>
          <Loader isActive={_.isEmpty(explorationData)} theme="light" />
        </div>
      </div>
    </div>

    // let series = this.getSeries()
    const { intl } = this.context
    let explorationDataCloned = _.cloneDeep(explorationData.days)
    explorationDataCloned.unshift({
      date: intl.formatMessage({ id: 'page.common.text.64' }),
      procurementMethodAmounts: indicatorsData.procurementMethodAmounts,
      top10Buyers: indicatorsData.top10Buyers,
    })

    const title = intl.formatMessage({ id: 'page.dashboard.text.1.3' })
    let dataForCharts = _.find(explorationDataCloned, { date: this.state.sortedDaysArray[this.state.playIndex] ? this.state.sortedDaysArray[this.state.playIndex].date : '' })
    let competitiveAmount = dataForCharts.procurementMethodAmounts ? dataForCharts.procurementMethodAmounts.competitiveLotsAmount : 0
    let nonCompetitiveAmount = dataForCharts.procurementMethodAmounts ? dataForCharts.procurementMethodAmounts.notCompetitiveLotsAmount : 0
    let competitiveData = competitiveAmount === 0 ? 0 : parseInt(((competitiveAmount / (competitiveAmount + nonCompetitiveAmount)) * 100).toFixed(0))
    let nonComplianceData = 100 - competitiveData

    let configBar = {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        height: 600,
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
      },
      title: {
        text: intl.formatMessage({ id: 'page.common.text.8' }),
        align: 'left',
        x: 20,
        style: {
          fontSize: window.innerWidth < 700 ? '18px' : '28px',
          color: '#2A577F',
        },
      },
      xAxis: {
        // categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K'],
        categories: _.map(dataForCharts.top10Buyers, (data) => (data.name)),
        lineColor: '#AFAFAF',
        lineWidth: 0.5,
        offset: 10,
        title: {
          text: null,
        },
        labels: {
          style: {
            color: '#AFAFAF',
          },
        },
      },
      yAxis: {
        lineColor: '#AFAFAF',
        lineWidth: 0.5,
        min: 0,
        offset: 10,
        title: {
          text: intl.formatMessage({ id: 'page.chart.text.1' }),
          align: 'low',
          offset: 10,
          style: {
            color: '#AFAFAF',
          },
        },
        labels: {
          enabled: false,
          overflow: 'justify',
          color: '#AFAFAF',
        },
      },
      tooltip: {
        formatter: function () {
          let value =this.y.toLocaleString(lang === 'en' ? 'en' : 'ru')
          return '<span style="font-size: 14px">' + this.key + '</span><br/>'
            + '<span style="font-size: 14px">' + intl.formatMessage({ id: 'tooltip.common.text.1' }) + ': ' + value + ' ' + intl.formatMessage({ id: 'common.byn.text' }) + '</span>'
        },
        // valueSuffix: ' millions',
      },
      plotOptions: {
        series: {
          borderWidth: 0,
        },
        bar: {
          dataLabels: {
            enabled: false,
          },
        },
      },
      legend: {
        enabled: false,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          data: _.map(dataForCharts.top10Buyers, (data, index) => ({
            y: data.lotsAmount,
            color: HORIZONTAL_BAR_CHART_COLORS[index],
            x: index,
          })),
        },
      ],
    }

    let configPie = {
      chart: {
        type: 'pie',
        height: window.innerWidth < 700 ? 450 : 600,
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
        events: {
          load: function () {
            _.forEach((this.series), (sr, index) => {
              this.series[index].chart.legend.baseline = 30
              this.series[index].chart.legend.itemMarginTop = 0
              this.series[index].chart.legend.symbolHeight = 15
              this.series[index].chart.legend.symbolWidth = 15
            })
          },
        },
      },
      title: {
        text: intl.formatMessage({ id: 'page.common.text.9' }),
        style: {
          fontSize: window.innerWidth < 700 ? '18px' : '28px',
          color: '#2A577F',
        },
      },
      lang: {
        noData: intl.formatMessage({ id: 'page.common.text.61' }),
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030',
        },
      },
      xAxis: {
        categories: ['A', 'B'],
        title: {
          text: null,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: '',
          align: 'high',
        },
        labels: {
          overflow: 'justify',
        },
      },
      legend: {
        symbolHeight: 35,
        symbolWidth: 35,
        symbolRadius: 0,
        align: 'center',
        verticalAlign: 'bottom',
        y: 0,
        padding: 0,
        itemMarginTop: 30,
        itemMarginBottom: 0,
        itemWidth: 200,
        useHTML: true,
        itemStyle: {
          verticalAlign: 'top',
          color: '#2A577F',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '16px',
          // lineHeight: '24px',
          letterSpacing: '0.05em',
          display: 'inline-block',
        },
        labelFormatter: function () {
          return this.legendText
        },
      },
      plotOptions: {
        pie: {
          startAngle: 228,
          slicedOffset: 10,
          dataLabels: {
            enabled: true,
          },
          showInLegend: true,
          events: {
            legendItemClick: function (e) {
              e.preventDefault()
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        formatter: function () {
          return '<span style="font-size: 14px">' + intl.formatMessage({ id: this.point.pointDescription }) + ': ' + this.key + '</span>'
        },
        // valueSuffix: ' millions',
      },
      // let competitiveData = competitiveAmount === 0 ? 0 : Math.round(competitiveAmount / (competitiveAmount + nonCompetitiveAmount))
      // let nonComplianceData = 100 - competitiveData
      series: dataForCharts.procurementMethodAmounts ? [
        {
          type: 'pie',
          dataLabels: false,
          size: '40%',
          showInLegend: false,
          enableMouseTracking: false,
          data: [{
            name: '',
            y: 7,
            color: '#599EC0',
          }],
          innerSize: '95%',
        },
        {
          innerSize: '50%',
          // borderWidth: 5,
          data: [
            {
              name: `${competitiveData}%`,
              y: competitiveData,
              color: '#ADD3D6',
              pointPercent: competitiveData,
              pointDescription: 'page.common.text.13',
              legendText: intl.formatMessage({ id: 'page.common.text.13' }),
              sliced: false,
              dataLabels: {
                verticalAlign: 'top',
                enabled: true,
                connectorWidth: 1,
                distance: -25,
                connectorColor: '#000000',
                style: {
                  fontWeight: 600,
                  fontSize: '18px',
                  color: '#2A577F',
                  textOutline: 0,
                },
              },
            },
            {
              name: `${nonComplianceData}%`,
              y: nonComplianceData,
              color: '#5FBBC2',
              pointPercent: nonComplianceData,
              pointDescription: 'page.common.text.14',
              legendText: intl.formatMessage({ id: 'page.common.text.14' }),
              sliced: true,
              dataLabels: {
                verticalAlign: 'top',
                enabled: true,
                connectorWidth: 1,
                distance: -30,
                connectorColor: '#000000',
                style: {
                  fontWeight: 600,
                  fontSize: '18px',
                  color: '#FFFFFF',
                  textOutline: 0,
                },
              },
            },
          ],
        },
      ] : [],
    }

    return (
      <div className="page-chart-new">
        {/*<div className="container-fluid page-chart__wrapper">*/}
        <div className="margin-top-30"
          // style={{ marginTop: 110 }}
        >
          <div className="row">
            <div className="col-md-12 col-xl-12 analytics-title">
              <p><FormattedMessage id="page.dashboard.text.1.3" /></p>
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="tooltip-bottom">
                    <div className="tooltip-inner-info-wrapper">
                      <div className="tooltip-inner-info-row">
                        <span
                          className="tooltip-inner-info-bold-text">{intl.formatMessage({ id: 'page.common.text.39.1' })}: </span>
                        <span
                          className="tooltip-inner-info-simple-text">{intl.formatMessage({ id: 'page.common.text.39.14' })}</span>
                      </div>
                      <div className="tooltip-inner-info-row">
                        <span
                          className="tooltip-inner-info-bold-text">{intl.formatMessage({ id: 'page.common.text.39.2' })}: </span>
                        <span
                          className="tooltip-inner-info-simple-text">{intl.formatMessage({ id: 'page.common.text.39.5' })}</span>
                      </div>
                      <div className="tooltip-inner-info-row">
                        <span
                          className="tooltip-inner-info-bold-text">{intl.formatMessage({ id: 'page.common.text.39.7' })}: </span>
                        <span
                          className="tooltip-inner-info-simple-text">{intl.formatMessage({ id: 'page.common.text.39.8' })}</span>
                      </div>
                    </div>
                  </Tooltip>
                }>
                <div className='switch-rectangle-icon-info-title'>
                  <div className="info-icon"><span>i</span></div>
                </div>
              </OverlayTrigger>
            </div>
          </div>
        </div>
        <div className="row margin-top-30" style={{ marginTop: 110 }}>
          <div
            className="col-md-12 col-xl-7"
            // style={{ width: '60%' }}
          >
            <ReactHighcharts
              key={generate()}
              config={configBar}
              id="contracts-common-info-chart"
              ref="contracts-common-info-chart"
            />
          </div>
          <div
            className="col-md-12 col-xl-5"
            // style={{ width: '40%', position: 'relative' }}
          >
            {/*<div className="pie-center-circle" />*/}
            <ReactHighcharts
              key={generate()}
              config={configPie}
              id="contracts-common-info-chart"
              ref="contracts-common-info-chart"
            />
          </div>
        </div>
        <div>
          <ViewChartByDate
            days={this.state.sortedDaysArray.map((item) => (item.date))}
            playStatus={this.state.playStatus}
            daySelectedIndex={this.state.defaultSelectedDayIndex}
            handlePlayPauseChange={this.handlePlayPauseChange}
          />
        </div>

        {/*<div className="row justify-content-center margin-top-30">*/}
        {/*  <SlideArrow onClick={this.handleScrollToFirstBlock} />*/}
        {/*</div>*/}
      </div>
    )
  }
}

function MapStateToProps({
                           dashboard,
                           locale,
                           explorationDataStore,
                           indicatorsDataStore,
                           navigation,
                         }) {
  return {
    contractsCommonInfo: dashboard.contractsCommonInfo,
    explorationData: explorationDataStore.explorationData,
    lang: locale.lang,
    defaultRoute: navigation.defaultRoute,
    indicatorsData: indicatorsDataStore.indicatorsData,
  }
}

function MapDispatchToProps(dispatch) {
  return {
    getContractsCommonInfo: bindActionCreators(getContractsCommonInfo, dispatch),

    //New actions
    getExplorationData: bindActionCreators(getExplorationData, dispatch),
    setCurrentRoute: bindActionCreators(setCurrentRoute, dispatch),
  }
}

NewPageChart.contextTypes = {
  intl: PropTypes.object.isRequired,
}

export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(NewPageChart)
