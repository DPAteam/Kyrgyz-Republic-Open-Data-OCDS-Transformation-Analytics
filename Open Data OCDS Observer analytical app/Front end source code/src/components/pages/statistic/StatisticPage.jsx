import React, { Fragment, PureComponent } from 'react'
import Highcharts from 'highcharts/highcharts'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

import Slider from 'react-slick'
import Card from '../../card/Card'
import ChartGradMini from '../../chartGradMini/ChartGradMini'
import BuyersAvgContractsCharts from '../../buyersAvgContractsCharts/BuyersAvgContractsCharts'
import KpiBuyersSuppliersCountChart from '../../kpiBuyersSuppliersCount/KpiBuyersSuppliersCountChart'

import { ReadMoreTable } from '../../readmoretable/ReadMoreTable'
import { generate } from 'shortid'
import { CARDS_DESCRIPTIONS, ChartConfig } from '../dashboard/mockData'
import CardInfo from '../../CardInfo/CardInfo'
import Divider from '../../divider/Divider'
import ReactTable from 'react-table'
import * as numeral from 'numeral'
import * as classnames from 'classnames'
import BuyersRegionsSlide from '../../buyersRegionsSlide/BuyersRegionsSlide'
import CardContentSwitch from '../../cardContentSwitch/CardContentSwitch'
import ReactHighcharts from 'react-highcharts'
import addNoDataModule from 'highcharts/modules/no-data-to-display'
import BelarusMap from '../../belarusMap/BelarusMap'
import WorldMap from '../../worldMap/WorldMap'
import SuppliersResidencyPieChart from '../../suppliersResidencyPieChart/SuppliersResidencyPieChart'
import BuyersCapitalBuyersPieChart from '../../buyersCapitalBuyersPieChart/BuyersCapitalBuyersPieChart'
import Loader from '../../loader/Loader'
import * as ReactDOM from 'react-dom'

import {
  getAverages,
  getBuyersSuppliers,
  getClassAvgPerTopByContAmountRegTopCountAmountOKRB,
  getContComCountAmountDatesCompeCountAmountSuppSABAShare,
  getKPIsProcCContAContCPerSBSCount, getKPIsShareCompleteLotsLotsForSmallScaleBusinessGSWCount,
} from '../../../store/statisticMerge/actions'

import { getStatisticData } from '../../../store/dashboard/statistic/statisticActions'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import DropdownMenu from '../../dropdown/Dropdown'
import moment from 'moment'

import './StatisticPage.scss'
import { changeLocation, setCurrentLocation, setCurrentRoute } from '../../../store/navigation/NavActions'
import { HORIZONTAL_BAR_CHART_COLORS, HORIZONTAL_BAR_CHART_SECONDARY_COLORS } from '../../pageChart/constants'
import KyrgyzstanMap from '../../belarusMap/KyrgystanMap'
import DateSelector from '../../dateSelector/DateSelector'


