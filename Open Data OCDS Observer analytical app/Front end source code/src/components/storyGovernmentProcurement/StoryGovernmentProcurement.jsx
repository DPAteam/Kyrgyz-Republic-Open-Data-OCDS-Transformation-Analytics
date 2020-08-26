import React, { Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { generate } from 'shortid'
import _ from 'lodash'
import { connect } from 'react-redux'
import countries from 'i18n-iso-countries'
import enCountries from 'i18n-iso-countries/langs/en.json'
import kyCountries from 'i18n-iso-countries/langs/ky.json'
import ruCountries from 'i18n-iso-countries/langs/ru.json'
import ReactHighcharts from 'react-highcharts'
import ReactMaps from 'react-highcharts/ReactHighmaps'
import HighchartsMore from 'highcharts/highcharts-more'

import { HORIZONTAL_BAR_CHART_COLORS } from '../pageChart/constants'

import {
  getStoryGovernmentProcurement,
  getInternationalData,
} from '../../store/stories/storyGovernmentProcurement/actions'

import {
  BUBBLES_CHART_CONFIG,
  COUNTRY_RANKING_BAR_CHART_CONFIG,
  DISTRIBUTION_OF_SUPPLIER_COUNTRIES_CONFIG,
  POLYGON_CHART_CONFIG,
  SUPPLIER_GEOGRAPHY_MAP_CONFIG,
  TOP_RESIDENT_NON_RESIDENT_OKRBS_MAP_CONFIG,
} from './constants'
import Highcharts from 'highcharts'
import TreemapChart from './TreemapChart'

import {
  HighchartsChart,
  withHighcharts,
  Title,
  XAxis,
  YAxis,
  TreemapSeries,
  Legend,
} from 'react-jsx-highcharts'
import './StoryGovernmentProcurement.scss'
import Loader from '../loader/Loader'
import * as numeral from 'numeral'
import SlideArrow from '../slideArrow/SlideArrow'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { setCurrentRoute } from '../../store/navigation/NavActions'


HighchartsMore(ReactHighcharts.Highcharts)

const MOCK_DATA = [{ 'key': { 'en': 'kg-gb', 'ru': 'Бишкек' }, 'amount': 2454973888.5732718 }, {
  'key': {
    'en': 'kg-ba',
    'ru': 'Баткенская область',
  }, 'amount': 37468976123.88169,
}, { 'key': { 'en': 'kg-834', 'ru': 'Чуйская область' }, 'amount': 21325852718.055187 }, {
  'key': {
    'en': 'kg-yk',
    'ru': 'Иссык-Кульская область',
  }, 'amount': 1233137152460.808,
}, { 'key': { 'en': 'kg-na', 'ru': 'Нарынская область' }, 'amount': 146015277731.07974 }, {
  'key': {
    'en': 'kg-tl',
    'ru': 'Таласская область',
  }, 'amount': 51129093437.88643,
}, { 'key': { 'en': 'kg-os', 'ru': 'Ошская область' }, 'amount': 69930079535.38728 }, {
  'key': {
    'en': 'kg-da',
    'ru': 'Джалал-Абадская область',
  }, 'amount': 49930079535.38728,
}]

const REGIONS = [
  {
    ruTemp: 'Бишкек',
    ru: 'Бишкек',
    en: 'Bishkek',
    key: 'kg-gb',
  },
  {
    ruTemp: 'Ош',
    ru: 'Ош',
    en: 'Ош',
    key: '',
  },
  {
    ruTemp: 'Ошская Область',
    ru: 'Ошская Область',
    en: 'Osh region',
    key: 'kg-os',
  },
  {
    ruTemp: 'Баткенская Область',
    ru: 'Баткенская Область',
    en: 'Batken region',
    key: 'kg-ba',
  },
  {
    ruTemp: 'Таласская Область',
    ru: 'Таласская Область',
    en: 'Talas region',
    key: 'kg-tl',
  },
  {
    ruTemp: 'Джалал-Абадская Область',
    ru: 'Джалал-Абадская Область',
    en: 'Jalal-Abad region',
    key: 'kg-da',
  },
  {
    ruTemp: 'Чуйская Область',
    ru: 'Чуйская Область',
    en: 'Chuy region',
    key: 'kg-834',
  },
  {
    ruTemp: 'Иссык-Кульская Область',
    ru: 'Иссык-Кульская Область',
    en: 'Ysyk-Köl region',
    key: 'kg-yk',
  },
  {
    ruTemp: 'Нарынская Область',
    ru: 'Нарынская Область',
    en: 'Naryn region',
    key: 'kg-na',
  },
]

class StoryGovernmentProcurement extends React.Component {

  static contextTypes = {
    intl: PropTypes.object,
  }

  _isMounted = false

  constructor(props) {
    super(props)
    countries.registerLocale(enCountries)
    countries.registerLocale(kyCountries)
    countries.registerLocale(ruCountries)
    props.setCurrentRoute('/dashboard/why-government-procurement-is-important-to-the-country')
    // _.isEmpty(props.governmentProcurement) && this.props.getStoryGovernmentProcurement()
    _.isEmpty(props.internationalData) && this.props.getInternationalData()
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  prepareSupplierGeographyConfig = data => {
    const self = this
    const { intl } = this.context
    let conf = _.cloneDeep(SUPPLIER_GEOGRAPHY_MAP_CONFIG)
    // conf.series[ 0 ].data = data.map((item) => {
    //   return {
    //     'code': item.key.en,
    //     'value': item.suppliers.count,
    //   }
    // })

    // conf.series[0].data = [{
    //   'code': 'RUS',
    //   'value': 100,
    //   color: '#72BBDB',
    // }]

    conf.series[0].data = _.map(data, (dt) => {
      return _.merge({}, dt, {
        color: '#72BBDB',
      })
    })

    // conf.title.text = intl.formatMessage({ id: 'common.supplierGeography.text' })
    conf.legend.title.text = intl.formatMessage({ id: 'common.numberOfSuppliers.text' })
    conf.tooltip = {
      formatter: function () {
        // const obj = _.find(data, (o) => {
        //   return o.key.en === this.point.code
        // })
        const countryName = self.props.lang === 'ru' ? this.point.options.name : this.point.properties.name
        return '<b>' + countryName + '</b><br>' +
          intl.formatMessage({ id: 'common.suppliers.text' }) + ': <b>' + this.point.value + '</b>'
      },
    }

    return conf
  }

  renderSupplierGeographyChart = () => {
    const { suppliersCountries } = this.props.internationalData
    if (_.isEmpty(suppliersCountries))
      return <Loader
        theme="light"
        isActive={_.isEmpty(suppliersCountries)}
      />
    return <ReactMaps
      key={generate()}
      config={this.prepareSupplierGeographyConfig(suppliersCountries)}
      id="world-map-chart"
      ref="world-map-chart"
    />
  }

  prepareBelarusMapDict = data => {
    let dictionaryRU = {}
    let dictionaryEN = {}

    _.forEach(REGIONS, (region) => {
      dictionaryRU = _.merge({}, dictionaryRU, {
        [region.key]: region.ru,
      })

      dictionaryEN = _.merge({}, dictionaryEN, {
        [region.key]: region.en,
      })
    })

    return {
      ru: dictionaryRU,
      en: dictionaryEN,
    }
  }

  prepareTopResidentNonResidentOkrbsConfig = data => {
    const { intl } = this.context
    const self = this
    const conf = _.cloneDeep(TOP_RESIDENT_NON_RESIDENT_OKRBS_MAP_CONFIG)
    // conf.title.text = intl.formatMessage({ id: "page.statistic.text.085" })
    conf.series[0].name = intl.formatMessage({ id: 'page.statistic.text.086' })

    // conf.series[0].data = MOCK_DATA.map((item, index) => {
    let sortedData = _.orderBy(data, ['value'], ['desc'])

    conf.series[0].data = sortedData.map((item, index) => {
      return {
        'hc-key': item.name ? _.find(REGIONS, { ru: item.name }).key : '',
        'value': item.value,
        color: `#72BBDB${index > 0 ? 100 - (10 * index) : ''}`,
      }
      // return [item.key.en, item.amount]
    })

    conf.tooltip = {
      formatter: function () {
        // page.common.text.63
        // return '<span>aaa</span>'
        return '<span>' + (self.props.lang === 'ru' ? self.prepareBelarusMapDict(data).ru[this.point['hc-key']] : self.prepareBelarusMapDict(data).en[this.point['hc-key']]) + '</span><br/><span>' + intl.formatMessage({ id: 'page.common.text.63' }) + ': ' + '<b>' + numeral(this.point.value).format('0 a') + '</b></span>'
      },
    }

    conf.legend.min = this.getMinGovernmentProcurementNonResSupp()
    conf.series[0].dataLabels = {
      enabled: false,
      formatter: function () {
        return self.props.lang === 'ru' ? self.prepareBelarusMapDict(data).ru[this.point['hc-key']] : self.prepareBelarusMapDict(data).en[this.point['hc-key']]
      },
    }
    conf.colorAxis = {
      min: 1000000,
      max: 2000000000,
      type: 'logarithmic',
      minColor: '#E7E7E7',
      maxColor: '#C4C4C4',
      labels: {
        formatter: function (axisData) {
          return numeral(axisData.value).format('0 a')
        },
        style: {
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '14px',
          lineHeight: '24px',
          // letterSpacing: '0.05em',
          color: '#AFAFAF',
        },
        // formatter: function () {
        //   return numeral(this.value).format('0 a')
        // },
      },
      tickPositioner: function (min, max) {
        return [min, min + (max - min) * (1 / 3), min + (max - min) * (2 / 3), max]
      },
    }
    // conf.tooltip = {
    //   formatter: function () {
    //     const obj = _.find(data, (o) => {
    //       return o.key.en === this.point.options[ 'hc-key' ]
    //     })
    //     const countryName = self.props.lang === 'ru' ? obj.key.ru : this.point.name
    //     return '<b>' + countryName + '</b><br>' +
    //       intl.formatMessage({ id: 'common.suppliers.text' }) + ':<b>' + this.point.value + '</b>'
    //   },
    // }
    return conf
  }

  renderTopResidentNonResidentOkrbsMap = () => {
    const { suppliersRegions } = this.props.internationalData
    if (_.isEmpty(this.props.internationalData))
      return <Loader
        theme="light"
        isActive={_.isEmpty(this.props.internationalData)}
      />

    return <ReactMaps
      key={generate()}
      config={this.prepareTopResidentNonResidentOkrbsConfig(suppliersRegions)}
      id="belarus-story-map-chart"
      ref="belarus-story-map-chart"
    />
  }

  prepareCountryRankingBarChartData = data => {
    const { intl } = this.context
    const self = this
    let conf = _.cloneDeep(COUNTRY_RANKING_BAR_CHART_CONFIG)
    // conf.title.text = intl.formatMessage({ id: 'page.statistic.text.080' })
    const getGountryLocale = ruKey => {
      switch (ruKey) {
        case 'Швейцария': {
          return 'Switzerland'
        }
        case 'Эстония': {
          return 'Estonia'
        }
        case 'Соединенное Королевство Великобритании и Северной Ирландии': {
          return 'United Kingdom of Great Britain and Northern Ireland'
        }
        case 'Австрия': {
          return 'Austria'
        }
        case 'Латвия': {
          return 'Latvia'
        }
        case 'Германия': {
          return 'Germany'
        }
        case 'Российская Федерация': {
          return 'Russian Federation'
        }
        case 'Соединенные Штаты Америки': {
          return 'USA'
        }
        case 'Италия': {
          return 'Italy'
        }
        case 'Польша': {
          return 'Poland'
        }
        default: {
          return ruKey
        }
      }
    }
    conf.xAxis.categories = data.map((item, i) => {
      // return this.props.lang === 'ru' ? item.key.ru : getGountryLocale(item.key.ru)
      let countyName = this.findCountyName(item)
      // return item.name
      return countyName
    })
    conf.tooltip = {
      // useHTML: true,
      formatter: function () {
        // const name = self.props.lang === 'ru' ? this.point.name : getGountryLocale(this.point.name)
        return '<span>' + this.point.name +
          ': <b>' + numeral(this.point.y).format('0 a') + ' ' + intl.formatMessage({ id: 'common.byn.text' }) + '</b>'
          + '</span>'
      },
    }
    const colors = ['#AB47BC', '#5C6BC0', '#29B6F6', '#26A69A', '#9CCC65', '#FFEE58', '#FFA726', '#78909C', '#EC407A', '#FFEE58']
    // countries.getName('DEU', 'en')


    conf.series[0].data = _.map(data, (parent, i) => {
      let countyName = this.findCountyName(parent)

      // return { name: parent.key.ru, y: parent.amount, color: HORIZONTAL_BAR_CHART_COLORS[i] }
      return { name: countyName, y: parent.value, color: HORIZONTAL_BAR_CHART_COLORS[i] }
    })
    return conf
  }

  findCountyName = (countryObject) => {
    let countriesArray = _.map(Object.keys(ruCountries.countries), (key) => ({
      name: ruCountries.countries[key],
      code: key,
    }))

    let countyName = countryObject.name
    if (countryObject.code !== 'unknown') {
      countyName = countries.getName(countryObject.code, this.props.lang)
    } else {
      let countyFindByRuName = _.find(countriesArray, {name: countryObject.name})
      if(countyFindByRuName) {
        countyName = countries.getName(countyFindByRuName.code, this.props.lang)
      }
    }

    return countyName
  }

  renderCountryRankingBarChart = () => {
    const { top10NonResidentSupplierCountries } = this.props.internationalData
    if (_.isEmpty(top10NonResidentSupplierCountries))
      return <Loader
        theme="light"
        isActive={_.isEmpty(top10NonResidentSupplierCountries)}
      />

    return <ReactHighcharts
      key={generate()}
      config={this.prepareCountryRankingBarChartData(top10NonResidentSupplierCountries)}
      id="CountryRankingBarChart"
      ref="CountryRankingBarChart"
    />
  }

  prepareDistributionOfSupplierCountriesConfig = data => {
    const { intl } = this.context
    let conf = _.cloneDeep(DISTRIBUTION_OF_SUPPLIER_COUNTRIES_CONFIG)

    let tempSeriesData = []
    let top10Data = data.top10Countries === 0 ? 0 : Math.round((data.top10Countries / (data.top10Countries + data.otherCountries) * 100))
    let otherData = 100 - top10Data


    _.forEach(Object.keys(data), (key) => {
      tempSeriesData.push({
        name: key === 'top10Countries' ? `${top10Data}%` : `${otherData}%`,
        y: key === 'top10Countries' ? top10Data : otherData,
        color: key === 'top10Countries' ? '#5FBBC2' : '#ADD3D6',
        pointPercent: key === 'top10Countries' ? top10Data : otherData,
        pointDescription: key === 'top10Countries' ? 'page.common.text.59' : 'page.common.text.60',
        legendText: key === 'top10Countries' ? intl.formatMessage({ id: 'page.common.text.59' }) : intl.formatMessage({ id: 'page.common.text.60' }),
        sliced: !(key === 'top10Countries'),
        dataLabels: {
          verticalAlign: 'top',
          enabled: true,
          connectorWidth: 1,
          distance: key === 'top10Countries' ? -30 : -25,
          connectorColor: '#000000',
          style: {
            fontWeight: 600,
            fontSize: '18px',
            color: key === 'top10Countries' ? '#FFFFFF' : '#2A577F',
            textOutline: 0,
          },
        },
      })
    })

    conf.series = [
      {
        type: 'pie',
        dataLabels: false,
        size: '40%',
        showInLegend: false,
        data: [{
          name: 'IE',
          y: 7,
          color: '#599EC0',
        }],
        innerSize: '95%',
      },
      {
        innerSize: '50%',
        // borderWidth: 5,
        data: tempSeriesData,
      },
    ]

    conf.tooltip = {
      formatter: function () {
        return this.point.pointDescription ? '<span style="font-size: 14px">' + intl.formatMessage({ id: this.point.pointDescription }) + '</span><br/>'
          + '<span style="font-size: 14px">' + intl.formatMessage({ id: 'tooltip.common.text.9.3' }) + ': ' + this.key + '</span>' : false
      },
    }
    // conf.title.text = intl.formatMessage({ id: 'page.statistic.text.081' })
    // conf.tooltip = {
    //   formatter: function () {
    //     return '<b>' + this.point.name + ': </b><br> ' + intl.formatMessage({ id: 'page.statistic.text.065' }) + ': <b>' + numeral(this.point.y).format('0 a') + ' ' + intl.formatMessage({ id: 'common.byn.text' }) + '</b><br> ' + intl.formatMessage({ id: 'page.statistic.text.066' }) + ': <b>' + numeral(this.point.percentage).format('0') + '%</b>'
    //   },
    // }
    // conf.series[ 0 ].data = _.map(data, item => {
    //   return {
    //     name: item.key.en === 'top' ? intl.formatMessage({ id: 'page.statistic.text.082' }) : intl.formatMessage({ id: 'page.statistic.text.083' }),
    //     y: item.amount,
    //   }
    // })
    return conf
  }

  renderDistributionOfSupplierCountries = () => {
    const { othersCountriesAmount, top10CountriesAmount, internationalDataIsFetching } = this.props.internationalData
    if (_.isEmpty(this.props.internationalData))
      return <Loader
        theme="light"
        isActive={_.isEmpty(this.props.internationalData)}
      />

    return <ReactHighcharts
      key={generate()}
      config={this.prepareDistributionOfSupplierCountriesConfig({
        top10Countries: top10CountriesAmount,
        otherCountries: othersCountriesAmount,
      })}
      id="DistributionOfSupplierCountriesChart"
      ref="DistributionOfSupplierCountriesChart"
    />
  }

  prepareBubblesChartConfig = data => {
    // data = _.orderBy(data, ['contracts.amount'], ['asc'])
    data = _.orderBy(data, ['contractsAmount'], ['desc'])

    const TEXT = [
      {
        ru: 'СНГ',
        en: 'CIS countries',
      },
      {
        ru: 'Евразийский экономический союз',
        en: 'Eurasian Economic Union',
      },
      {
        ru: 'Соседи',
        en: 'Neighbors',
      },
      {
        ru: 'Европейский союз',
        en: 'European Union',
      },
      {
        ru: 'Североамериканская зона свободной торговли (NAFTA)',
        en: 'North American Free Trade Zone (NAFTA)',
      },
      {
        ru: 'Азиатско-Тихоокеанское экономическое сотрудничество (АТЭС)',
        en: 'Asia-Pacific Economic Cooperation (APEC)',
      },
    ]

    const { intl } = this.context
    let conf = _.cloneDeep(BUBBLES_CHART_CONFIG)
    // const colors = [ '#ef5350', '#AB47BC', '#5C6BC0', '#29B6F6', '#26A69A', '#9CCC65', '#FFEE58', '#FFA726' ]
    // const colors = [ '#AFD6E7', '#A7E3D3', '#8FA3B3', '#A8E2D1', '#8BA4BA', '#9CCC65', '#FFEE58', '#FFA726' ]
    // const colors = [ '#72BBDB', '#63D4B1', '#335571', '#A8E2D1', '#74BADC', '#9CCC65', '#FFEE58', '#FFA726' ]
    const colors = ['#74BADC', '#2A577F', '#A8E2D1', '#335571', '#63D4B1', '#72BBDB', '#FFEE58', '#FFA726']
    conf.xAxis.title.text = intl.formatMessage({ id: 'page.common.text.19' })
    conf.yAxis.title.text = intl.formatMessage({ id: 'page.common.text.18' })
    // conf.tooltip = {
    //   // useHTML: true,
    //   formatter: function () {
    //     return '<dl>' +
    //       '<dt><b><h5>' + this.point.name + '</h5></b></dt><br>' +
    //       '<dd>' + intl.formatMessage({ id: 'page.statistic.text.060' }) + ': <b>' + this.point.y + ' ' + intl.formatMessage({ id: 'common.mln.text' }) + '</b></dd><br>' +
    //       '<dd>' + intl.formatMessage({ id: 'page.dashboard.text.05' }) + ': <b>' + numeral(this.point.x).format(`0 a`) + ' ' + intl.formatMessage({ id: 'common.byn.text' }) + '</b></dd><br>' +
    //       '<dd>' + intl.formatMessage({ id: 'common.numberOfSuppliers.text' }) + ': <b>' + this.point.z + '</b></dd>' +
    //       '</dl>'
    //   },
    // }

    conf.tooltip = {
      // useHTML: true,
      formatter: function () {
        return '<dl>' +
          '<dt><h6>' + this.point.name + '</h6></dt><br/>' +
          '<dd>' + intl.formatMessage({ id: 'page.common.text.19' }) + ': <b>' + numeral(this.point.x).format(`0 a`) + '</b></dd><br/>' +
          '<dd>' + intl.formatMessage({ id: 'page.common.text.18' }) + ': <b>' + this.point.y + intl.formatMessage({ id: 'common.psc.text' }) + '</b></dd><br/>' +
          '<dd>' + intl.formatMessage({ id: 'tooltip.common.text.7.3' }) + ': <b>' + this.point.z + '</b></dd>' +
          '</dl>'
      },
    }

    const getLocale = (item) => {
      let obj = _.find(TEXT, o => {
        return o.ru === item.countryName
      })
      if (this.props.lang === 'ru') {
        return obj.ru
      } else {
        return obj.en
      }
    }

    conf.series = data.map((item, i) => {
      return {
        name: getLocale(item),
        data: [
          {
            x: parseInt(item.contractsAmount),
            y: parseInt(item.contractsCount),
            z: parseInt(item.suppliersCount),
            name: getLocale(item),
            // color: colors[ i ],
            color: colors[i],
          },
        ],
      }
    })
    return conf
  }

  renderBubblesChart = () => {
    const { bubbles } = this.props.internationalData
    if (_.isEmpty(this.props.internationalData))
      return <Loader
        theme="light"
        isActive={_.isEmpty(this.props.internationalData)}
      />
    return <ReactHighcharts
      key={generate()}
      config={this.prepareBubblesChartConfig(bubbles)}
      id="TopFiveItemsOfPurchaseChart"
      ref="TopFiveItemsOfPurchaseChart"
    />
  }

  preparePolygonChartConfig = data => {
    const { intl } = this.context
    let config = _.cloneDeep(POLYGON_CHART_CONFIG)
    // config.title.text = intl.formatMessage({ id: "page.statistic.text.084" })
    // const primaryColors = [ '#aeccaf', '#a3d6ff', '#f5acac', '#ffd699', '#7E57C280' ]
    const primaryColors = ['#ADD3D6', '#5FBBC2', '#489EAE', '#72BBDB', '#3672A1']
    let parrents = _.map(data, (item, i) => {
        return {
          id: 'value' + i,
          name: item.name.length > 45 ? item.name.substring(0, 45) + '...' : item.name,
          tooltipName: item.name,
          // color: primaryColors[ i ],
          color: primaryColors[i],
          dataLabels: {
            // verticalAlign: 'top',
            enabled: true,
            // connectorWidth: 1,
            // distance: -25,
            // connectorColor: '#000000',
            style: {
              fontWeight: 'normal',
              fontSize: '22px',
              lineHeight: '33px',
              letterSpacing: '0.05em',
              color: (i === data.length - 1) ? '#FFFFFF' : '#2A577F',
              // textOutline: 0,
            },
          },
        }
      },
    )
    let cildrensResident = _.map(data, (item, i) => {
      return {
        name: intl.formatMessage({ id: 'common.story.residents.label.full' }),
        tooltipName: intl.formatMessage({ id: 'common.story.residents.label.full' }),
        parent: 'value' + i,
        value: item.residentLotsAmount,
        dataLabels: {
          // verticalAlign: 'top',
          enabled: true,
          // connectorWidth: 1,
          // distance: -25,
          // connectorColor: '#000000',
          style: {
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.05em',
            color: (i === data.length - 1) ? '#FFFFFF' : '#2A577F',
            // textOutline: 0,
          },
        },
      }
    })
    let cildrensNonResidents = _.map(data, (item, i) => {

      return {
        name: intl.formatMessage({ id: 'common.story.nonresidents.label.full' }),
        tooltipName: intl.formatMessage({ id: 'common.story.nonresidents.label.full' }),
        parent: 'value' + i,
        value: item.nonResidentLotsAmount,
        dataLabels: {
          // verticalAlign: 'top',
          enabled: true,
          // connectorWidth: 1,
          // distance: -25,
          // connectorColor: '#000000',
          style: {
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.05em',
            color: (i === data.length - 1) ? '#FFFFFF' : '#2A577F',
            // textOutline: 0,
          },
        },
      }
    })
    config.series[0].data.push(...parrents, ...cildrensResident, ...cildrensNonResidents)
    config.tooltip = {
      formatter: function () {
        return '<b>' + this.point.tooltipName + ': </b><span>' + numeral(this.point.value).format('0.00a') + ' ' + intl.formatMessage({ id: 'common.byn.text' }) + '</span>'
      },
    }
    return config
  }

  renderPolygonChart = () => {
    if (_.isEmpty(this.props.internationalData)) return <Loader
      theme="light"
      isActive={_.isEmpty(this.props.internationalData)}
    />
    return <ReactHighcharts
      key={generate()}
      config={this.preparePolygonChartConfig(this.props.internationalData.top5CPV)}
      id="PolygonChart"
      ref="PolygonChart"
    />
  }

  handleScrollToFirstBlock = () => {
    document.getElementById('start-page').scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  getMinGovernmentProcurementNonResSupp = () => {
    const data = this.props.governmentProcurement.topResidentNonResidentOkrbs
    let min = _.minBy(data, (o) => {
      return o.amount
    })
    return min
  }

  render() {
    const { intl } = this.context
    return (
      <div className="StoryGovernmentProcurement">
        <div className="w-100 banner" />
        <div className="">
          <div className="row text-center">
            <div className="col-12 big-title">
              <h1><FormattedMessage id="common.story.title.label" /></h1>
            </div>
          </div>
          <Fragment>
            {/*<div className="row justify-content-center margin-top-75 margin-rl-250">*/}
            <div className="row justify-content-center margin-top-75">
              <div className="col-md-2 inline-center">
                <p style={{ float: 'right' }}><FormattedMessage id="common.story.text.0.1" /></p>
              </div>
              <div className="col-sm-5 col-md-5">
                <p><FormattedMessage id="common.story.text.1.1" /></p>
                <p><FormattedMessage id="common.story.text.1.2" /></p>
                <ol>
                  <p><FormattedMessage id="common.story.list.1.title" /></p>
                  <li><FormattedMessage id="common.story.list.1.1" /></li>
                  <li><FormattedMessage id="common.story.list.1.2" /></li>

                </ol>
              </div>
              <div className="col-sm-5 col-md-5 inline-center">
                <ol start="3">
                  <li><FormattedMessage id="common.story.list.1.3" /></li>
                  <li><FormattedMessage id="common.story.list.1.4" /></li>
                  <li><FormattedMessage id="common.story.list.1.5" /></li>
                </ol>
              </div>
            </div>
            <div className="chart-title">
              <p className="margin-top-30"><FormattedMessage id="common.story.list.1.description" /></p>
            </div>
            <div className="row justify-content-center">
              <div className="col-sm-12 col-md-8 text-center">
                {this.renderSupplierGeographyChart()}
              </div>
            </div>
          </Fragment>

          <Fragment>
            {/*<div className="row justify-content-center margin-top-30 margin-rl-250">*/}
            <div className="row justify-content-center margin-top-30">
              <div className="col-md-2 inline-center">
                <p style={{ float: 'right' }}><FormattedMessage id="common.story.text.0.1.1" /></p>
              </div>
              <div className="col-sm-5 col-md-5">
                <p><FormattedMessage id="common.story.text.0.1.2" /></p>
              </div>
              <div className="col-sm-5 col-md-5 inline-center">
                <p><FormattedMessage id="common.story.text.0.1.3" /></p>
              </div>
            </div>
          </Fragment>
          {/*<div className="row justify-content-center margin-top-30">*/}
          {/*  <div className="col-sm-12 col-md-6">*/}
          {/*    <p><FormattedMessage id="common.story.text.2.1" /></p>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="chart-title">
            <p className="margin-top-30"><FormattedMessage id="common.story.list.2.description" /></p>
          </div>
          <div className="row justify-content-center margin-top-30">
            <div className="col-sm-12 col-md-8 text-center">
              {this.renderCountryRankingBarChart()}
            </div>
          </div>
          <div className="chart-title">
            <p className="margin-top-30"><FormattedMessage id="common.story.list.3.description" /></p>
          </div>
          <div className="row justify-content-center margin-top-30 ">
            <div className="col-sm-12 col-md-6 text-center">
              {this.renderDistributionOfSupplierCountries()}
            </div>
          </div>
          {/** **/}

          {/** **/}
          <Fragment>
            {/*<div className="row justify-content-center margin-top-30 margin-rl-250">*/}
            <div className="row justify-content-center margin-top-30">
              <div className="col-sm-5 col-md-5">
                <p><FormattedMessage id="common.story.text.0.1.4" /></p>
                <p><FormattedMessage id="common.story.text.0.1.5" /></p>
              </div>
              <div className="col-sm-5 col-md-5">
                <p><FormattedMessage id="common.story.text.0.1.6" /></p>
                <p><FormattedMessage id="common.story.text.0.1.7" /></p>
              </div>
            </div>
          </Fragment>
          {/*<div className="row justify-content-center margin-top-30">*/}
          {/*  <div className="col-sm-12 col-md-6">*/}
          {/*    <p><FormattedMessage id="common.story.text.3.1" /></p>*/}
          {/*    <p><FormattedMessage id="common.story.text.3.2" /></p>*/}
          {/*    <p><FormattedMessage id="common.story.text.3.3" /></p>*/}
          {/*    <p><FormattedMessage id="common.story.text.3.4" /></p>*/}
          {/*    <p><FormattedMessage id="common.story.text.3.5" /></p>*/}
          {/*    <p><FormattedMessage id="common.story.text.3.6" /></p>*/}
          {/*    <p><FormattedMessage id="common.story.text.3.7" /></p>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="row justify-content-center margin-top-30">
            <div className="col-sm-12 col-md-6 text-center">
              {this.renderBubblesChart()}
            </div>
          </div>
          <Fragment>
            {/*<div className="row justify-content-center margin-top-30 margin-rl-250">*/}
            <div className="row justify-content-center margin-top-30">
              <div className="col-sm-5 col-md-5">
                <p><FormattedMessage id="common.story.text.0.1.8" /></p>
                <p><FormattedMessage id="common.story.text.0.1.9" /></p>
              </div>
              <div className="col-sm-5 col-md-5">
                <p><FormattedMessage id="common.story.text.0.1.10" /></p>
                <p><FormattedMessage id="common.story.text.0.1.11" /></p>
                <p><FormattedMessage id="common.story.text.0.1.12" /></p>
              </div>
            </div>
          </Fragment>
          {/*<div className="row justify-content-center margin-top-30">*/}
          {/*  <div className="col-sm-12 col-md-6">*/}
          {/*    <dl>*/}
          {/*      <dt>{intl.formatMessage({ id: 'common.story.table.title.1' })}</dt>*/}
          {/*      <dd>{intl.formatMessage({ id: 'common.story.table.values.1' })}</dd>*/}
          {/*      <dt>{intl.formatMessage({ id: 'common.story.table.title.2' })}</dt>*/}
          {/*      <dd>{intl.formatMessage({ id: 'common.story.table.values.2' })}</dd>*/}
          {/*      <dt>{intl.formatMessage({ id: 'common.story.table.title.3' })}</dt>*/}
          {/*      <dd>{intl.formatMessage({ id: 'common.story.table.values.3' })}</dd>*/}
          {/*      <dt>{intl.formatMessage({ id: 'common.story.table.title.4' })}</dt>*/}
          {/*      <dd>{intl.formatMessage({ id: 'common.story.table.values.4' })}</dd>*/}
          {/*      <dt>{intl.formatMessage({ id: 'common.story.table.title.5' })}</dt>*/}
          {/*      <dd>{intl.formatMessage({ id: 'common.story.table.values.5' })}</dd>*/}
          {/*      <dt>{intl.formatMessage({ id: 'common.story.table.title.6' })}</dt>*/}
          {/*      <dd>{intl.formatMessage({ id: 'common.story.table.values.6' })}</dd>*/}
          {/*    </dl>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className="row justify-content-center margin-top-30">*/}
          {/*  <div className="col-sm-12 col-md-6">*/}
          {/*    <p><FormattedMessage id="common.story.text.4.1" /></p>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <Fragment>
            {/*<div className="row justify-content-center margin-top-30 margin-rl-250">*/}
            <div className="row justify-content-center margin-top-30">
              <div className="col-md-2 inline-center">
                <p style={{ float: 'right' }}><FormattedMessage id="common.story.text.0.1.13" /></p>
              </div>
              <div className="col-sm-5 col-md-5">
                <p><FormattedMessage id="common.story.text.0.1.14" /></p>
              </div>
              <div className="col-sm-5 col-md-5">
                <p><FormattedMessage id="common.story.text.0.1.15" /></p>
              </div>
            </div>
          </Fragment>
          <div className="chart-title">
            <p className="margin-top-30"><FormattedMessage id="common.story.list.4.description" /></p>
          </div>
          {/*<div className="row justify-content-center margin-top-30 margin-rl-250">*/}
          <div className="row justify-content-center margin-top-30">
            {/*<div className="col-md-2 d-none d-md-block d-lg-block">*/}
            {/*  <p><FormattedMessage id="common.story.text.0.2" /></p>*/}
            {/*</div>*/}
            <div className="col-sm-12 col-md-10">
              {this.renderPolygonChart()}
            </div>
          </div>
          <Fragment>
            {/*<div className="row justify-content-center margin-top-30 margin-rl-250">*/}
            <div className="row justify-content-center margin-top-30">
              <div className="col-sm-5 col-md-5">
                <p><FormattedMessage id="common.story.text.0.1.16" /></p>
              </div>
              <div className="col-sm-5 col-md-5 d-none d-md-block d-lg-block">
                <p><FormattedMessage id="common.story.text.0.1.17" /></p>
              </div>
            </div>
          </Fragment>
          {/*<div className="row justify-content-center margin-top-30">*/}
          {/*  <div className="col-sm-12 col-md-6">*/}
          {/*    <p><FormattedMessage id="common.story.text.5.1" /></p>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="chart-title">
            <p className="margin-top-30"><FormattedMessage id="page.statistic.text.085" /></p>
          </div>
          {/*<div className="row justify-content-center margin-top-30 margin-rl-250">*/}
          <div className="row justify-content-center margin-top-30">
            <div className="col-sm-12 col-md-8 text-center">
              {this.renderTopResidentNonResidentOkrbsMap()}
            </div>
          </div>
          <Fragment>
            {/*<div className="row justify-content-center margin-top-30 margin-rl-250">*/}
            <div className="row justify-content-center margin-top-30">
              <div className="col-sm-5 col-md-5">
                <p><FormattedMessage id="common.story.text.0.1.18" /></p>
                <ul>
                  <li><FormattedMessage id="common.story.text.0.1.18.1" /></li>
                </ul>
              </div>
              <div className="col-sm-5 col-md-5 d-none d-md-block d-lg-block">
                <ul>
                  <li><FormattedMessage id="common.story.text.0.1.18.2" /></li>
                  <li><FormattedMessage id="common.story.text.0.1.18.3" /></li>
                  <li><FormattedMessage id="common.story.text.0.1.18.4" /></li>
                  <li><FormattedMessage id="common.story.text.0.1.18.5" /></li>
                </ul>
              </div>
            </div>
          </Fragment>
          {/*<div className="row justify-content-center margin-top-30">*/}
          {/*  <div className="col-sm-12 col-md-6">*/}
          {/*    <p><FormattedMessage id="common.story.text.6.1" /></p>*/}
          {/*    <ol>*/}
          {/*      <li><FormattedMessage id="common.story.text.6.2" /></li>*/}
          {/*      <li><FormattedMessage id="common.story.text.6.3" /></li>*/}
          {/*      <li><FormattedMessage id="common.story.text.6.4" /></li>*/}
          {/*    </ol>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="row justify-content-center margin-top-30">
            <SlideArrow onClick={this.handleScrollToFirstBlock} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ governmentProcurementState, locale }) => {
  return {
    governmentProcurement: governmentProcurementState.governmentProcurement,
    internationalData: governmentProcurementState.internationalData,
    internationalDataIsFetching: governmentProcurementState.internationalDataIsFetching,
    lang: locale.lang,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getStoryGovernmentProcurement: bindActionCreators(getStoryGovernmentProcurement, dispatch),
    setCurrentRoute: bindActionCreators(setCurrentRoute, dispatch),
    getInternationalData: bindActionCreators(getInternationalData, dispatch),
  }
}

StoryGovernmentProcurement.contextTypes = {
  intl: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(StoryGovernmentProcurement)
