import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as numeral from 'numeral'
import { generate } from 'shortid'
import _ from 'lodash'
import moment from 'moment'

import ReactHighcharts from 'react-highcharts'
import addNoDataModule from 'highcharts/modules/no-data-to-display'

import {
  getRegionsCompetitivityProcurement,
  getRegionsTopProcurement,
  getLocality,
  getWhatToBuyRegionsData,
} from '../../store/stories/buyRegion/actions'

import Loader from '../loader/Loader'
import DateSelector from '../dateSelector/DateSelector'
import SlideArrow from '../slideArrow/SlideArrow'

import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import './StoryWhatToBuy.scss'
import { setCurrentRoute } from '../../store/navigation/NavActions'

const REGIONS = [
  {
    ruTemp: 'Бишкек',
    ru: 'Бишкек',
    en: 'Bishkek',
    ky: 'Бишкек',
    key: 'kg-gb',
  },
  {
    ruTemp: 'Ош',
    ru: 'Ош',
    en: 'Osh',
    ky: 'Ош',
    key: 'kg-oh',
  },
  {
    ruTemp: 'Ошская Область',
    ru: 'Ошская Область',
    en: 'Osh region',
    ky: 'Ош областы',
    key: 'kg-os',
  },
  {
    ruTemp: 'Баткенская Область',
    ru: 'Баткенская Область',
    en: 'Batken region',
    ky: 'Баткен областы',
    key: 'kg-ba',
  },
  {
    ruTemp: 'Таласская Область',
    ru: 'Таласская Область',
    en: 'Talas region',
    ky: 'Талас областы',
    key: 'kg-tl',
  },
  {
    ruTemp: 'Джалал-Абадская Область',
    ru: 'Джалал-Абадская Область',
    en: 'Jalal-Abad region',
    ky: 'Жалал-Абад областы',
    key: 'kg-da',
  },
  {
    ruTemp: 'Чуйская Область',
    ru: 'Чуйская Область',
    en: 'Chuy region',
    ky: 'Чүй областы',
    key: 'kg-834',
  },
  {
    ruTemp: 'Иссык-Кульская Область',
    ru: 'Иссык-Кульская Область',
    en: 'Ysyk-Köl region',
    ky: 'Ысык-Көл областы',
    key: 'kg-yk',
  },
  {
    ruTemp: 'Нарынская Область',
    ru: 'Нарынская Область',
    en: 'Naryn region',
    ky: 'Нарын областы',
    key: 'kg-na',
  },
]

class StoryWhatToBuy extends React.Component {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    if (ReactHighcharts.Highcharts) {
      addNoDataModule(ReactHighcharts.Highcharts)
    }

    let dateRange = {
      dateFrom: moment().subtract('days', 365).format('YYYY-MM-DD'),
      dateTo: moment().format('YYYY-MM-DD'),
    }

