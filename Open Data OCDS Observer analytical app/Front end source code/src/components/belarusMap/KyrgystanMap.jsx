import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactHighmaps from 'react-highcharts/ReactHighmaps'
import { generate } from 'shortid'
import Highcharts from 'highcharts/highmaps'
import belarusMapSource from './belarusMapSource'
import kyrgyzstanMapSource from './kyrgyzstanMapSource'
import kyrgyzstanMapSourceMOCK from './kyrgyzstanMapSourceMOCK'

import './BelarusMap.scss'
import * as numeral from 'numeral'
import _ from 'lodash'


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

export default class KyrgyzstanMap extends Component {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    pureData: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    countriesDict: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    lang: PropTypes.string,
    title: PropTypes.string,
    selectedRegion: PropTypes.string,
    height: PropTypes.number,
    tooltipTranslateKey: PropTypes.string,
    changeOnHover: PropTypes.bool,
    hoverRegion: PropTypes.func,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !JSON.stringify(this.props) === JSON.stringify(nextProps)
  }

  prepareKyrgyzstanMapDict = data => {
    // let preparedData = _.cloneDeep(MOCK_DATA)
    let preparedData = _.cloneDeep(data)

    let dictionaryRU = {}
    let dictionaryEN = {}
    let dictionaryKY = {}

    _.forEach(REGIONS, (region) => {
      dictionaryRU = _.merge({}, dictionaryRU, {
        [region.key]: region.ru,
      })

      dictionaryEN = _.merge({}, dictionaryEN, {
        [region.key]: region.en,
      })

      dictionaryKY = _.merge({}, dictionaryKY, {
        [region.key]: region.ky,
      })
    })

    return {
      ru: dictionaryRU,
      en: dictionaryEN,
      ky: dictionaryKY,
    }

    // return {
    //   ru: _.reduce(preparedData, function (obj, item) {
    //     obj[item.key.en] = item.key.ru
    //     return obj
    //   }, {}),
    //   en: _.reduce(preparedData, function (obj, item) {
    //     obj[item.key.en] = _.find(REGIONS, o => {
    //       return o.ru === item.key.ru
    //     }).en
    //     return obj
    //   }, {}),
    // }
  }

  render() {
    const { intl } = this.context
    const self = this

    let mapConfig = {
      chart: {
        height: self.props.height,
        backgroundColor: 'transparent',
        map: 'countries/kg/kg-all',
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
      },
      title: {
        text: self.props.title,
        align: 'center',
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
      colorAxis: {
        min: 1000000,
        max: 2000000000,
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
        },
        tickPositioner: function (min, max) {
          return [min, min + (max - min) * (1 / 3), min + (max - min) * (2 / 3), max]
        },
      },
      legend: {
        // layout: 'horizontal',
        // align: 'center',
        // verticalAlign: 'middle',
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        series: self.props.changeOnHover ? {
          // stacking: 'normal',
          // events: {
          //   mouseOut: function (e) {
          //     console.log('-=OUT=-')
          //   },
          //   mouseOver: function (e) {
          //     console.log('-=OVER=-')
          //   },
          // },
          point: {
            events: {
              click: function (e) {
                let regionNameRu = _.find(REGIONS, { key: this['hc-key'] }).ru
                if (self.props.selectedRegion === regionNameRu) {
                  self.props.hoverRegion(null)
                } else {
                  self.props.hoverRegion(regionNameRu)
                }
                // self.props.hoverRegion(null)
                // self.props.hoverRegion()
              },
              // mouseOut: function (e) {
              //   self.props.hoverRegion(null)
              //   // self.props.hoverRegion()
              // },
              // mouseOver: function (e) {
              //   let regionNameRu = _.find(REGIONS, {key: this['hc-key']}).ru
              //   self.props.hoverRegion(regionNameRu)
              // },
            },
          },
        } : {},
      },
      tooltip: self.props.changeOnHover ? {
        // self.props.changeOnHover
        formatter: function () {
          let dictionary = self.prepareKyrgyzstanMapDict(self.props.pureData)[self.props.lang]

          return '<span style="font-size: 14px">' + dictionary[this.point['hc-key']] + '</span><br/>'
            + '<span style="font-size: 14px; font-weight: 600">' + numeral(this.point.value).format('0') + '% </span><span style="font-size: 14px">' + intl.formatMessage({ id: 'page.common.text.12' }) + '</span><br/>'
            + '<span  style="font-size: 14px">' + this.point.plansAmountTest + '</span>' + ': ' + '<span  style="font-size: 14px; font-weight: 600">' + numeral(this.point.plansAmount).format('0.0 a').toLocaleString(self.props.lang === 'en' ? 'en' : 'ru') + ' ' + intl.formatMessage({ id: 'common.byn.text' }) + '</span><br/>'
            + '<span  style="font-size: 14px">' + this.point.lotsAmountTest + '</span>' + ': ' + '<span  style="font-size: 14px; font-weight: 600">' + numeral(this.point.lotsAmount).format('0.0 a').toLocaleString(self.props.lang === 'en' ? 'en' : 'ru') + ' ' + intl.formatMessage({ id: 'common.byn.text' }) + '</span>'
        },
      } : {
        headerFormat: '',
        pointFormatter: function () {
          let dictionary = self.prepareKyrgyzstanMapDict(self.props.pureData)[self.props.lang]

          if (!_.isEmpty(self.props.tooltipTranslateKey)) {
            return '<span><b>' + dictionary[this['hc-key']] + '</b></span> <br> ' + intl.formatMessage({ id: self.props.tooltipTranslateKey }) + ': ' + this.value.toLocaleString(self.props.lang === 'en' ? 'en' : 'ru')
            // if (self.props.lang === 'ru') {
            //   return '<span><b>' + self.prepareKyrgyzstanMapDict(self.props.pureData).ru[this['hc-key']] + '</b></span> <br> ' + intl.formatMessage({ id: self.props.tooltipTranslateKey }) + ': ' + this.value.toLocaleString('ru')
            // } else {
            //   return '<span><b>' + self.prepareKyrgyzstanMapDict(self.props.pureData).en[this['hc-key']] + '</b></span> <br> ' + intl.formatMessage({ id:  self.props.tooltipTranslateKey}) + ': ' + this.value.toLocaleString('ru')
            // }
          } else {
            return '<span><b>' + dictionary[this['hc-key']] + '</b></span> <br> ' + this.value.toLocaleString(self.props.lang === 'en' ? 'en' : 'ru')
            // if (self.props.lang === 'ru') {
            //   return '<span><b>' + self.prepareKyrgyzstanMapDict(self.props.pureData).ru[this['hc-key']] + '</b></span> <br> ' + this.value.toLocaleString('ru')
            // } else {
            //   return '<span><b>' + self.prepareKyrgyzstanMapDict(self.props.pureData).en[this['hc-key']] + '</b></span> <br> ' + this.value.toLocaleString('ru')
            // }
          }
        },
      },
      series: [{
        // data: this.props.data,
        data: this.props.data.map((item, index) => {
          let mapData = {
            'hc-key': _.find(REGIONS, { ru: item[0] }).key,
            // 'hc-key': item[0] ? _.find(REGIONS, {ru: item[0]}).key : "NULL",
            'value': item[1],

            // color: `#72BBDB${10 * index !== 0 ? 10 * index: ''}`,
            color: `#72BBDB${index > 0 ? 100 - (10 * index) : ''}`,
          }

          if (self.props.changeOnHover) {
            mapData = _.merge({}, mapData, {
              lotsAmount: item[2],
              lotsAmountTest: intl.formatMessage({ id: 'page.common.text.12' }),
              plansAmount: item[3],
              plansAmountTest: intl.formatMessage({ id: 'page.common.text.11' }),
            })
          }

          return mapData
          // return [item.key.en, item.amount]
        }),
        name: '',
        borderColor: '#489EAE',
        borderWidth: 1,
        states: {
          hover: {
            // color: 'rgba(25,118,210 ,1)',
            color: '#5992C0',
          },
        },
        plotOptions: {
          map: {
            color: '#489EAE',
            allAreas: false,
            joinBy: ['iso-a2', 'code'],
            dataLabels: {
              enabled: true,
              color: 'white',
              style: {
                fontWeight: 'bold',
              },
            },
            mapData: Highcharts.maps['countries/kg/kg-all'] = kyrgyzstanMapSourceMOCK,
          },
        },
        dataLabels: {
          enabled: false,
          formatter: function () {
            return self.props.lang === 'ru' ? self.prepareKyrgyzstanMapDict(self.props.pureData).ru[this.point['hc-key']] : self.prepareKyrgyzstanMapDict(self.props.pureData).en[this.point['hc-key']]
          },
        },
      }],
    }

    return <ReactHighmaps
      config={mapConfig}
      key={generate()}
      id="belarus-map"
      ref="belarus-map"
    />
  }
}