class StatisticPage extends PureComponent {

  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props) {
    if (ReactHighcharts.Highcharts) {
      addNoDataModule(ReactHighcharts.Highcharts)
    }

    super(props)
    const loc = window.location.pathname
    props.setCurrentRoute('/statistic/procedures')

    props.setCurrentLocation(loc)
    props.changeLocation(loc, loc)
    let dateRange = {
      dateFrom: moment().subtract('days', 365).format('YYYY-MM-DD'),
      dateTo: moment().format('YYYY-MM-DD'),
    }

    this.state = {
      yearSelected: 'last',
      timeValues: this.getTimeValues(dateRange),
    }

    // this.props.getAverages()
    // this.props.getBuyersSuppliers()
    // this.props.getClassAvgPerTopByContAmountRegTopCountAmountOKRB()
    // this.props.getContComCountAmountDatesCompeCountAmountSuppSABAShare()
    // this.props.getKPIsProcCContAContCPerSBSCount()
    // this.props.getKPIsShareCompleteLotsLotsForSmallScaleBusinessGSWCount()
    this.props.getStatisticData(dateRange)
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).scrollIntoView()
    ReactDOM.findDOMNode(this).scrollTop = 0
    window.scrollTo(0, 0)
  }

  renderChartGradMini = (data, title, name, valueKey, isFetching) => {
    if (isFetching) return <Loader isActive={isFetching} />
    // if (_.isEmpty(data && data.dates)) return <div>No Data</div>

    return <ChartGradMini
      data={data}
      title={title}
      name={name}
      valueKey={valueKey}
    />
  }

  renderDatesBuyersAvgContractsChart = (data, title, isFetching) => {
    if (_.isEmpty(data)) return <Loader isActive={isFetching} />
    return <BuyersAvgContractsCharts
      data={data}
      title={title}
      translationI18nData={this.props.translationI18nData}
      timeValues={this.state.timeValues}
    />
  }

  renderKpiBuyersSuppliersCountChart = (data, title, isFetching) => {
    if (_.isEmpty(data)) return <Loader isActive={isFetching} />
    return <KpiBuyersSuppliersCountChart
      data={data}
      title={title}
    />
  }

  getClassificationTopTableColumns = () => {
    const { intl } = this.context
    return [
      {
        Header: intl.formatMessage({ id: 'page.statistic.text.058' }),
        accessor: 'description',
        headerClassName: 'table-header',
        Cell: props => <ReadMoreTable charLimit={20} value={props.value} />,
      },
      {
        Header: intl.formatMessage({ id: 'page.statistic.text.059.1' }),
        accessor: 'id',
        headerClassName: 'table-header',
      },
      {
        Header: intl.formatMessage({ id: 'page.statistic.text.060.1' }),
        accessor: 'count',
        headerClassName: 'table-header',
      },
      {
        Header: intl.formatMessage({ id: 'page.statistic.text.061.1' }),
        accessor: 'amount',
        headerClassName: 'table-header',
      },
    ]
  }
  getClassificationTopTableData = data => {
    return _.map(data, (item, index) => {
      let i18nCpv = _.find(this.props.translationI18nData.entries, { key: item.name })
      let translatedCpvName = !_.isEmpty(i18nCpv) ? (this.props.lang === 'en' ? i18nCpv.en : i18nCpv.ru) : ''

      return {
        id: item.name,
        description: translatedCpvName,
        // count: item.lotsCount,
        count: item.lotsCount.toLocaleString(this.props.lang === 'en' ? 'en' : 'ru'),
        // amount: _.round(item.lotsAmount / 1000000, 2).toLocaleString('ru'),
        amount: item.lotsAmount.toLocaleString(this.props.lang === 'en' ? 'en' : 'ru'),
      }
    })
  }

  getBuyersCompetitiveTableColumns = () => {
    const { intl } = this.context
    return [
      {
        Header: intl.formatMessage({ id: 'page.statistic.text.062' }),
        accessor: 'name',
        Cell: props => <ReadMoreTable charLimit={20} value={props.value} />,
        headerClassName: 'table-header',
      },
      {
        Header: intl.formatMessage({ id: 'page.statistic.text.063' }),
        accessor: 'region',
        headerClassName: 'table-header',
      },
      {
        Header: intl.formatMessage({ id: 'page.statistic.text.060.1' }),
        accessor: 'count',
        headerClassName: 'table-header',
      },
      {
        Header: intl.formatMessage({ id: 'page.statistic.text.061.2' }),
        accessor: 'amount',
        headerClassName: 'table-header',
      },
    ]
  }
  getBuyersCompetitiveTableData = data => {
    return _.map(data, (item) => {
      return {
        name: item.name,
        region: item.region,
        count: item.lotsCount,
        // amount: _.round(item.lotsAmount / 1000000, 2).toLocaleString('ru'),
        amount: item.lotsAmount.toLocaleString(this.props.lang === 'en' ? 'en' : 'ru'),
      }
    })
  }

  renderClassificationTopByContractTable = () => {
    return <Fragment>
      <h4 className="table-title">
        <FormattedMessage id="common.home.switchDefault.subjectMatters.label" />
      </h4>
      <Divider marginTop={30} />
      <ReactTable
        defaultPageSize={5}
        // data={this.getClassificationTopTableData(this.props.classificationTopByContractAmount)}
        data={this.getClassificationTopTableData(this.props.statisticData.top5Cpv)}
        columns={this.getClassificationTopTableColumns()}
        showPagination={false}
        sortable={false}
        resizable={false}
        minRows={0}
      />
    </Fragment>
  }

  renderBuyersCompetitiveTopByContractTable = () => {
    return <Fragment>
      <h4 className="table-title">
        <FormattedMessage id="page.statistic.text.057" />
      </h4>
      <Divider marginTop={30} />
      <ReactTable
        defaultPageSize={5}
        data={this.getBuyersCompetitiveTableData(this.props.statisticData.top5BuyersWithCompetitiveTenders)}
        columns={this.getBuyersCompetitiveTableColumns()}
        showPagination={false}
        sortable={false}
        resizable={false}
        minRows={0}
      />
    </Fragment>
  }

  renderRegionTopCards = (data, type) => {
    const { intl } = this.context
    // const REGIONS = [
    //   {
    //     ru: 'г. Минск',
    //     en: 'Minsk',
    //   },
    //   {
    //     ru: 'Брестская обл.',
    //     en: 'Brest region',
    //   },
    //   {
    //     ru: 'Витебская обл.',
    //     en: 'Vitebsk region',
    //   },
    //   {
    //     ru: 'Гомельская обл.',
    //     en: 'Gomel region',
    //   },
    //   {
    //     ru: 'Гродненская обл.',
    //     en: 'Grodno region',
    //   },
    //   {
    //     ru: 'Минская обл.',
    //     en: 'Minsk region',
    //   },
    //   {
    //     ru: 'Могилевская обл.',
    //     en: 'Mogilev region',
    //   },
    // ]

    // const REGIONS = [
    //   {
    //     ruTemp: 'г. Минск',
    //     ru: 'Бишкек',
    //     en: 'Bishkek',
    //   },
    //   {
    //     ruTemp: 'Брестская обл.',
    //     ru: 'Баткенская обл.',
    //     en: 'Batken region',
    //   },
    //   {
    //     ruTemp: 'Витебская обл.',
    //     ru: 'Чуйская обл.',
    //     en: 'Chuy region',
    //   },
    //   {
    //     ruTemp: 'Гомельская обл.',
    //     ru: 'Иссык-Кульская обл.',
    //     en: 'Ysyk-Köl region',
    //   },
    //   {
    //     ruTemp: 'Гродненская обл.',
    //     ru: 'Нарынская обл.',
    //     en: 'Naryn region',
    //   },
    //   {
    //     ruTemp: 'Минская обл.',
    //     ru: 'Таласская обл.',
    //     en: 'Talas region',
    //   },
    //   {
    //     ruTemp: 'Могилевская обл.',
    //     ru: 'Ошская обл.',
    //     en: 'Osh region',
    //   },
    //   // {
    //   //   ru: 'Джалал-Абадская  обл.',
    //   //   en: 'Jalal-Abad region',
    //   // },
    // ]
    const REGIONS = [
      {
        ruTemp: 'Бишкек',
        ru: 'Бишкек',
        en: 'Bishkek',
      },
      {
        ruTemp: 'Ош',
        ru: 'Ош',
        en: 'Ош',
      },
      {
        ruTemp: 'Ошская Область',
        ru: 'Ошская Область',
        en: 'Osh region',
      },
      {
        ruTemp: 'Баткенская Область',
        ru: 'Баткенская Область',
        en: 'Batken region',
      },
      {
        ruTemp: 'Таласская Область',
        ru: 'Таласская Область',
        en: 'Talas region',
      },
      {
        ruTemp: 'Джалал-Абадская Область',
        ru: 'Джалал-Абадская Область',
        en: 'Jalal-Abad region',
      },
      {
        ruTemp: 'Чуйская Область',
        ru: 'Чуйская Область',
        en: 'Chuy region',
      },
      {
        ruTemp: 'Иссык-Кульская Область',
        ru: 'Иссык-Кульская Область',
        en: 'Ysyk-Köl region',
      },
      {
        ruTemp: 'Нарынская Область',
        ru: 'Нарынская Область',
        en: 'Naryn region',
      },
    ]

    const getLocale = (region) => {
      // if (region === null) {
      //   return 'NULL'
      // }

      if (this.props.lang === 'ru') {
        // return region
        return _.find(REGIONS, o => {
          return o.ruTemp === region
        }).ru
      } else {
        return _.find(REGIONS, o => {
          return o.ruTemp === region
        }).en
      }
    }

    if (_.isEmpty(data)) return
    return _.map(data, item => {
      let i18nCpv = _.find(this.props.translationI18nData.entries, { key: item.cpv })
      let translatedCpvName = !_.isEmpty(i18nCpv) ? (this.props.lang === 'en' ? i18nCpv.en : i18nCpv.ru) : ''
      // let description = type === 'count' ? translatedCpvName : numeral(item.lotsAmount).format('0.0 a') + ' ' + intl.formatMessage({ id: 'common.byn.text' })
      let description = translatedCpvName

      return <Card key={generate()} className="col" cardClass="region-background">
        <BuyersRegionsSlide
          type={type}
          // description={item[`lots${type.charAt(0).toUpperCase() + type.slice(1)}`].toString()}
          // description={type === 'count' ? item.cpv : item[`lots${type.charAt(0).toUpperCase() + type.slice(1)}`].toString()}
          description={description}
          region={getLocale(item.region)}
        />
      </Card>
    })
  }

  getGswAreaStackedChartSeries = (data) => {
    const { intl } = this.context

    // const COLORS = [
    //   '#64B5F6',
    //   '#81C784',
    //   '#E57373',
    // ]
    const COLORS = [
      '#3672A1',
      '#63D4B1',
      '#E57373',
    ]

    const LINE_COLORS = [
      '#599ec0',
      '#63D4B1',
    ]

    let series = {}
    _.forEach(data, (dataItem) => {
      _.forEach(Object.keys(dataItem.chartData), (dataKey) => {

        if (series.hasOwnProperty(dataKey)) {
          series[dataKey].push(dataItem.chartData[dataKey])
        } else {
          series = _.merge({}, series, {
            [dataKey]: [dataItem.chartData[dataKey]],
          })
        }
      })
    })

    return _.map(Object.keys(series), (seriesName, index) => {
        return {
          // name: getItemKey(seriesName),
          name: seriesName === 'departmentValue' ? intl.formatMessage({ id: 'tooltip.common.text.9.1' }) : intl.formatMessage({ id: 'tooltip.common.text.9.4' }),
          data: series[seriesName],
          lineWidth: 3,
          color: LINE_COLORS[index],

          // lineColor: {
          //   color: LINE_COLORS[index],
          //   linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          //   stops: [
          //     [0, COLORS[index]],
          //     [1, `${COLORS[index]}70`],
          //   ],
          // },
          fillColor: {
            // linearGradient: [100, 0, 0, 300],
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, `${COLORS[index]}50`],
              [1, `${COLORS[index]}00`],
            ],
          },
        }
      },
    )
  }

  getGswAreaStackedCategories = data => {
    return data.map(item => {
      return item.date
    })
  }

  renderGswAreaStackedChart = (statisticData, isFetching) => {
    if (isFetching) return <Loader isActive={isFetching} />

    const { intl } = this.context
    const { timeValues } = this.state

    let valueExist = false
    let preparedData = []

    _.forEach(timeValues, (monthName) => {
      let companyEnquiriesCountByMonth = _.find(statisticData.companyEnquiriesCountByMonth, { date: monthName })
      let departmentEnquiriesCountByMonth = _.find(statisticData.departmentEnquiriesCountByMonth, { date: monthName })

      let companyEnquiriesValue = companyEnquiriesCountByMonth ? companyEnquiriesCountByMonth.value : 0
      let departmentEnquiriesValue = departmentEnquiriesCountByMonth ? departmentEnquiriesCountByMonth.value : 0

      if (companyEnquiriesValue !== 0 || departmentEnquiriesValue !== 0) {
        valueExist = true
      }

      preparedData.push({
        date: monthName,
        chartData: {
          departmentValue: departmentEnquiriesValue,
          companyValue: companyEnquiriesValue,
        },
      })
    })

    let GradientChartConfig = _.cloneDeep(ChartConfig)
    const chartId = `arealine-chart-${generate()}`
    GradientChartConfig.id = chartId

    GradientChartConfig.config = {
      chart: {
        type: 'area',
        height: 450,
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
        backgroundColor: 'transparent',
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
      title: {
        text: intl.formatMessage({ id: 'page.statistic.text.019' }),
        margin: 50,
        align: 'left',
        style: {
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '28px',
          lineHeight: '41px',
          letterSpacing: '0.05em',
          color: '#FFFFFF',
        },
      },
      credits: {
        enabled: false,
      },
      // series: this.getGswAreaStackedChartSeries(dates),
      series: this.getGswAreaStackedChartSeries(valueExist ? preparedData : []),
      tooltip: {
        pointFormat: '{series.name}: {point.y:,f} ' + intl.formatMessage({ id: 'common.psc.text' }),
      },
      plotOptions: {
        series: {
          pointPlacement: 0,
          pointStart: 0,
          marker: {
            radius: 0,
            states: {
              hover: {
                radius: 8,
                lineWidth: 5,
                lineWidthPlus: 10,
              },
            },
          },
        },
      },
      legend: {
        symbolHeight: 17,
        symbolWidth: 17,
        symbolRadius: 0,
        itemStyle: {
          color: '#FFFFFF',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '16px',
          lineHeight: '24px',
          letterSpacing: '0.05em',
        },
      },
      xAxis: {
        categories: this.getGswAreaStackedCategories(valueExist ? preparedData : []),
        labels: {
          formatter: function () {
            return this.value
          },
          style: {
            color: '#75BADC',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.05em',
          },
        },
        // title: {
        //   text: intl.formatMessage({ id: 'page.statistic.text.064' }),
        // },
      },
      yAxis: {
        gridLineColor: '#74B9DB',
        gridLineWidth: 1,
        gridZIndex: 4,
        labels: {
          formatter: function () {
            return this.value
          },
          style: {
            color: '#75BADC',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.05em',
          },
        },
        title: {
          text: intl.formatMessage({ id: 'page.dashboard.text.04' }),
          style: {
            color: '#75BADC',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.05em',
          },
        },
      },
    }
    return <ReactHighcharts
      key={generate()}
      config={GradientChartConfig.config}
      id="buyers-suppliers-count-pie-chart"
      ref="buyers-suppliers-count-pie-chart"
    />
  }

  getSmallScaleBarChart = (data) => {
    const { smallScaleSuppliersContractsAmount } = this.props
    const { intl } = this.context
    let configBar = {
      config: {
        chart: {
          type: 'bar',
          backgroundColor: 'transparent',
          // height: 470,
          height: 500,
          style: {
            fontFamily: 'Oswald', //'Open Sans'
          },
        },
        title: {
          // text: intl.formatMessage({ id: 'page.statistic.text.019' }),
          // text: 'ТОП-5 квалификационных требований',
          text: intl.formatMessage({ id: 'page.common.text.30' }),
          margin: 50,
          align: 'left',
          style: {
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '28px',
            lineHeight: '41px',
            letterSpacing: '0.05em',
            color: '#FFFFFF',
          },
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          // categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K'],
          tickColor: '#417FAA',
          categories: null,
          lineWidth: 0,
          offset: 10,
          title: {
            // text: intl.formatMessage({ id: 'page.dashboard.text.04' }),
            text: intl.formatMessage({ id: 'page.common.text.56' }),
            style: {
              color: '#75BADC',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0.05em',
            },
          },
          labels: {
            enabled: false,
          },
        },
        yAxis: {
          gridLineColor: '#74B9DB',
          gridLineWidth: 1,
          lineColor: '#AFAFAF',
          lineWidth: 0,
          min: 0,
          offset: 10,
          title: {
            // text: intl.formatMessage({ id: 'page.dashboard.text.04' }),
            text: intl.formatMessage({ id: 'page.common.text.57' }),
            style: {
              color: '#75BADC',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0.05em',
            },
          },
          labels: {
            formatter: function () {
              return this.value
            },
            style: {
              color: '#75BADC',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0.05em',
            },
          },
        },
        tooltip: {
          formatter: function () {
            return '<span style="font-size: 14px">' + this.point.name + '</span><br/>'
              + '<span style="font-size: 14px">' + intl.formatMessage({ id: 'tooltip.common.text.9.2' }) + ': ' + this.y + ' ' + intl.formatMessage({ id: 'common.psc.text' }) + '</span>'
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
        credits: {
          enabled: false,
        },
        // series: [
        //   {
        //     data: _.map(smallScaleSuppliersContractsAmount, (item, index) => ({
        //       // getItemKey(item.key.ru), item.amount / 1000000
        //       y: item.amount / 1000000,
        //       color: HORIZONTAL_BAR_CHART_COLORS[index],
        //       x: index,
        //     })),
        //   },
        // ],

        series: [
          {
            data: _.map(data, (dt, index) => (
              {
                name: dt.name,
                y: dt.value,
                color: HORIZONTAL_BAR_CHART_SECONDARY_COLORS[index],
                x: index,
              }
            )),
            // data: [
            //   {
            //     y: 2015,
            //     color: '#A8E2D1',
            //     x: 0,
            //   },
            //   {
            //     y: 1805,
            //     color: '#63D4B1',
            //     x: 1,
            //   },
            //   {
            //     y: 1230,
            //     color: '#5FBBC2',
            //     x: 2,
            //   },
            //   {
            //     y: 756,
            //     color: '#72BBDB',
            //     x: 3,
            //   },
            //   {
            //     y: 333,
            //     color: '#599EC0',
            //     x: 4,
            //   },
            // ],
          },
        ],
      },
    }
    // let smallScaleConfig = _.cloneDeep(ChartConfig)
    let smallScaleConfig = _.cloneDeep(configBar)

    smallScaleConfig.id = 'enquiries-count-chart_2'
    // smallScaleConfig.config.chart.type = 'column'
    // smallScaleConfig.config.title = {
    //   text: intl.formatMessage({ id: 'page.statistic.text.026' }),
    //   align: 'left',
    //   style: { 'font-weigth': 'bold' },
    // }
    // const getItemKey = (inf) => {
    //   if (this.props.lang === 'ru') {
    //     return inf
    //   } else {
    //     if (inf === 'Микро') {
    //       return 'Micro'
    //     } else if (inf === 'Малые') {
    //       return 'Small'
    //     } else {
    //       return 'Medium'
    //     }
    //   }
    // }
    // smallScaleConfig.config.chart.height = 400
    // smallScaleConfig.config.xAxis.categories = smallScaleSuppliersContractsAmount.map(item => {
    //   return getItemKey(item.key.ru)
    // })
    // smallScaleConfig.config.xAxis.title = {
    //   text: '',
    // }
    // smallScaleConfig.config.colors = ['#64B5F690']
    // smallScaleConfig.config.yAxis.title = {
    //   text: intl.formatMessage({ id: 'common.home.kpiChart.averageCost.label' }),
    // }
    // smallScaleConfig.config.tooltip = {
    //   formatter: function () {
    //     return '<b>' + this.point.name + ': </b>' + Math.round(this.point.y) + ' ' + intl.formatMessage({ id: 'common.mln.text' }) + '. ' + intl.formatMessage({ id: 'common.byn.text' }) + '<br/>'
    //   },
    // }
    // smallScaleConfig.config.series[0].name = ''
    // smallScaleConfig.config.series[0].data = smallScaleSuppliersContractsAmount.map(item => {
    //   return [getItemKey(item.key.ru), item.amount / 1000000]
    // })
    // return smallScaleConfig
    return configBar
  }

  renderSmallScaleBarChart = (data) => {
    // const {
    //   smallScaleSuppliersContractsAmount,
    // } = this.props
    // if (this.props.buyersSuppliersIsFetching) return <Loader
    //   isActive={this.props.buyersSuppliersIsFetching}
    // />
    //
    // if (_.isEmpty(smallScaleSuppliersContractsAmount) || _.isEmpty(smallScaleSuppliersContractsAmount[0])) return <div>No
    //   data</div>

    return <ReactHighcharts
      key={generate()}
      config={this.getSmallScaleBarChart(data).config}
      id="enquiries-count-chart_2"
      ref="enquiries-count-chart_2"
    />
  }

  renderSmallScalePieChart = (data, title, isFetching) => {
    const { intl } = this.context
    // if (isFetching) return <Loader isActive={isFetching} />
    let amount = 0
    data = _.orderBy(data, ['value'], ['desc'])

    _.forEach(data, (item) => {
      amount += item.value
    })

    let series = [
      {
        innerSize: '60%',
        // borderWidth: 5,
        borderWidth: 0,
        data: _.map(data, (dt, index) => {
          let percent = dt.value === 0 ? 0 : Math.round(((dt.value / amount) * 100))

          return {
            name: `${percent}%`,
            y: percent,
            color: HORIZONTAL_BAR_CHART_SECONDARY_COLORS[index],
            pointPercent: percent,
            pointDescription: 'item.description',
            legendText: dt.name,
            dataLabels: {
              verticalAlign: 'top',
              enabled: true,
              connectorWidth: 1,
              distance: 20,
              connectorColor: '#000000',
              style: {
                fontWeight: 600,
                fontSize: '18px',
                color: '#2A577F',
                textOutline: 0,
              },
            },
          }
        }),
      },
    ]

    // if (_.isEmpty(data) || _.isEmpty(data[0])) return <div>No data</div>
    let config = {
      // chart: {
      //   height: 400,
      //   plotBackgroundColor: null,
      //   plotBorderWidth: null,
      //   plotShadow: false,
      //   type: 'pie',
      //   style: {
      //     fontFamily: 'Oswald', //'Open Sans'
      //   },
      // },
      // title: {
      //   text: intl.formatMessage({ id: 'page.statistic.text.026' }),
      //   align: 'left',
      //   style: { 'font-weigth': 'bold' },
      // },
      // credits: {
      //   enabled: false,
      // },
      // colors: ['#64B5F680', '#81C78480', '#E5737390'],
      // tooltip: {
      //   formatter: function () {
      //     return '<b>' + this.point.name + ': </b><br>' + intl.formatMessage({ id: 'page.statistic.text.067' }) + ': ' + numeral(this.point.y).format('0.00') + ' ' + intl.formatMessage({ id: 'common.byn.text' }) + ' <br>' + intl.formatMessage({ id: 'page.statistic.text.066' }) + ': ' + numeral(this.point.percentage).format('0') + '%'
      //   },
      // },
      // plotOptions: {
      //   pie: {
      //     allowPointSelect: true,
      //     cursor: 'pointer',
      //     dataLabels: {
      //       enabled: true,
      //       format: '<b>{point.percentage:.0f} %</b>',
      //       distance: -50,
      //       style: {
      //         textOutline: false,
      //         color: '#212121',
      //       },
      //       filter: {
      //         property: 'percentage',
      //         operator: '>',
      //         value: 4,
      //       },
      //     },
      //     showInLegend: true,
      //   },
      // },
      // series: [
      //   {
      //     name: '',
      //     colorByPoint: true,
      //   }],
      chart: {
        height: 500,
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
        backgroundColor: 'transparent',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      title: {
        // text: intl.formatMessage({ id: 'page.statistic.text.019.2' }),
        text: intl.formatMessage({ id: 'page.common.text.62' }),
        margin: 50,
        align: 'left',
        style: {
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '28px',
          lineHeight: '41px',
          letterSpacing: '0.05em',
          color: '#FFFFFF',
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        formatter: function () {
          return this.point.legendText ? '<b>' + this.point.legendText + ': </b><br>'
            + intl.formatMessage({ id: 'tooltip.common.text.9.2' }) + ': ' + numeral(this.point.y).format('0') + ' ' + intl.formatMessage({ id: 'common.psc.text' }) + ' <br>'
            + intl.formatMessage({ id: 'tooltip.common.text.9.3' }) + ': ' + numeral(this.point.percentage).format('0') + '%' : false
        },
      },
      xAxis: {
        categories: ['A', 'B', 'C'],
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
        // layout: 'vertical',
        // backgroundColor: '#FFFFFF',
        // floating: true,
        // align: 'left',
        // verticalAlign: 'top',
        // x: 90,
        // y: 45,
        // margin: 30,
        // symbolHeight: 17,
        // symbolWidth: 17,
        // symbolRadius: 0,
        // align: 'center',
        // verticalAlign: 'bottom',
        // y: -35,
        // padding: 0,
        // itemMarginTop: 30,
        // itemMarginBottom: 0,
        itemStyle: {
          color: '#FFFFFF',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '14px',
          // lineHeight: '24px',
          // letterSpacing: '0.05em',
          // display: 'inline-block',
        },
        labelFormatter: function () {
          return this.legendText
        },
      },
      plotOptions: {
        pie: {
          // enableMouseTracking: false,
          startAngle: -15,
          // slicedOffset: 10,
          dataLabels: {
            enabled: true,
          },
          showInLegend: true,
          colors: ['#64B5F680', '#81C78480'],
          allowPointSelect: true,
          cursor: 'pointer',
          // dataLabels: {
          //   enabled: true,
          //   format: '<b>{point.percentage:.0f} %</b>',
          //   distance: -50,
          //   style: {
          //     textOutline: false,
          //     color: '#212121',
          //   },
          //   filter: {
          //     property: 'percentage',
          //     operator: '>',
          //     value: 4,
          //   },
          // },
          // showInLegend: true,
        },
      },
      series: series,
      // series: [
      //   {
      //     innerSize: '50%',
      //     // borderWidth: 5,
      //     borderWidth: 0,
      //     data: [
      //       {
      //         name: '47%',
      //         y: 47,
      //         color: '#72BBDB',
      //         pointPercent: 47,
      //         pointDescription: 'item.description',
      //         legendText: 'AAA',
      //         dataLabels: {
      //           verticalAlign: 'top',
      //           enabled: true,
      //           connectorWidth: 1,
      //           distance: -30,
      //           connectorColor: '#000000',
      //           style: {
      //             fontWeight: 600,
      //             fontSize: '18px',
      //             color: '#2A577F',
      //             textOutline: 0,
      //           },
      //         },
      //       },
      //       {
      //         name: '18%',
      //         y: 18,
      //         color: '#489EAE',
      //         pointPercent: 18,
      //         pointDescription: 'item.description',
      //         legendText: 'BBB',
      //         dataLabels: {
      //           verticalAlign: 'top',
      //           enabled: true,
      //           connectorWidth: 1,
      //           distance: -30,
      //           connectorColor: '#000000',
      //           style: {
      //             fontWeight: 600,
      //             fontSize: '18px',
      //             color: '#2A577F',
      //             textOutline: 0,
      //           },
      //         },
      //       },
      //       {
      //         name: '17%',
      //         y: 17,
      //         color: '#5FBBC2',
      //         pointPercent: 17,
      //         pointDescription: 'item.description',
      //         legendText: 'CCC',
      //         dataLabels: {
      //           verticalAlign: 'top',
      //           enabled: true,
      //           connectorWidth: 1,
      //           distance: -30,
      //           connectorColor: '#000000',
      //           style: {
      //             fontWeight: 600,
      //             fontSize: '18px',
      //             color: '#2A577F',
      //             textOutline: 0,
      //           },
      //         },
      //       },
      //       {
      //         name: '10%',
      //         y: 10,
      //         color: '#63D4B1',
      //         pointPercent: 10,
      //         pointDescription: 'item.description',
      //         legendText: 'DDD',
      //         dataLabels: {
      //           verticalAlign: 'top',
      //           enabled: true,
      //           connectorWidth: 1,
      //           distance: -30,
      //           connectorColor: '#000000',
      //           style: {
      //             fontWeight: 600,
      //             fontSize: '18px',
      //             color: '#2A577F',
      //             textOutline: 0,
      //           },
      //         },
      //       },
      //       {
      //         name: '8%',
      //         y: 8,
      //         color: '#A8E2D1',
      //         pointPercent: 8,
      //         pointDescription: 'item.description',
      //         legendText: 'EEE',
      //         dataLabels: {
      //           verticalAlign: 'top',
      //           enabled: true,
      //           connectorWidth: 1,
      //           distance: -30,
      //           connectorColor: '#000000',
      //           style: {
      //             fontWeight: 600,
      //             fontSize: '18px',
      //             color: '#2A577F',
      //             textOutline: 0,
      //           },
      //         },
      //       },
      //     ],
      //   },
      // ],
    }
    // config.series = [
    //   {
    //     name: getItemKey(title),
    //     colorByPoint: true,
    //     data: _.map(data, item => {
    //       return {
    //         name: getItemKey(item.key.ru),
    //         y: item.amount,
    //       }
    //     }),
    //   },
    // ]
    return <Fragment>
      <ReactHighcharts
        key={generate()}
        config={config}
        id="buyers-suppliers-count-pie-chart"
        ref="buyers-suppliers-count-pie-chart"
      />
    </Fragment>
  }

  renderGswPieChart = (data, isFetching) => {
    const { intl } = this.context
    if (isFetching) return <Loader isActive={isFetching} />

    let valueExist = false
    _.forEach(Object.keys(data), (key) => {
      if (data[key] !== 0) {
        valueExist = true
      }
    })


    const clonedData = _.cloneDeep(data)

    let departmentData = clonedData.departmentValue === 0 ? 0 : Math.round((clonedData.departmentValue / (clonedData.departmentValue + clonedData.companyValue) * 100))
    let companyData = 100 - departmentData

    let config = {
      chart: {
        height: 500,
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
        backgroundColor: 'transparent',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
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
      title: {
        text: intl.formatMessage({ id: 'page.statistic.text.019.1' }),
        margin: 50,
        align: 'left',
        style: {
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '28px',
          lineHeight: '41px',
          letterSpacing: '0.05em',
          color: '#FFFFFF',
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        formatter: function () {
          return this.point.pointDescription ? '<span style="font-size: 14px">' + intl.formatMessage({ id: this.point.pointDescription }) + '</span><br/>'
            + '<span style="font-size: 14px">' + intl.formatMessage({ id: 'tooltip.common.text.9.2' }) + ': ' + this.point.pointPercent + '</span><br/>'
            + '<span style="font-size: 14px">' + intl.formatMessage({ id: 'tooltip.common.text.9.3' }) + ': ' + this.key + '</span>' : false
        },
        // valueSuffix: ' millions',
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
        // layout: 'vertical',
        // backgroundColor: '#FFFFFF',
        // floating: true,
        // align: 'left',
        // verticalAlign: 'top',
        // x: 90,
        // y: 45,
        margin: 30,
        symbolHeight: 17,
        symbolWidth: 17,
        symbolRadius: 0,
        align: 'center',
        verticalAlign: 'bottom',
        y: -35,
        padding: 0,
        itemMarginTop: 30,
        itemMarginBottom: 0,
        itemStyle: {
          color: '#FFFFFF',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '16px',
          lineHeight: '24px',
          letterSpacing: '0.05em',
          display: 'inline-block',
        },
        labelFormatter: function () {
          return this.legendText
        },
      },
      plotOptions: {
        pie: {
          // enableMouseTracking: false,
          startAngle: 222,
          slicedOffset: 10,
          dataLabels: {
            enabled: true,
          },
          showInLegend: true,
          colors: ['#64B5F680', '#81C78480'],
          // allowPointSelect: true,
          cursor: 'pointer',
          // dataLabels: {
          //   enabled: true,
          //   format: '<b>{point.percentage:.0f} %</b>',
          //   distance: -50,
          //   style: {
          //     textOutline: false,
          //     color: '#212121',
          //   },
          //   filter: {
          //     property: 'percentage',
          //     operator: '>',
          //     value: 4,
          //   },
          // },
          // showInLegend: true,
        },
      },
      series: valueExist ? [
        {
          type: 'pie',
          dataLabels: false,
          size: '50%',
          showInLegend: false,
          borderWidth: 0.5,
          borderColor: '#599EC0',
          data: [{
            name: 'IE',
            y: 7,
            color: '#599EC0',
          }],
          innerSize: '95%',
        },
        {
          innerSize: '60%',
          // borderWidth: 5,
          borderWidth: 0,
          data: [
            {
              name: `${departmentData}%`,
              y: departmentData,
              color: '#ADD3D6',
              pointPercent: clonedData.departmentValue,
              pointDescription: 'tooltip.common.text.9.1',
              legendText: intl.formatMessage({ id: 'tooltip.common.text.9.1' }),
              sliced: departmentData !== 100,
              dataLabels: {
                verticalAlign: 'top',
                enabled: true,
                connectorWidth: 1,
                distance: -20,
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
              name: `${companyData}%`,
              y: companyData,
              color: '#5FBBC2',
              pointPercent: clonedData.companyValue,
              pointDescription: 'tooltip.common.text.9.4',
              legendText: intl.formatMessage({ id: 'tooltip.common.text.9.4' }),
              dataLabels: {
                verticalAlign: 'top',
                enabled: true,
                connectorWidth: 1,
                distance: -25,
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

    // config.series = [
    //   {
    //     name: intl.formatMessage({ id: 'page.statistic.text.019' }),
    //     colorByPoint: true,
    //     data: _.map(clonedData.gsw, item => {
    //       return {
    //         name: getItemKey(item.key.en),
    //         y: item.count,
    //       }
    //     }),
    //   },
    // ]
    return <Fragment>
      <ReactHighcharts
        key={generate()}
        config={config}
        id="buyers-suppliers-count-pie-chart"
        ref="buyers-suppliers-count-pie-chart"
      />
    </Fragment>
  }

  renderSmallScaleLotsCountPieChart = (data, title, isFetching) => {
    const { intl } = this.context
    // if (_.isEmpty(data)) return <Loader isActive={isFetching} />

    data = _.orderBy(data, ['value'], ['desc'])
    // data = _.orderBy(data, ['name'], ['asc'])
    let amount = 0

    _.forEach(data, (item) => {
      amount += item.value
    })
    let series = [{
          innerSize: '60%',
          borderWidth: 0,
          data: [],
        }]
    // let series = !_.isEmpty(data) ? [
    //   {
    //     type: 'pie',
    //     dataLabels: false,
    //     size: '50%',
    //     showInLegend: false,
    //     borderWidth: 0.5,
    //     borderColor: '#599EC0',
    //     data: [{
    //       name: '',
    //       y: 7,
    //       color: '#599EC0',
    //     }],
    //     innerSize: '95%',
    //   }, {
    //     innerSize: '60%',
    //     borderWidth: 0,
    //     data: [],
    //   },
    // ] : []

    _.forEach(data, (it, index) => {
      let i18nCpv = _.find(this.props.translationI18nData.entries, { key: `complaint.status.${it.name}` })
      let translatedCpvName = !_.isEmpty(i18nCpv) ? (this.props.lang === 'en' ? i18nCpv.en : i18nCpv.ru) : ''

      let percent = it.value === 0 ? 0 : Math.round(((it.value / amount) * 100))
      // series[1].data.push({
      series[0].data.push({
        name: `${percent}%`,
        y: percent,
        color: HORIZONTAL_BAR_CHART_SECONDARY_COLORS[index],
        pointPercent: percent,
        pointDescription: 'item.description',
        legendText: translatedCpvName,
        // sliced: index > 0,
        sliced: false,
        dataLabels: {
          verticalAlign: 'top',
          enabled: true,
          connectorWidth: 1,
          // distance: -20,
          distance: 20,
          connectorColor: '#000000',
          style: {
            fontWeight: 600,
            fontSize: '18px',
            color: '#2A577F',
            textOutline: 0,
          },
        },
      })
    })

    let config = {
      chart: {
        height: 500,
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
        backgroundColor: 'transparent',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
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
      title: {
        text: intl.formatMessage({ id: 'page.statistic.text.019.2' }),
        margin: 50,
        align: 'left',
        style: {
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '28px',
          lineHeight: '41px',
          letterSpacing: '0.05em',
          color: '#FFFFFF',
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        formatter: function () {
          return this.point.legendText ? '<b>' + this.point.legendText + ': </b><br>'
            + intl.formatMessage({ id: 'tooltip.common.text.9.2' }) + ': ' + numeral(this.point.y).format('0') + ' ' + intl.formatMessage({ id: 'common.psc.text' }) + ' <br>'
            + intl.formatMessage({ id: 'tooltip.common.text.9.3' }) + ': ' + numeral(this.point.percentage).format('0') + '%' : false
        },
      },
      xAxis: {
        categories: ['A', 'B', 'C'],
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
        // layout: 'vertical',
        // backgroundColor: '#FFFFFF',
        // floating: true,
        // align: 'left',
        // verticalAlign: 'top',
        // x: 90,
        // y: 45,
        margin: 30,
        symbolHeight: 17,
        symbolWidth: 17,
        symbolRadius: 0,
        align: 'center',
        verticalAlign: 'bottom',
        y: -35,
        padding: 0,
        // itemMarginTop: 30,
        itemMarginBottom: 0,
        itemStyle: {
          color: '#FFFFFF',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '16px',
          // lineHeight: '24px',
          letterSpacing: '0.05em',
          // display: 'inline-block',
        },
        labelFormatter: function () {
          return this.legendText
        },
      },
      plotOptions: {
        pie: {
          // enableMouseTracking: false,
          // startAngle: 222,
          // slicedOffset: 10,
          dataLabels: {
            enabled: true,
          },
          showInLegend: true,
          colors: ['#64B5F680', '#81C78480'],
          allowPointSelect: true,
          cursor: 'pointer',
          // dataLabels: {
          //   enabled: true,
          //   format: '<b>{point.percentage:.0f} %</b>',
          //   distance: -50,
          //   style: {
          //     textOutline: false,
          //     color: '#212121',
          //   },
          //   filter: {
          //     property: 'percentage',
          //     operator: '>',
          //     value: 4,
          //   },
          // },
          // showInLegend: true,
        },
      },
      series: series,
    }

    return <ReactHighcharts
      key={generate()}
      config={config}
      id="SmallScaleLotsCountPieChart"
      ref="SmallScaleLotsCountPieChart"
    />
  }

  renderSmallScaleLotsCountBarChart = (data, title, isFetching) => {
    if (isFetching) return <Loader isActive={isFetching} />
    const { intl } = this.context

    let mockData = _.orderBy(this.props.statisticData.complaintStatuses, ['value'], ['desc'])
    mockData = _.map(mockData, (mock) => (mock.name))

    let clonedData = _.cloneDeep(data)
    // let colors = ['#81C78480', '#E5737390']
    let series = _.map(mockData, (mk, i) => {
      let i18nCpv = _.find(this.props.translationI18nData.entries, { key: `complaint.status.${mk}` })
      let translatedCpvName = !_.isEmpty(i18nCpv) ? (this.props.lang === 'en' ? i18nCpv.en : i18nCpv.ru) : ''
      let seriesOptions = {
        color: HORIZONTAL_BAR_CHART_SECONDARY_COLORS[i],
        name: translatedCpvName,
        data: [],
      }
      _.forEach(clonedData, (statusData) => {
        let stData = _.find(statusData.complaintStatuses, { name: mk })
        seriesOptions.data.push(stData ? stData.value : 0)
      })

      return seriesOptions
    })

    let config = {
      chart: {
        type: 'column',
        // height: 450,
        height: 500,
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
        backgroundColor: 'transparent',
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
      title: {
        text: title,
        margin: 50,
        align: 'left',
        style: {
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '28px',
          lineHeight: '41px',
          letterSpacing: '0.05em',
          color: '#FFFFFF',
        },
      },
      xAxis: {
        categories: _.map(clonedData, item => {
          return item.date
        }),
        labels: {
          formatter: function () {
            return this.value
          },
          style: {
            color: '#75BADC',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.05em',
          },
        },
      },
      yAxis: {
        gridLineColor: '#74B9DB',
        gridLineWidth: 1,
        gridZIndex: 4,
        labels: {
          // format: '{value:,.f}',
          formatter: function () {
            return this.value
          },
          style: {
            color: '#75BADC',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.05em',
          },
        },
        title: {
          text: intl.formatMessage({ id: 'page.common.text.34' }),
          style: {
            color: '#75BADC',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.05em',
          },
        },
        min: 0,
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.x + '</b><br/><b>'
            + this.series.name + '</b>: ' + numeral(this.point.y).format('0') + ' ' + intl.formatMessage({ id: 'common.psc.text' }) + '<br/><b>'
            + intl.formatMessage({ id: 'common.total.text' }) + '</b> ' + numeral(this.point.total).format('0') + ' ' + intl.formatMessage({ id: 'common.psc.text' })
        },
      },
      plotOptions: {
        series: {
          pointPlacement: 0,
          borderWidth: 0,
          pointStart: 0,
          marker: {
            radius: 0,
            states: {
              hover: {
                radius: 8,
                lineWidth: 5,
                lineWidthPlus: 10,
              },
            },
          },
        },
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
            color: 'grey',
          },
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        symbolHeight: 17,
        symbolWidth: 17,
        symbolRadius: 0,
        itemStyle: {
          color: '#FFFFFF',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '16px',
          lineHeight: '24px',
          letterSpacing: '0.05em',
        },
      },
      series: series,
      // series: _.map(clonedData, (parent, i) => {
      //   return {
      //     color: HORIZONTAL_BAR_CHART_SECONDARY_COLORS[i],
      //     name: parent.complaintStatuses[mockData[i].name],
      //     data: _.map(clonedData.dates, elm => {
      //       if (elm.values[i] === undefined) return 0
      //       return elm.values[i].count
      //     }),
      //   }
      // }),
    }

    return <ReactHighcharts
      key={generate()}
      config={config}
      id="SmallScaleLotsCountBarChart"
      ref="SmallScaleLotsCountBarChart"
    />
  }

  prepareBelarusMapData = data => {
    let preparedData = _.cloneDeep(data)
    preparedData = _.orderBy(preparedData, ['value'], ['desc'])

    return preparedData.map((item) => {
      return [item.name, item.value]
    })
  }
  prepareBelarusMapDict = data => {
    let preparedData = _.cloneDeep(data)
    return _.reduce(preparedData, function (obj, item) {
      obj[item.key.en] = item.key.ru
      return obj
    }, {})
  }

  prepareWorldMapData = data => {
    // let preparedData = _.cloneDeep(data)
    let preparedData = _.cloneDeep([{
      key: {
        en: 'RUS',
        ru: 'Российская Федерация',
        color: '#72BBDB',
      },
      suppliers: {
        count: 274,
      },
    }])

    return {
      data: () => {
        return data.map((item) => {
          return {
            code: item.code,
            value: item.value,
            color: '#72BBDB',
            name: item.name,
          }
        })
      },
      dictionary: () => {
        return data.reduce((obj, item) => (obj[item.code] = item.name, obj), {})
      },
    }
  }

  fetchData = (start, end, year) => {
    let dateRange = {
      dateFrom: year === 'last' ? moment().subtract('days', 365).format('YYYY-MM-DD') : moment(new Date(year)).startOf('year').format('YYYY-MM-DD'),
      dateTo: year === 'last' ? moment().format('YYYY-MM-DD') : moment(new Date(year)).endOf('year').format('YYYY-MM-DD'),
    }

    this.setState({
      yearSelected: year,
      timeValues: this.getTimeValues(dateRange),
    }, () => {
      // this.props.getAverages({ year: year })
      // this.props.getBuyersSuppliers({ year: year })
      // this.props.getClassAvgPerTopByContAmountRegTopCountAmountOKRB({ year: year })
      // this.props.getContComCountAmountDatesCompeCountAmountSuppSABAShare({ year: year })
      // this.props.getKPIsProcCContAContCPerSBSCount({ year: year })
      // this.props.getKPIsShareCompleteLotsLotsForSmallScaleBusinessGSWCount({ year: year })
      this.props.getStatisticData(dateRange)
    })
  }

  getTimeValues = (dateRange) => {
    let dateStart = moment(dateRange.dateFrom)
    let dateEnd = moment(dateRange.dateTo)
    let now = moment()
    let timeValues = []

    while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
      if (dateStart < now) {
        timeValues.push(dateStart.format('YYYY-MM'))
      }
      dateStart.add(1, 'month')
    }

    return timeValues
  }

  getLastThreeYears = () => {
    let options = []
    const { intl } = this.context
    for (let i = 0; i < 3; i++) {
      options.unshift({
        year: moment().subtract(i, 'year').format('YYYY'),
        startDate: moment().subtract(i + 1, 'year').format(),
        endDate: moment().subtract(i, 'year').format(),
      })
    }
    let res = _.map(options, item => {
      return { value: item.year, label: item.year }
    })
    res.push({ value: 'last', label: intl.formatMessage({ id: 'common.365.text' }) })
    return res
  }

  renderMiniKPIValue = (value, colorClass) => {
    return (
      <div>
        <div className="flex-item-p">
          <div className="flex-item-s">
            <div className="flex-item-t">
              <div className="flex-item-f">
                <strong>{value}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    // <div className={classnames('mini-kpi-value', colorClass)}>
    // {value}
    // </div>
  }

  renderSwitchCardInfoContent = (infoData) => {
    const { intl } = this.context

    return (
      <div className="switch-card-info-wrapper">
        <div className="switch-card-info-row">
          <span className="switch-card-info-bold-text">{intl.formatMessage({ id: 'page.common.text.39.1' })}: </span>
          <span className="switch-card-info-simple-text">{intl.formatMessage({ id: infoData.description })}</span>
        </div>
        <div className="switch-card-info-row">
          <span className="switch-card-info-bold-text">{intl.formatMessage({ id: 'page.common.text.39.2' })}: </span>
          <span className="switch-card-info-simple-text">{intl.formatMessage({ id: infoData.period })}</span>
        </div>
        <div className="switch-card-info-row">
          <span className="switch-card-info-bold-text">{intl.formatMessage({ id: 'page.common.text.39.7' })}: </span>
          <span className="switch-card-info-simple-text">{intl.formatMessage({ id: infoData.source })}</span>
        </div>
      </div>
    )
  }

  getCompetitionChartConfig = (data) => {
    const { intl } = this.context
    const { timeValues } = this.state

    let pieData = []
    let competitiveCount = 0
    let notCompetitiveCount = 0
    let amount = 0
    let valueExist = false

    let competitiveSeriesData = _.map(timeValues, monthName => {
        let valueByDate= _.find(data, { date: monthName })
        let value = valueByDate ? valueByDate.competitiveLotsAmount : 0
        if (value !== 0) {
          valueExist = true
        }

        return value
      })

    let notCompetitiveSeriesData = _.map(timeValues, monthName => {
      let valueByDate= _.find(data, { date: monthName })
      let value = valueByDate ? valueByDate.notCompetitiveLotsAmount : 0
      if (value !== 0) {
        valueExist = true
      }

      return value
    })

    _.forEach(data, (dt) => {
      competitiveCount += dt.competitiveLotsAmount
      notCompetitiveCount += dt.notCompetitiveLotsAmount
      amount += competitiveCount + notCompetitiveCount
    })

    for (let i = 0; i < 2; i++) {
      let competitivePercent = notCompetitiveCount === 0 ? 0 : Math.round(((notCompetitiveCount / amount) * 100))
      let notCompetitivePercent = 100 - competitivePercent
      let percent = (i === 0) ? competitivePercent : notCompetitivePercent

      pieData.push({
        // name: `${percent}%`,
        name: i === 0 ? intl.formatMessage({ id: 'page.statistic.text.043' }) : intl.formatMessage({ id: 'page.statistic.text.044' }),
        y: percent,
        // y: i === 0 ? notCompetitiveCount : competitiveCount,
        color: i === 0 ? '#5992C0' : '#ADD3D6',
        pointPercent: i === 0 ? competitiveCount : notCompetitiveCount,
        pointDescription: 'item.description',
        sliced: i > 0,
        dataLabels: {
          verticalAlign: 'top',
          enabled: true,
          connectorWidth: 1,
          distance: -18,
          connectorColor: '#000000',
          style: {
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '16px',
            color: '#FFFFFF',
          },
        },
      })
    }

    return {
      chart: {
        height: 550,
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
      },
      title: {
        // text: 'Конкуренция в завершенных лотах',
        text: intl.formatMessage({ id: 'page.common.text.37' }),
        style: {
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '28px',
          lineHeight: '41px',
          textAlign: 'center',
          letterSpacing: '0.05em',
          color: '#2A577F',
        },
      },
      xAxis: {
        // categories: _.map(data, 'date'),
        categories: _.map(timeValues, (monthName) =>(monthName)),
        labels: {
          style: {
            color: '#AFAFAF',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            textAlign: 'center',
            letterSpacing: '0.05em',
          },
        },
      },
      yAxis: {
        gridLineColor: '#CBCBCB',
        gridLineWidth: 1,
        lineColor: '#AFAFAF',
        lineWidth: 0,
        title: {
          // text: intl.formatMessage({ id: 'page.dashboard.text.04' }),
          text: intl.formatMessage({ id: 'page.common.text.38' }),
          style: {
            color: '#AFAFAF',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            letterSpacing: '0.05em',
          },
        },
        labels: {
          enabled: false,
        },
      },
      labels: {
        items: [{
          style: {
            left: '50px',
            top: '18px',
            color: (Highcharts.theme && Highcharts.theme.textColor) || 'black',
          },
        }],
      },
      credits: {
        enabled: false,
      },
      legend: {
        symbolHeight: 17,
        symbolWidth: 17,
        symbolRadius: 0,
        itemStyle: {
          color: '#2A577F',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '16px',
          lineHeight: '24px',
          letterSpacing: '0.05em',
        },
      },
      plotOptions: {
        pie: {
          enableMouseTracking: false,
          tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: 'kg',

          },
          startAngle: 254,
          slicedOffset: 10,
          dataLabels: {
            enabled: true,
          },
          showInLegend: false,
        },
      },
      series: valueExist ? [{
        tooltip: {
          pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:,.0f} ' + intl.formatMessage({ id: 'common.psc.text' }) + '</b><br/>',
        },
        color: '#5992C0',
        // borderColor: '#64B5F6',
        borderWidth: 0,
        type: 'column',
        name: intl.formatMessage({ id: 'page.statistic.text.043' }),
        data: competitiveSeriesData,
        // data: _.map(data, item => {
        //   return item.competitiveLotsAmount
        // }),
      }, {
        tooltip: {
          pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:,.0f} ' + intl.formatMessage({ id: 'common.psc.text' }) + '</b><br/>',
        },
        type: 'column',
        name: intl.formatMessage({ id: 'page.statistic.text.044' }),
        color: '#ADD3D6',
        // borderColor: '#64B5F6',
        borderWidth: 0,
        data: notCompetitiveSeriesData,
        // data: _.map(data, item => {
        //   return item.notCompetitiveLotsAmount
        // }),
      },
        {
          tooltip: {
            formatter: function () {
              return '<b>' + this.point.name + ': </b><br>' + intl.formatMessage({ id: 'page.statistic.text.065' }) + ': ' + numeral(this.point.y).format('0') + ' ' + intl.formatMessage({ id: 'common.psc.text' }) + ' <br>' + intl.formatMessage({ id: 'page.statistic.text.066' }) + ': ' + numeral(this.point.percentage).format('0') + '%'
            },
          },
          type: 'pie',
          // name: intl.formatMessage({ id: 'page.statistic.text.065' }),
          innerSize: '50%',
          // data: [
          //   {
          //   name: intl.formatMessage({ id: 'page.statistic.text.043' }),
          //   y: this.props.ContractsCompetetiveCountAmount.competitive.count,
          //   color: '#81C78480',
          // }, {
          //   name: intl.formatMessage({ id: 'page.statistic.text.044' }),
          //   y: this.props.ContractsCompetetiveCountAmount.uncompetitive.count,
          //   color: '#64B5F680',
          // }]
          data: pieData,
          //   [{
          //   name: '8%',
          //   y: 8,
          //   color: '#5992C0',
          //   pointPercent: 8,
          //   pointDescription: 'item.description',
          //   sliced: true,
          //   dataLabels: {
          //     verticalAlign: 'top',
          //     enabled: true,
          //     connectorWidth: 1,
          //     distance: -15,
          //     connectorColor: '#000000',
          //     style: {
          //       fontStyle: 'normal',
          //       fontWeight: 'bold',
          //       fontSize: '16px',
          //       color: '#FFFFFF',
          //     },
          //   },
          // },
          //   {
          //     name: '92%',
          //     y: 92,
          //     color: '#ADD3D6',
          //     pointPercent: 92,
          //     pointDescription: 'item.description',
          //     dataLabels: {
          //       verticalAlign: 'top',
          //       enabled: true,
          //       connectorWidth: 1,
          //       distance: -20,
          //       connectorColor: '#000000',
          //       style: {
          //         fontWeight: 600,
          //         fontSize: '16px',
          //         color: '#2A577F',
          //         textOutline: 0,
          //       },
          //     },
          //   }],
          center: [100, 30],
          size: 170,
          showInLegend: false,
          dataLabels: {
            enabled: true,
            style: {
              textOutline: false,
              color: '#434343',
            },
            format: '<b>{point.percentage:.0f} %</b>',
            distance: -15,
            filter: {
              property: 'percentage',
              operator: '>',
              value: 4,
            },
          },
        }] : [],
    }
  }

  getProcedureTypesSeries = (data, isFetching) => {
    if (_.isEmpty(data)) return <Loader isActive={isFetching} />

    const { timeValues } = this.state
    let areaColors = ['#2A527F', '#A8E2D1', '#72BBDB', '#3672A1', '#63D4B1', '#81908880', '#49586580']
    let valueExist = false
    let preparedSeries = []

    _.forEach(Object.keys(data), (seriesKey, index) => {
      let i18nCpv = _.find(this.props.translationI18nData.entries, { key: `procurementMethod.status.${seriesKey}` })
      let translatedCpvName = !_.isEmpty(i18nCpv) ? (this.props.lang === 'en' ? i18nCpv.en : i18nCpv.ru) : ''

      preparedSeries.push({
        name: translatedCpvName,
        data: _.map(timeValues, (monthName) => {
          let valueByDateAndSeriesKey = _.find(data[seriesKey], { date: monthName })
          let value = valueByDateAndSeriesKey ? valueByDateAndSeriesKey.value : 0
          if (value !== 0) {
            valueExist = true
          }

          return value
        }),
        color: areaColors[index],
        // color: index === 0 ? {
        //   linearGradient: {
        //     x1: 0,
        //     x2: 0,
        //     y1: 0,
        //     y2: 1,
        //   },
        //   stops: [
        //     [0, areaColors[index]],
        //     [1, '#489eae80'],
        //   ],
        // } : areaColors[index],
      })
    })

    return valueExist ? preparedSeries : []

    // let series = {}
    // const getItemKey = (inf) => {
    //   if (this.props.lang === 'ru') {
    //     return inf
    //   } else {
    //     if (inf === 'Аукцион') {
    //       return 'Auction'
    //     } else if (inf === 'Открытый конкурс') {
    //       return 'Open tender'
    //     } else if (inf === 'Открытый конкурс в электронном виде') {
    //       return 'Electronic open tender'
    //     } else if (inf === 'Иной вид процедуры закупки') {
    //       return 'Other types of procedures'
    //     } else {
    //       return 'Construction-related procurement'
    //     }
    //   }
    // }
    // _.forEach(this.props.procedureTypesContractsAmount, item => {
    //   _.forEach(item.values, value => {
    //     if (!_.includes(_.keys(series), value.key.ru)) {
    //       series[value.key.ru] = []
    //     }
    //     series[value.key.ru].push(value.amount)
    //   })
    // })
    // return _.map(Object.keys(series), (seriesName, index) => {
    //     return {
    //       name: getItemKey(seriesName),
    //       data: series[seriesName],
    //
    //       color: index === 0 ? {
    //         linearGradient: {
    //           x1: 0,
    //           x2: 0,
    //           y1: 0,
    //           y2: 1,
    //         },
    //         stops: [
    //           [0, areaColors[index]],
    //           [1, '#489eae80'],
    //         ],
    //       } : areaColors[index],
    //     }
    //   },
    // )
  }

  render() {
    const { intl } = this.context
    const { statisticData, statisticDataIsFetching } = this.props
    // console.log('-=statisticData=-', statisticData)
    // !_.isEmpty(statisticData) && _.forEach(Object.keys(statisticData), (key) => (console.log(key)))

    return (
      <div className="Statistic">
        {/*<div className="row">*/}
        {/*  <div className="col-md-12">*/}
        {/*    <div className="range-selector">*/}
        {/*      <DropdownMenu*/}
        {/*        type="text"*/}
        {/*        menuDirection="bottom"*/}
        {/*        placeholder="placeholder"*/}
        {/*        selectedOption={this.getLastThreeYears().find(item => item.value === this.state.yearSelected)}*/}
        {/*        onSelect={this.fetchData}*/}
        {/*        options={this.getLastThreeYears()}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <DateSelector onClick={(start, end, year) => this.fetchData(start, end, year)} />
        <div className="row">
          <Card cardFluid className="col-sm-12 col-md-12 col-lg-6 col-xl-3 mobile-top-margin margin-top-12"
                cardClass="h-100 grad-card-chart-wrapper">
            {
              this.renderChartGradMini(
                statisticData.hasOwnProperty('publishedTendersCount') ? {
                  value: statisticData.publishedTendersCount ? statisticData.publishedTendersCount : 0,
                  dates: statisticData.publishedTendersCountByMonth,
                } : [],
                intl.formatMessage({ id: 'page.common.text.20' }),
                'kpi-procedures-count',
                'count',
                statisticDataIsFetching,
              )
            }
          </Card>
          <Card cardFluid className="col-sm-12 col-md-12 col-lg-6 col-xl-3 mobile-top-margin margin-top-12"
                cardClass="h-100 grad-card-chart-wrapper">
            {
              this.renderChartGradMini(
                statisticData.hasOwnProperty('completedLotsAmount') ? {
                  value: statisticData.completedLotsAmount ? statisticData.completedLotsAmount : 0,
                  dates: statisticData.completedLotsAmountByMonth,
                } : [],
                intl.formatMessage({ id: 'page.common.text.21' }),
                'kpi-contracts-amount',
                'amount',
                statisticDataIsFetching,
              )
            }
          </Card>
          <Card cardFluid className="col-sm-12 col-md-12 col-lg-6 col-xl-3 mobile-top-margin margin-top-12"
                cardClass="h-100 grad-card-chart-wrapper">
            {
              this.renderChartGradMini(
                statisticData.hasOwnProperty('avgLotsCountPerSupplier') ? {
                  value: statisticData.avgLotsCountPerSupplier ? statisticData.avgLotsCountPerSupplier : 0,
                  dates: statisticData.avgLotsCountPerSupplierByMonth,
                } : [],
                intl.formatMessage({ id: 'page.common.text.22' }),
                'kpi-contracts-amount-avg-per-supplier',
                'avg',
                statisticDataIsFetching,
              )
            }
          </Card>
          <Card cardFluid className="col-sm-12 col-md-12 col-lg-6 col-xl-3 mobile-top-margin margin-top-12"
                cardClass="h-100 grad-card-chart-wrapper">
            {
              this.renderChartGradMini(
                statisticData.hasOwnProperty('completedLotsPercentage') ? {
                  value: statisticData.completedLotsPercentage ? statisticData.completedLotsPercentage : 0,
                  dates: statisticData.completedLotsPercentageByMonth,
                } : [],
                intl.formatMessage({ id: 'page.common.text.23' }),
                'kpi-lots-completed-share',
                'share',
                statisticDataIsFetching,
              )
            }
          </Card>
        </div>
        <div className="row margin-top-30">
          <div className="col-md-12 slider-wrapper slider-kpis-wrapper p-0">
            {statisticDataIsFetching ? <Loader isActive={statisticDataIsFetching} /> :
              <Card className="col h-100" cardClass="slider-chart h-100 custom-background-color">
                {this.renderDatesBuyersAvgContractsChart(
                  statisticData.hasOwnProperty('buyersActivity') ? statisticData.buyersActivity : [],
                  intl.formatMessage({ id: 'page.statistic.text.008' }),
                  statisticDataIsFetching,
                )}
              </Card>
            }
            {/*<Slider {...{*/}
            {/*  className: 'h-100',*/}
            {/*  dots: false,*/}
            {/*  infinite: true,*/}
            {/*  speed: 500,*/}
            {/*  slidesToScroll: 1,*/}
            {/*}}>*/}
            {/*  <Card className="col h-100" cardClass="slider-chart h-100 custom-background-color">*/}
            {/*    {this.renderDatesBuyersAvgContractsChart(*/}
            {/*      this.props.datesBuyersAvgContracts,*/}
            {/*      intl.formatMessage({ id: 'page.statistic.text.008' }),*/}
            {/*      this.props.datesBuyersAvgContractsIsFetching,*/}
            {/*    )}*/}
            {/*  </Card>*/}
            {/*  <Card className="col" cardClass="slider-chart custom-background-color">*/}
            {/*    {this.renderKpiBuyersSuppliersCountChart(*/}
            {/*      this.props.kpiBuyersSuppliersCount,*/}
            {/*      intl.formatMessage({ id: 'page.statistic.text.005' }),*/}
            {/*      this.props.kpiBuyersSuppliersCountIsFetching,*/}
            {/*    )}*/}
            {/*  </Card>*/}
            {/*</Slider>*/}
          </div>
        </div>
        <div className="row margin-top-30">
          <Card className="col-sm-12 col-md-12 col-lg-6 col-xl-6 home-cards dark-theme"
                cardClass="d-flex flex-row mini-kpi h-100">

            {
              !statisticData.hasOwnProperty('completedLotsCountPer10SuppliersPercent') ?
                <Loader isActive={statisticDataIsFetching} theme={'light'} /> :
                <Fragment>
                  <div className="flex-container">
                    {this.renderMiniKPIValue(numeral(statisticData.completedLotsCountPer10SuppliersPercent).format('0.') + '%',
                      'color-madang')}
                  </div>
                  <span className="home-cards-text mobile-margin-lr"><FormattedMessage
                    id="page.common.text.24" /></span>
                </Fragment>
            }
            {/*<Divider borderBottom={0} borderLeft={'1px solid #E9EDF2'} marginLeft={15} width={1} />*/}
          </Card>

          <Card className="col-sm-12 col-md-12 col-lg-6 col-xl-6 home-cards dark-theme"
                cardClass="d-flex flex-row mini-kpi h-100">
            {
              !statisticData.hasOwnProperty('completedLotsAmountPer10SuppliersPercent') ?
                <Loader isActive={statisticDataIsFetching} theme={'light'} /> :
                <Fragment>
                  <div className="flex-container">
                    {this.renderMiniKPIValue(numeral(statisticData.completedLotsAmountPer10SuppliersPercent).format('0.') + '%',
                      'color-madang')}
                  </div>
                  <span className="home-cards-text mobile-margin-lr"><FormattedMessage
                    id="page.common.text.25" /></span>
                </Fragment>
            }
            {/*<Divider borderBottom={0} borderLeft={'1px solid #E9EDF2'} marginLeft={15} width={1} />*/}
          </Card>
        </div>

        <div className="row  margin-top-30">
          {
            (!statisticData.hasOwnProperty('departmentEnquiriesCountByMonth') && !statisticData.hasOwnProperty('companyEnquiriesCountByMonth')) ?
              <Loader isActive={statisticDataIsFetching} theme={'light'} /> :
              <CardContentSwitch
                className="col-sm-12 col-md-12 col-lg-12 col-xl-6 mobile-top-margin"
                cardClass="switch-card-wrapper h-100"
                defaultChildren={this.renderGswAreaStackedChart(statisticData, statisticDataIsFetching)}
                // childrenInfo={<CardInfo info={CARDS_DESCRIPTIONS.gswDistribution} />}
                childrenInfo={<CardInfo
                  info={this.renderSwitchCardInfoContent(CARDS_DESCRIPTIONS.gswDistribution.infoData)} />}
                childrenChart={this.renderGswPieChart(
                  {
                    departmentValue: statisticData.departmentEnquiriesCount ? statisticData.departmentEnquiriesCount : 0,
                    companyValue: statisticData.companyEnquiriesCount ? statisticData.companyEnquiriesCount : 0,
                  },
                  // this.props.kpiContractsGswCount,
                  statisticDataIsFetching,
                )}
              />
          }
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-6">
            <div className="row mini-kpi-row">
              <Card className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mobile-top-margin home-cards dark-theme"
                    cardClass="d-flex flex-row mini-kpi h-100">
                {
                  !statisticData.hasOwnProperty('avgEnquiriesCount') ?
                    <Loader isActive={statisticDataIsFetching} theme={'light'} /> :
                    <Fragment>
                      <div className="flex-container-column">
                        {this.renderMiniKPIValue(numeral(statisticData.avgEnquiriesCount).format('0.'),
                          'color-madang')}
                        <span className="home-cards-text mobile-margin-lr"><FormattedMessage
                          id="page.common.text.26" /></span>
                      </div>
                    </Fragment>
                }
                {/*<Divider borderBottom={0} borderLeft={'1px solid #E9EDF2'} marginLeft={15} width={1} />*/}
              </Card>
              <Card className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mobile-top-margin home-cards dark-theme"
                    cardClass="d-flex flex-row mini-kpi h-100">
                {
                  !statisticData.hasOwnProperty('avgBuyerCpvCount') ?
                    <Loader isActive={statisticDataIsFetching} theme={'light'} /> :
                    <Fragment>
                      <div className="flex-container-column">
                        {this.renderMiniKPIValue(numeral(statisticData.avgBuyerCpvCount).format('0.'),
                          'color-madang')}
                        <span className="home-cards-text mobile-margin-lr"><FormattedMessage
                          id="page.common.text.27" /></span>
                      </div>
                    </Fragment>
                }
                {/*<Divider borderBottom={0} borderLeft={'1px solid #E9EDF2'} marginLeft={15} width={1} />*/}
              </Card>
            </div>
            <div className="row margin-top-30 mini-kpi-row">
              <Card className="col-sm-12 col-md-12 col-lg-6 col-xl-6 home-cards dark-theme"
                    cardClass="d-flex flex-row mini-kpi h-100">
                {
                  !statisticData.hasOwnProperty('avgTendersCount') ?
                    <Loader isActive={statisticDataIsFetching} theme={'light'} /> :
                    <Fragment>
                      <div className="flex-container-column">
                        {this.renderMiniKPIValue(
                          this.props.lang === 'en' ? numeral(statisticData.avgTendersCount).format('0.0a') : numeral(statisticData.avgTendersCount / 1000).format('0.0'),
                          'color-madang')}
                        <span className="home-cards-text mobile-margin-lr"><FormattedMessage
                          id="page.common.text.28" /></span>
                      </div>
                    </Fragment>
                }
                {/*<Divider borderBottom={0} borderLeft={'1px solid #E9EDF2'} marginLeft={15} width={1} />*/}
              </Card>
              <Card className="col-sm-12 col-md-12 col-lg-6 col-xl-6 home-cards dark-theme"
                    cardClass="d-flex flex-row mini-kpi h-100">
                {
                  !statisticData.hasOwnProperty('repeatedTendersPercentage') ?
                    <Loader isActive={statisticDataIsFetching} theme={'light'} /> :
                    <Fragment>
                      <div className="flex-container-column">
                        {this.renderMiniKPIValue(numeral(statisticData.repeatedTendersPercentage).format('0.') + '%',
                          'color-madang')}
                        <span className="home-cards-text mobile-margin-lr"><FormattedMessage
                          id="page.common.text.29" /></span>
                      </div>
                    </Fragment>
                }
                {/*<Divider borderBottom={0} borderLeft={'1px solid #E9EDF2'} marginLeft={15} width={1} />*/}
              </Card>
            </div>
          </div>
        </div>
        <div className="row margin-top-30">
          {
            !statisticData.hasOwnProperty('complaintStatuses') ?
              <Loader isActive={statisticDataIsFetching} theme={'light'} /> :
              <CardContentSwitch
                className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mobile-top-margin margin-top-30"
                cardClass="switch-card-wrapper h-100"
                defaultChildren={this.renderSmallScaleLotsCountPieChart(
                  statisticData.complaintStatuses,
                  intl.formatMessage({ id: 'page.statistic.text.023' }),
                  statisticDataIsFetching,
                )}
                // childrenInfo={<CardInfo info={CARDS_DESCRIPTIONS.mmBusinessLots} />}
                childrenInfo={<CardInfo
                  info={this.renderSwitchCardInfoContent(CARDS_DESCRIPTIONS.mmBusinessLots.infoData)} />}
                childrenChart={this.renderSmallScaleLotsCountBarChart(
                  statisticData.complaintStatusesByMonth,
                  intl.formatMessage({ id: 'page.statistic.text.019.2' }),
                  statisticDataIsFetching,
                )}
              />
          }
          {
            !statisticData.hasOwnProperty('top5QualificationRequirements') ?
              <Loader isActive={statisticDataIsFetching} theme={'light'} /> :
              <CardContentSwitch
                className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mobile-top-margin margin-top-30"
                cardClass="switch-card-wrapper h-100"
                defaultChildren={this.renderSmallScaleBarChart(
                  statisticData.top5QualificationRequirements,
                )}
                // childrenInfo={<CardInfo info={CARDS_DESCRIPTIONS.mmBusinessContractsAmount} />}
                childrenInfo={<CardInfo
                  info={this.renderSwitchCardInfoContent(CARDS_DESCRIPTIONS.mmBusinessContractsAmount.infoData)} />}
                childrenChart={this.renderSmallScalePieChart(
                  statisticData.qualificationRequirementsDistribution,
                  '',
                  statisticDataIsFetching,
                )}
              />
          }
        </div>
        <div className="row margin-top-30">
          <div className="col-md-12 slider-wrapper slider-kpis-wrapper slider-mini-kpis-wrapper p-0">
            {
              statisticDataIsFetching ?
                <Loader isActive={statisticDataIsFetching} /> :
                <Slider {...{
                  dots: false,
                  infinite: true,
                  speed: 500,
                  slidesToScroll: 1,
                  slidesToShow: 3,
                  responsive: [
                    {
                      breakpoint: 1024,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        infinite: true,
                        dots: true,
                      },
                    },
                    {
                      breakpoint: 600,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        initialSlide: 1,
                      },
                    },
                  ],
                }}>
                  {
                    this.renderRegionTopCards(statisticData.mostPopularCPVsByCount, 'count')
                  }
                </Slider>
            }
          </div>
        </div>
        <div className="row margin-top-30">
          <div className="col-md-12 slider-wrapper slider-kpis-wrapper slider-mini-kpis-wrapper p-0">
            {
              statisticDataIsFetching ?
                <Loader isActive={statisticDataIsFetching} /> :
                <Slider {...{
                  dots: false,
                  infinite: true,
                  speed: 500,
                  slidesToScroll: 1,
                  slidesToShow: 3,
                  responsive: [
                    {
                      breakpoint: 1024,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        infinite: true,
                        dots: true,
                      },
                    },
                    {
                      breakpoint: 600,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        initialSlide: 1,
                      },
                    },
                  ],
                }}>
                  {
                    this.renderRegionTopCards(statisticData.mostPopularCPVsByAmount, 'amount')
                  }
                </Slider>
            }
          </div>
        </div>
        <div className="row margin-top-30">
          <div className="col-md-12 slider-wrapper slider-kpis-wrapper p-0">
            <Slider {...{
              dots: false,
              infinite: true,
              speed: 500,
            }}>
              <div className="d-flex">
                <Card className="col-sm-12 col-md-7" cardClass="h-100 custom-background-color no-box-shadow">
                  {
                    statisticDataIsFetching ?
                      <Loader isActive={statisticDataIsFetching} /> :
                      !_.isEmpty(statisticData.buyerGeography) &&
                      // <BelarusMap data={this.prepareBelarusMapData(this.props.buyersRegionsBuyersCount)}
                      //             pureData={this.props.buyersRegionsBuyersCount}
                      //             countriesDict={this.prepareBelarusMapDict(this.props.buyersRegionsBuyersCount)}
                      //             lang={this.props.lang} />
                      <KyrgyzstanMap data={this.prepareBelarusMapData(statisticData.buyerGeography)}
                                     pureData={statisticData.buyerGeography}
                                     title={intl.formatMessage({ id: 'page.statistic.text.006.1' })}
                                     height={690}
                                     changeOnHover={false}
                        // countriesDict={this.prepareBelarusMapDict(statisticData.buyerGeography)}
                                     lang={this.props.lang}
                                     tooltipTranslateKey="page.statistic.text.006"
                      />
                  }
                </Card>
                <div className="col-md-5 d-none d-md-block d-lg-block">
                  <div className="row">
                    <Card className="col-sm-12" cardClass="custom-background-color no-box-shadow no-padding-tb">
                      {
                        statisticDataIsFetching ?
                          <Loader isActive={statisticDataIsFetching} /> :
                          <SuppliersResidencyPieChart
                            data={statisticData.residentSuppliersCount > statisticData.nonResidentSuppliersCount ? {
                              resident: statisticData.residentSuppliersCount,
                              non_resident: statisticData.nonResidentSuppliersCount,
                            } : {
                              non_resident: statisticData.nonResidentSuppliersCount,
                              resident: statisticData.residentSuppliersCount,
                            }}
                            lang={this.props.lang} />
                      }
                    </Card>
                  </div>
                  <div className="row margin-top-30">
                    <Card className="col-sm-12" cardClass="custom-background-color no-box-shadow no-padding-tb">
                      {
                        statisticDataIsFetching ?
                          <Loader isActive={statisticDataIsFetching} /> :
                          <BuyersCapitalBuyersPieChart
                            data={{
                              capital: statisticData.capitalBuyersCount,
                              non_capital: statisticData.nonCapitalBuyersCount,
                            }}
                            lang={this.props.lang} />
                      }
                    </Card>
                  </div>
                </div>
              </div>
              <Card className="col-md-12" cardClass="h-100 custom-background-color no-box-shadow">
                {
                  statisticDataIsFetching ?
                    <Loader isActive={statisticDataIsFetching} /> :
                    !_.isEmpty(statisticData.supplierGeography) &&
                    <WorldMap
                      data={this.prepareWorldMapData(statisticData.supplierGeography).data()}
                      countriesDict={this.prepareWorldMapData(statisticData.supplierGeography).dictionary()}
                      lang={this.props.lang}
                    />
                }
              </Card>
            </Slider>
          </div>
        </div>
        <div className="row margin-top-30">
          <div className="col-md-12 slider-wrapper slider-chart-wrapper p-0">
            <Slider {...{
              dots: false,
              infinite: true,
              speed: 500,
              slidesToScroll: 1,
            }}>
              <Card className="col h-100"
                    cardClass="slider-chart h-100 chart-mobile-header custom-background-color no-box-shadow">
                {/*<h4><FormattedMessage id="page.statistic.text.041" /></h4>*/}
                {
                  statisticDataIsFetching ?
                    <Loader isActive={statisticDataIsFetching} /> :
                    <ReactHighcharts
                      key={generate()}
                      config={this.getCompetitionChartConfig(statisticData.competition)}
                      id="buyers-suppliers-count-pie-chart"
                      ref="buyers-suppliers-count-pie-chart"
                    />
                }
              </Card>
              {
                statisticDataIsFetching ?
                  <Loader isActive={statisticDataIsFetching} /> :
                  <Card className="col h-100"
                        cardClass="slider-chart h-100 chart-mobile-header custom-background-color no-box-shadow">
                    {/*<h4><FormattedMessage id="page.statistic.text.040" /></h4>*/}
                    <ReactHighcharts
                      key={generate()}
                      config={{
                        chart: {
                          type: 'area',
                          style: {
                            fontFamily: 'Oswald', //'Open Sans'
                          },
                          height: 550,
                          backgroundColor: 'transparent',
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
                        // colors: ['#64B5F680', '#81C78480', '#E5737380', '#FFB74D80', '#81908880', '#81908880', '#49586580'],
                        colors: ['#64B5F680', '#81C78480', '#E5737380', '#FFB74D80', '#81908880', '#81908880', '#49586580'],
                        credits: {
                          enabled: false,
                        },
                        title: {
                          text: intl.formatMessage({ id: 'page.common.text.58' }),
                          style: {
                            fontStyle: 'normal',
                            fontWeight: '600',
                            fontSize: '28px',
                            lineHeight: '41px',
                            textAlign: 'center',
                            letterSpacing: '0.05em',
                            color: '#2A577F',
                          },
                        },
                        legend: {
                          symbolHeight: 17,
                          symbolWidth: 17,
                          symbolRadius: 0,
                          itemStyle: {
                            color: '#2A577F',
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontSize: '16px',
                            lineHeight: '24px',
                            letterSpacing: '0.05em',
                          },
                        },
                        xAxis: {
                          // categories: _.map(this.props.procedureTypesContractsAmount, item => {
                          categories: _.map(this.state.timeValues, monthName => {
                            return monthName
                          }),
                          tickmarkPlacement: 'on',
                          labels: {
                            style: {
                              color: '#AFAFAF',
                              fontStyle: 'normal',
                              fontWeight: 'normal',
                              fontSize: '16px',
                              lineHeight: '24px',
                              textAlign: 'center',
                              letterSpacing: '0.05em',
                            },
                          },
                          title: {
                            enabled: false,
                          },
                        },
                        yAxis: {
                          gridLineColor: '#AFAFAF',
                          gridLineWidth: 1,
                          gridZIndex: 4,
                          labels: {
                            format: '{value:,.0f}',
                            style: {
                              color: '#AFAFAF',
                              fontStyle: 'normal',
                              fontWeight: 'normal',
                              fontSize: '16px',
                              lineHeight: '24px',
                              textAlign: 'right',
                              letterSpacing: '0.05em',
                            },
                          },
                          title: {
                            text: intl.formatMessage({ id: 'page.statistic.text.046' }),
                            style: {
                              color: '#AFAFAF',
                              fontStyle: 'normal',
                              fontWeight: 'normal',
                              fontSize: '16px',
                              lineHeight: '24px',
                              letterSpacing: '0.05em',
                            },
                          },
                        },
                        tooltip: {
                          pointFormat: '<span style="color:{series.color}">\u25CF</span><span><b>{series.name}</b></span>: {point.y:,.0f} ' + intl.formatMessage({ id: 'common.byn.text' }) + '<br/>',
                          shared: true,
                        },
                        plotOptions: {
                          series: {
                            fillOpacity: 1,
                          },
                          area: {
                            // stacking: 'percent',
                            // lineColor: '#AFAFAF',
                            // lineWidth: 1,
                            marker: {
                              enabled: false,
                              lineWidth: 1,
                              lineColor: '#ffffff',
                            },
                          },
                        },
                        series: this.getProcedureTypesSeries(statisticData.procurementMethodDistribution, statisticDataIsFetching),
                      }}
                      id="buyers-suppliers-count-pie-chart"
                      ref="buyers-suppliers-count-pie-chart"
                    />
                  </Card>
              }
            </Slider>
          </div>
        </div>
        <div className="row margin-top-30">
          <Card cardFluid className="col-md-6" cardClass="h-100 custom-background-color no-box-shadow">
            {
              statisticDataIsFetching ?
                <Loader isActive={statisticDataIsFetching} /> :
                this.renderClassificationTopByContractTable()
            }
          </Card>
          <Card cardFluid className="col-md-6" cardClass="h-100 custom-background-color no-box-shadow">
            {
              statisticDataIsFetching ?
                <Loader isActive={statisticDataIsFetching} /> :
                this.renderBuyersCompetitiveTopByContractTable()
            }
          </Card>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({
                           statisticState,
                           locale,
                           statisticDataStore,
                           dashboard,
                         }) => {
  return {

    kpiProceduresCount: statisticState.kpiProcCca.kpiProceduresCount,
    kpiContractsAmount: statisticState.kpiProcCca.kpiContractsAmount,
    kpiContractsAmountAvgPerSupplier: statisticState.kpiProcCca.kpiContractsCountPerSupplier,
    kpiLotsCompletedShare: statisticState.kpiShareCompLlfs.kpiShareCompleteLots,

    datesBuyersAvgContracts: statisticState.contComCount.contractsPerBuyerCountAmount,
    kpiBuyersSuppliersCount: statisticState.kpiProcCca.kpiBuyersSuppliersCount,

    topTenSuppliersByContractCount: statisticState.buyersSuppliers.top10SuppliersShareByContractCount,
    topTenSuppliersByContractAmount: statisticState.buyersSuppliers.top10SuppliersShareByContractAmount,

    smallScaleSuppliersContractsAmount: statisticState.buyersSuppliers.suppliersByScaleAmount,
    smallScaleSuppliersContractsAmountIsFetching: statisticState.buyersSuppliers.suppliersByScaleAmount,

    enquiriesAvgPerProcedure: statisticState.averages.enquiriesPerProcedure,
    avgPerBuyerSupplier: statisticState.classAvgPer.classificationAvgPerBuyer,
    classAvgPerIsFetching: statisticState.classAvgPerIsFetching,
    proceduresCountPerMonth: statisticState.averages.proceduresCountPerMonth,
    contractBudgetAmountShare: statisticState.contComCount.budgetAmountShare,

    okrbRegionTopAmount: statisticState.classAvgPer.regionsWithTopAmountOKRB,
    okrbRegionTopCount: statisticState.classAvgPer.regionsWithTopCountOKRB,

    buyersRegionsCapitalCount: statisticState.buyersSuppliers.buyersCapitalBuyerCount,
    buyersRegionsBuyersCount: statisticState.buyersSuppliers.buyersRegionBuyerCount,
    suppliersRegionsSuppliersCount: statisticState.buyersSuppliers.suppliersCountriesSuppliersCount,

    classificationTopByContractAmount: statisticState.classAvgPer.topOKRBByContractsAmount,
    buyersCompetitiveTopByContractAmount: statisticState.buyersSuppliers.topCompetitiveBuyersByContractsAmount,

    datesContractsCompetitiveCountAmount: statisticState.contComCount.datesContractsCompetitiveCountAmount,
    procedureTypesContractsAmount: statisticState.contComCount.procedureTypesContractsAmount,

    kpiContractsGswCount: statisticState.kpiShareCompLlfs.kpiGSWCount,
    smallScaleBusinessLotsCount: statisticState.kpiShareCompLlfs.kpiLotsForSmallScaleBusiness,
    suppliersResidencyCount: statisticState.buyersSuppliers.residencyDistribution,
    ContractsCompetetiveCountAmount: statisticState.contComCount.contractsCompetitiveCountAmount,

    kpiProcCca: statisticState.kpiProcCca,
    kpiProcCcaIsFetching: statisticState.kpiProcCcaIsFetching,

    kpiShareCompLlfs: statisticState.kpiShareCompLlfs,
    kpiShareCompLlfsIsFetching: statisticState.kpiShareCompLlfsIsFetching,

    contComCount: statisticState.contComCount,
    contComCountIsFetching: statisticState.contComCountIsFetching,

    buyersSuppliers: statisticState.buyersSuppliers,
    buyersSuppliersIsFetching: statisticState.buyersSuppliersIsFetching,

    averages: statisticState.averages,
    averagesIsFetching: statisticState.averagesIsFetching,

    classAvgPer: statisticState.classAvgPer,
    lang: locale.lang,

    //////////////////////////
    statisticData: statisticDataStore.statisticData,
    statisticDataIsFetching: statisticDataStore.statisticDataIsFetching,
    translationI18nData: dashboard.translationI18nData,

  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getAverages: bindActionCreators(getAverages, dispatch),
    getBuyersSuppliers: bindActionCreators(getBuyersSuppliers, dispatch),
    getClassAvgPerTopByContAmountRegTopCountAmountOKRB: bindActionCreators(getClassAvgPerTopByContAmountRegTopCountAmountOKRB, dispatch),
    getContComCountAmountDatesCompeCountAmountSuppSABAShare: bindActionCreators(getContComCountAmountDatesCompeCountAmountSuppSABAShare, dispatch),
    getKPIsProcCContAContCPerSBSCount: bindActionCreators(getKPIsProcCContAContCPerSBSCount, dispatch),
    getKPIsShareCompleteLotsLotsForSmallScaleBusinessGSWCount: bindActionCreators(getKPIsShareCompleteLotsLotsForSmallScaleBusinessGSWCount, dispatch),

    changeLocation: bindActionCreators(changeLocation, dispatch),
    setCurrentLocation: bindActionCreators(setCurrentLocation, dispatch),
    getStatisticData: bindActionCreators(getStatisticData, dispatch),
    setCurrentRoute: bindActionCreators(setCurrentRoute, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StatisticPage)