    this.state = {
      yearSelected: 'last',
      dateRange: dateRange,
      selectedRegion: null,
    }
    props.setCurrentRoute('/dashboard/what-to-buy-in-your-region')
    // this.props.getLocality()
    // this.props.getRegionsTopProcurement({ year: 'last' })
    // this.props.getRegionsCompetitivityProcurement({ year: 'last' })
    // this.props.getWhatToBuyRegionsData( moment().format('YYYY'))
    this.props.getWhatToBuyRegionsData(dateRange)

  }

  componentDidMount() {
    // this.props.getLocality()
  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   if (!_.isEqual(this.props.regionsCompetitivityProcurement, nextProps.regionsCompetitivityProcurement)) return true
  //   if (!_.isEqual(this.props.regionsTopProcurement, nextProps.regionsTopProcurement)) return true
  //   return false
  // }

  getRegionKeyByAnyLanguage = (region) => {
    return _.find(REGIONS, o => {
      return (o.ruTemp === region || o.ru === region || o.en === region || o.ky === region)
    })
  }

  getRegionKey = (regionRu) => {
    let regionName = _.find(REGIONS, o => {
      return (o.ruTemp === regionRu || o.ru === regionRu)
    })

    return regionName.key
  }

  getRegionTranslateByKey = (regionKey) => {
    return _.find(REGIONS, o => {
      return (o.key === regionKey)
    })
  }

  getRegionLocale = (region, localization = null) => {
    let regionName = _.find(REGIONS, o => {
      return (o.ruTemp === region || localization ? o[localization] === region : o.ru === region)
    })

    return regionName[this.props.lang]
    // if (this.props.lang === 'ru') {
    //   return regionName.ru
    // } else {
    //   return regionName.en
    // }
  }

  getStoryChartConfig = (concatData, top10Data, preparedTopData) => {


    const self = this
    const { intl } = this.context
    const { selectedRegion } = this.state

    let chartConfig = {
      chart: {
        type: 'bar',
        padding: 0,
        backgroundColor: null,
        height: 500,
        style: {
          fontFamily: 'Oswald', //'Open Sans'
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
      title: {
        style: {
          color: '#FFF',
        },
      },
      xAxis: {
        gridLineColor: '#CBCBCB',
        gridLineWidth: 1,
        gridZIndex: 4,
        labels: {
          // format: '{value:,.0f}',
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
      },
      // colors: [ '#57D0B3', '#64B5F6' ],
      colors: ['#5992C0', '#ADD3D6'],
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
    }

    // let maxValue = 0
    // let preparedTopData = {}
    //
    // let concatData = _.map(competitive, (regionData, index) => {
    //   let nonCompetitiveByRegion = _.find(nonCompetitive, { name: regionData.name })
    //   let topDataByRegion = _.find(dataTop, { name: regionData.name })
    //
    //   if (regionData.value > maxValue) {
    //     maxValue = regionData.value
    //   } else if (nonCompetitiveByRegion.value > maxValue) {
    //     maxValue = nonCompetitiveByRegion.value
    //   }
    //
    //   preparedTopData = _.merge({}, preparedTopData, {
    //     [self.getRegionKey(regionData.name)]: topDataByRegion,
    //   })
    //
    //   return {
    //     // name: regionData.name,
    //     name: self.getRegionKeyByAnyLanguage(regionData.name)[self.props.lang],
    //     regionKey: self.getRegionKey(regionData.name),
    //     competitive: -regionData.value,
    //     notCompetitive: nonCompetitiveByRegion.value,
    //   }
    // })
    //
    // let bishkekIndex = _.findIndex(concatData, {regionKey: 'kg-gb'})
    // let bishkekData = concatData.splice(bishkekIndex, 1)
    // concatData.push(bishkekData[0])


    setTimeout(() => {
      self.refs['story-top-chart'].chart && self.refs['story-top-chart'].chart.series[0].setData(top10Data ? top10Data : [])
    }, 500)
    //

    // let DATA_METHOD = _.cloneDeep(dataMethod)
    // // dataMethod, nonCompetitive
    // DATA_METHOD = DATA_METHOD.map(dataMethod => {
    //   let findItem = _.find(REGIONS, { ruTemp: dataMethod.name })
    //   dataMethod.name = findItem[this.props.lang]
    //   return dataMethod
    // })
    // const DATA_TOP = _.cloneDeep(dataTop)

    return {
      getMethodConf: () => {
        // const categories = DATA_METHOD.map(item => this.getRegionLocale(item.name))
        // let concatedData = () => {
        //   let data = _.map(DATA_METHOD, (item, i) => {
        //     return {
        //       keys: {
        //         key: item.key.en,
        //         name: self.getRegionLocale(item.key.ru),
        //       },
        //       data: DATA_TOP[item.key.en],
        //       contracts: item.contracts,
        //     }
        //   })
        //   return data
        // }
        let config = _.cloneDeep(chartConfig)

        config.title = {
          text: intl.formatMessage({ id: 'page.statistic.text.071' }),
          style: {
            color: '#2A577F',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '28px',
            lineHeight: '41px',
            textAlign: 'center',
            letterSpacing: '0.05em',
          },
        }
        // config.categories = categories
        // config.categories = _.map(concatData, (regionData) => (self.getRegionLocale(regionData.name)))
        config.categories = _.map(concatData, (regionData) => (self.getRegionTranslateByKey(regionData.regionKey)[self.props.lang]))
        config.tooltip = {
          formatter: function () {
            // return '<b>' + numeral(Math.abs(this.point.y)).format('0.0 a').toLocaleString(self.props.lang === 'en' ? 'en' : 'ru') + '. ' + intl.formatMessage({ id: 'common.byn.text' }) + ' ' + this.series.name + ' ' + intl.formatMessage({ id: 'page.statistic.text.072' }) + ' ' + this.point.category + '</b><br/>'
            return '<b>' + Math.abs(this.point.y) + '% ' + this.series.name + ' ' + intl.formatMessage({ id: 'page.statistic.text.072' }) + ' ' + this.point.category + '</b><br/>'
          },
        }
        config.legend = {
          symbolHeight: 17,
          symbolWidth: 17,
          symbolRadius: 0,
          align: 'center',
          verticalAlign: 'bottom',
          padding: 0,
          itemStyle: {
            color: '#2A577F',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            // lineHeight: '24px',
            letterSpacing: '0.05em',
            display: 'inline-block',
          },
        }
        config.series = [
          {
            name: intl.formatMessage({ id: 'page.statistic.text.074.1' }),
            // data: DATA_METHOD.map(item => -item.contracts.competitive.amountShare),
            data: concatData.map(item => item.competitive),
            regionsData: _.map(concatData, (regionData) => (
              {
                key: regionData.regionKey,
                name: self.getRegionTranslateByKey(regionData.regionKey)[self.props.lang],
              }
            )),
            borderColor: null,
          }, {
            name: intl.formatMessage({ id: 'page.statistic.text.075.1' }),
            // data: DATA_METHOD.map(item => item.contracts.uncompetitive.amountShare),
            data: concatData.map(item => item.notCompetitive),
            regionsData: _.map(concatData, (regionData) => (
              {
                key: regionData.regionKey,
                name: self.getRegionTranslateByKey(regionData.regionKey)[self.props.lang],
              }
            )),
            borderColor: null,
          },
        ]

        config.xAxis = [{
          // categories: categories,
          // categories: _.map(concatData, (regionData) => (self.getRegionLocale(regionData.name))),
          categories: _.map(concatData, (regionData) => (self.getRegionTranslateByKey(regionData.regionKey)[self.props.lang])),
          reversed: false,
          labels: {
            step: 1,
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
        }, {
          // categories: _.map(concatData, (regionData) => (self.getRegionLocale(regionData.name))),
          categories: _.map(concatData, (regionData) => (self.getRegionTranslateByKey(regionData.regionKey)[self.props.lang])),
          reversed: false,
          opposite: true,
          labels: {
            step: 1,
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
        }]
        config.yAxis = {
          gridLineColor: '#CBCBCB',
          gridLineWidth: 1,
          title: {
            text: null,

          },
          // min: -maxValue,
          // max: maxValue,
          min: -100,
          max: 100,
          labels: {
            enabled: false,
            // formatter: function () {
            //   return Math.abs(this.value) + '%'
            // },
            style: {
              color: '#FFF',
            },
          },
        }
        config.plotOptions = {
          series: {
            stacking: 'normal',
            events: {
              mouseOut: function (e) {
              },
            },
          },
        }
        config.plotOptions.series.point = {
          events: {
            mouseOver: function (e) {
              let data = _.find(concatData, o => {
                return o.name === self.getRegionKeyByAnyLanguage(this.category)[self.props.lang]
              })

              if (data) {
                let top10Data = preparedTopData[data.regionKey].cpvs.map(item => {
                  let i18nCpv = _.find(self.props.translationI18nData.entries, { key: item.name })
                  let name = !_.isEmpty(i18nCpv) ? (self.props.lang === 'en' ? i18nCpv.en : i18nCpv.ru) : ''
                  return [name, item.value]
                })

                // data.data = data.data.map(item => [item.key.ru, item.amount / 1000000])
                // data.data = data.map(item => [item.name, item.amount / 1000000])
                self.refs['story-top-chart'].chart.series[0].setData(top10Data)
                // const info = _.find(concatData, o => {
                //   return o.name === e.target.category
                // })
                self.refs['story-title'].innerHTML = data.name
                // self.refs['story-info-value-competitive'].innerHTML = ` ${numeral(info.contracts.competitive.amountShare).format('0.')}% `
                // self.refs['story-info-value-uncompetitive'].innerHTML = ` ${numeral(info.contracts.uncompetitive.amountShare).format('0.')}% `
                self.refs['story-info-value-competitive'].innerHTML = ` ${Math.abs(data.competitive)}% `
                self.refs['story-info-value-uncompetitive'].innerHTML = ` ${data.notCompetitive}% `
              }
            },
          },
        }
        return config
      },

      getTopConf: () => {
        let config = _.cloneDeep(chartConfig)
        let locality = this.getStoryLocality()

        config.title = {
          text: intl.formatMessage({ id: 'page.statistic.text.076' }),
          style: {
            color: '#2A577F',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '28px',
            lineHeight: '41px',
            textAlign: 'center',
            letterSpacing: '0.05em',
          },
        }

        config.colors = ['#72BBDB']
        config.xAxis = {
          type: 'category',
          labels: {
            // format: '{value:,.0f}',
            formatter: function () {
              return this.value.length > 35 ? this.value.substr(0, 35) + '...' : this.value
              // return this.value
            },
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
        }
        config.tooltip = {
          formatter: function () {
            return '<span>' + this.point.name + '</span>' + ': ' + '<span><b>' + numeral(this.y).format('0.0 a').toLocaleString(self.props.lang === 'en' ? 'en' : 'ru') + '. ' + intl.formatMessage({ id: 'common.byn.text' }) + '</b></span>'
          },
        }
        config.yAxis = {
          gridLineColor: '#CBCBCB',
          gridLineWidth: 1,
          min: 0,
          labels: {
            enabled: false,
            // formatter: function () {
            //   return numeral(this.value).format('0 a')
            // },
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
            text: intl.formatMessage({ id: 'common.mln.text' }) + ' ' + intl.formatMessage({ id: 'common.byn.text' }),
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
        }
        config.series = [
          {
            name: '',
            // data: _.has(DATA_TOP, locality) ? DATA_TOP[locality].map(item => [item.key.ru, item.amount / 1000000]) : [],
            // data: !_.isEmpty(competitive) ? _.map(preparedTopData[competitive[0].name], (regionData) => [regionData.name, regionData.value]) : [],
            data: !_.isEmpty(concatData) ? _.map(preparedTopData[concatData[0].name], (regionData) => [regionData.name, regionData.value]) : [],
            borderColor: null,
          },
        ]
        return config
      },
    }
  }

  fetchData = (startDate, endDate, year) => {
    // let locality = this.getStoryLocality()
    // const self = this

    let dateRange = {
      dateFrom: year === 'last' ? moment().subtract('days', 365).format('YYYY-MM-DD') : moment(new Date(year)).startOf('year').format('YYYY-MM-DD'),
      dateTo: year === 'last' ? moment().format('YYYY-MM-DD') : moment(new Date(year)).endOf('year').format('YYYY-MM-DD'),
    }


    this.setState({
      dateRange: dateRange,
    }, () => {
      this.props.getWhatToBuyRegionsData(dateRange)
    })

    // Promise.all([
    //   // this.props.getRegionsTopProcurement({ year: year || 'last' }),
    //   // this.props.getRegionsCompetitivityProcurement({ year: year || 'last' }),
    //   // this.props.getWhatToBuyRegionsData({ year: year || moment().format('YYYY') }),
    //   // this.props.getWhatToBuyRegionsData(year || moment().format('YYYY')),
    //   this.props.getWhatToBuyRegionsData(dateRange),
    // ])
    //   .then(() => {
    //     // let currentLocalityInfo = _.filter(this.props.regionsCompetitivityProcurement, (item) => item.key.en === locality)[0]
    //     // let data = _.has(this.props.regionsTopProcurement, locality) ? this.props.regionsTopProcurement[locality].map(item => [item.key.ru, item.amount / 1000000]) : []
    //     // self.refs['story-top-chart'].chart.series[0].setData(data)
    //     // self.refs['story-title'].innerHTML = this.getRegionLocale(currentLocalityInfo.key.ru)
    //     // self.refs['story-info-value-competitive'].innerHTML = ` ${numeral(currentLocalityInfo.contracts.competitive.amountShare).format('0.').toLocaleString(self.props.lang === 'en' ? 'en' : 'ru')} `
    //     // self.refs['story-info-value-uncompetitive'].innerHTML = ` ${numeral(currentLocalityInfo.contracts.uncompetitive.amountShare).format('0.').toLocaleString(self.props.lang === 'en' ? 'en' : 'ru')} `
    //   })
  }

  handleScrollToFirstBlock = () => {
    document.getElementById('start-page').scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  getStoryLocality = () => {
    const {
      // locality,
      regionsCompetitivityProcurement,
    } = this.props

    let locality = {
      'ip': '212.92.248.110',
      'hostname': 'ppp-212-92-248-110.wildpark.net',
      'city': 'Mykolayiv',
      'region': 'Mykolaiv',
      'country': 'UA',
      'loc': '46.9659,31.9974',
      'org': 'AS31272 WildPark Co',
      'postal': '54001',
      'timezone': 'Europe/Kiev',
      'readme': 'https://ipinfo.io/missingauth',
    }

    return !_.isEmpty(_.filter(regionsCompetitivityProcurement, (item) => item.key.en === locality.region))
      ? locality.region
      : 'Minsk City'
  }

  renderRegionsTotals = (chartData) => {
    const {
      regionsCompetitivityProcurement,
    } = this.props

    let locality = this.getStoryLocality()

    let currentLocalityInfo = _.filter(regionsCompetitivityProcurement, (item) => item.key.en === locality)[0]

    return <div className="row story-what-to-by-header">
      <div className="col-md-12 col-xl-12">
        {/*<h5 className="info-title" ref="story-title">{this.getRegionLocale(currentLocalityInfo.key.ru)}</h5>*/}
        <h5 className="info-title" ref="story-title">{chartData[chartData.length - 1].name}</h5>
      </div>
      <div className="col-md-12 col-xl-6">
          <span className="info-value" ref="story-info-value-one">
            <span className='story-info-value-competitive'
              // ref="story-info-value-competitive">{numeral(currentLocalityInfo.contracts.competitive.amountShare).format('0.')}%  </span>
                  ref="story-info-value-competitive">{Math.abs(chartData[chartData.length - 1].competitive)}% </span>
            <FormattedMessage id="page.statistic.text.069" />
          </span>
      </div>
      <div className="col-md-12 col-xl-6">
          <span className="info-value" ref="story-info-value-two">
            <span className='story-info-value-competitive'
              // ref="story-info-value-uncompetitive"> {numeral(currentLocalityInfo.contracts.uncompetitive.amountShare).format('0.')}% </span>
                  ref="story-info-value-uncompetitive">{chartData[chartData.length - 1].notCompetitive}%</span>
            <FormattedMessage id="page.statistic.text.070" />
          </span>
      </div>
      {/*<h5>*/}
      {/*  <span className="info-value" ref="story-info-value-one">*/}
      {/*    <span className='story-info-value-competitive'*/}
      {/*          ref="story-info-value-competitive">{numeral(currentLocalityInfo.contracts.competitive.amountShare).format('0.')}%  </span>*/}
      {/*    <FormattedMessage id="page.statistic.text.069" />*/}
      {/*  </span>*/}
      {/*  <span className="info-value" ref="story-info-value-two">*/}
      {/*    <span className='story-info-value-competitive'*/}
      {/*          ref="story-info-value-uncompetitive"> {numeral(currentLocalityInfo.contracts.uncompetitive.amountShare).format('0.')}% </span>*/}
      {/*    <FormattedMessage id="page.statistic.text.070" />*/}
      {/*  </span>*/}
      {/*</h5>*/}
    </div>
  }

  prepareWhatBuyData = (whatBuyRegionsData) => {
    // whatBuyRegionsData.competitiveAmountByRegion, whatBuyRegionsData.nonCompetitiveAmountByRegion, whatBuyRegionsData.top10CpvByRegion
    if (!whatBuyRegionsData.hasOwnProperty('competitiveAmountByRegion') || _.isEmpty(whatBuyRegionsData.competitiveAmountByRegion)
      || !whatBuyRegionsData.hasOwnProperty('nonCompetitiveAmountByRegion') || _.isEmpty(whatBuyRegionsData.nonCompetitiveAmountByRegion)
      // || !whatBuyRegionsData.hasOwnProperty('top10CpvByRegion') || _.isEmpty(whatBuyRegionsData.top10CpvByRegion)
    ) {
      return {
        regionChartData: [],
        top10ChartData: [],
        preparedTopData: [],
      }
    }


    let preparedTopData = {}

    let concatData = _.map(whatBuyRegionsData.competitiveAmountByRegion, (regionData, index) => {
      let nonCompetitiveByRegion = _.find(whatBuyRegionsData.nonCompetitiveAmountByRegion, { name: regionData.name })
      let topDataByRegion = _.find(whatBuyRegionsData.top10CpvByRegion, { name: regionData.name })

      preparedTopData = _.merge({}, preparedTopData, {
        [this.getRegionKey(regionData.name)]: topDataByRegion,
      })

      return {
        // name: regionData.name,
        name: this.getRegionKeyByAnyLanguage(regionData.name)[this.props.lang],
        regionKey: this.getRegionKey(regionData.name),
        competitive: -regionData.value,
        notCompetitive: nonCompetitiveByRegion.value,
      }
    })

    let bishkekIndex = _.findIndex(concatData, { regionKey: 'kg-gb' })
    let bishkekData = concatData.splice(bishkekIndex, 1)
    concatData.push(bishkekData[0])

    let top10Data = !_.isEmpty(whatBuyRegionsData.competitiveAmountByRegion) ? preparedTopData[concatData[concatData.length - 1].regionKey].cpvs.map(item => {
      let i18nCpv = _.find(this.props.translationI18nData.entries, { key: item.name })
      let name = !_.isEmpty(i18nCpv) ? (this.props.lang === 'en' ? i18nCpv.en : i18nCpv.ru) : ''
      return [name, item.value]
    }) : []

    return {
      regionChartData: concatData,
      top10ChartData: top10Data,
      preparedTopData: preparedTopData,
    }
  }

  render() {
    const {
      // locality,
      regionsTopProcurement,
      regionsCompetitivityProcurement,
      whatBuyRegionsData,
      whatBuyRegionsDataIsFetching,
    } = this.props

    let locality = {
      'ip': '212.92.248.110',
      'hostname': 'ppp-212-92-248-110.wildpark.net',
      'city': 'Mykolayiv',
      'region': 'Mykolaiv',
      'country': 'UA',
      'loc': '46.9659,31.9974',
      'org': 'AS31272 WildPark Co',
      'postal': '54001',
      'timezone': 'Europe/Kiev',
      'readme': 'https://ipinfo.io/missingauth',
    }

    let preparedData = this.prepareWhatBuyData(whatBuyRegionsData)

    return <div className="StoryWhatToBuy">
      <div className="">
        <Fragment>
          {whatBuyRegionsDataIsFetching ? <Loader
            theme={'light'}
            isActive={_.isEmpty(whatBuyRegionsDataIsFetching)}
          /> : !_.isEmpty(preparedData.regionChartData) ? this.renderRegionsTotals(preparedData.regionChartData) : null}
          <div className="row">
            <div className="col-md-12 col-xl-6">
              {whatBuyRegionsDataIsFetching ? <Loader
                  theme={'light'}
                  isActive={_.isEmpty(whatBuyRegionsDataIsFetching)}
                /> :
                <ReactHighcharts
                  key={generate()}
                  // config={this.getStoryChartConfig(whatBuyRegionsData.competitiveAmountByRegion, whatBuyRegionsData.nonCompetitiveAmountByRegion, whatBuyRegionsData.top10CpvByRegion).getMethodConf()}
                  config={this.getStoryChartConfig(preparedData.regionChartData, preparedData.top10ChartData, preparedData.preparedTopData).getMethodConf()}
                  id="story-methods-chart"
                  ref="story-methods-chart"
                />}
            </div>
            {/*<div className="col-md-2" />*/}
            <div className="col-md-12 col-xl-6">
              {whatBuyRegionsDataIsFetching ? <Loader
                theme={'light'}
                isActive={_.isEmpty(whatBuyRegionsDataIsFetching)}
              /> : <ReactHighcharts
                key={generate()}
                // config={this.getStoryChartConfig(whatBuyRegionsData.competitiveAmountByRegion, whatBuyRegionsData.nonCompetitiveAmountByRegion, whatBuyRegionsData.top10CpvByRegion).getTopConf()}
                config={this.getStoryChartConfig(preparedData.regionChartData, preparedData.top10ChartData, preparedData.preparedTopData).getTopConf()}
                id="story-top-chart"
                ref="story-top-chart"
              />}
            </div>
          </div>
          <DateSelector onClick={(start, end, year) => this.fetchData(start, end, year)} />
          <div className="row story-desc">
            <div className="col-md-12 col-xl-4 mobile-top-margin">
              <FormattedMessage id="story.whatToBuy.text.1.1" />
              <ul>
                <li><FormattedMessage id="story.whatToBuy.text.1.1.1" /></li>
                <li><FormattedMessage id="story.whatToBuy.text.1.1.2" /></li>
                <li><FormattedMessage id="story.whatToBuy.text.1.1.3" /></li>
              </ul>
            </div>
            <div className="col-md-12 col-xl-4 mobile-top-margin">
              <p><FormattedMessage id="story.whatToBuy.text.1.2" /></p>
              <p><FormattedMessage id="story.whatToBuy.text.1.2.1" /></p>
              <p><FormattedMessage id="story.whatToBuy.text.1.2.2" /></p>


              {/*<p><FormattedMessage id="story.whatToBuy.text.2.1" /></p>*/}
              {/*<p><FormattedMessage id="story.whatToBuy.text.2.2" /></p>*/}
              {/*<p><FormattedMessage id="story.whatToBuy.text.2.3" /></p>*/}
              {/*<br />*/}
              {/*<h6><FormattedMessage id="story.whatToBuy.text.3.1" /></h6>*/}
              {/*<ul>*/}
              {/*  <li><FormattedMessage id="story.whatToBuy.text.3.2" /></li>*/}
              {/*  <li><FormattedMessage id="story.whatToBuy.text.3.3" /></li>*/}
              {/*  <li><FormattedMessage id="story.whatToBuy.text.3.4" /></li>*/}
              {/*</ul>*/}
            </div>
            <div className="col-md-12 col-xl-4 mobile-top-margin">
              <FormattedMessage id="story.whatToBuy.text.1.3" />
              <ul>
                <li><FormattedMessage id="story.whatToBuy.text.1.3.1" /></li>
                <li><FormattedMessage id="story.whatToBuy.text.1.3.2" /></li>
                <li><FormattedMessage id="story.whatToBuy.text.1.3.3" /></li>
              </ul>
            </div>
            {/*<div className="col-md-12 col-xl-3 mobile-top-margin">*/}
            {/*  <FormattedMessage id="story.whatToBuy.text.1.4" />*/}
            {/*</div>*/}
          </div>
        </Fragment>
        <div className="row justify-content-center margin-top-30">
          <SlideArrow onClick={this.handleScrollToFirstBlock} />
        </div>
      </div>
    </div>
  }
}

const mapStateToProps = ({
                           buyRegionState,
                           locale,
                           dashboard,
                         }) => {
  return {
    locality: buyRegionState.locality,
    localityIsFetching: buyRegionState.localityIsFetching,
    regionsTopProcurement: buyRegionState.regionsTopProcurement,
    regionsTopProcurementIsFetching: buyRegionState.regionsTopProcurementIsFetching,
    regionsCompetitivityProcurement: buyRegionState.regionsCompetitivityProcurement,
    regionsCompetitivityProcurementIsFetching: buyRegionState.regionsCompetitivityProcurementIsFetching,
    whatBuyRegionsData: buyRegionState.whatBuyRegionsData,
    whatBuyRegionsDataIsFetching: buyRegionState.whatBuyRegionsDataIsFetching,
    translationI18nData: dashboard.translationI18nData,
    lang: locale.lang,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getLocality: bindActionCreators(getLocality, dispatch),
    getRegionsCompetitivityProcurement: bindActionCreators(getRegionsCompetitivityProcurement, dispatch),
    getRegionsTopProcurement: bindActionCreators(getRegionsTopProcurement, dispatch),
    setCurrentRoute: bindActionCreators(setCurrentRoute, dispatch),
    getWhatToBuyRegionsData: bindActionCreators(getWhatToBuyRegionsData, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoryWhatToBuy)
