import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactHighmaps from 'react-highcharts/ReactHighmaps'
import { generate } from 'shortid'
import Highcharts from 'highcharts/highmaps'
import belarusMapSource from './belarusMapSource'

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

export default class BelarusMap extends Component {

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
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !JSON.stringify(this.props) === JSON.stringify(nextProps)
  }

  prepareBelarusMapDict = data => {
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

    const REGIONS = [
      {
        ru: 'Бишкек',
        en: 'Bishkek',
      },
      {
        ru: 'Баткенская область',
        en: 'Batken region',
      },
      {
        ru: 'Чуйская область',
        en: 'Chuy region',
      },
      {
        ru: 'Иссык-Кульская область',
        en: 'Ysyk-Köl region',
      },
      {
        ru: 'Нарынская область',
        en: 'Naryn region',
      },
      {
        ru: 'Таласская область',
        en: 'Talas region',
      },
      {
        ru: 'Ошская область',
        en: 'Osh region',
      },
      {
        ru: 'Джалал-Абадская область',
        en: 'Jalal-Abad region',
      },
    ]
    let preparedData = _.cloneDeep(data)
    return {
      ru: _.reduce(preparedData, function (obj, item) {
        obj[item.key.en] = item.key.ru
        return obj
      }, {}),
      en: _.reduce(preparedData, function (obj, item) {
        obj[item.key.en] = _.find(REGIONS, o => {
          return o.ru === item.key.ru
        }).en
        return obj
      }, {}),
    }
  }

  render() {
    const { intl } = this.context
    const self = this
    let mapConfig = {
      chart: {
        height: 590,
        map: 'countries/kg/kg-all',
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
      },
      title: {
        text: intl.formatMessage({ id: 'page.statistic.text.006.1' }),
        align: 'left',
        style: { 'font-weigth': 'bold' },
      },
      colorAxis: {
        labels: {
          formatter: function () {
            return numeral(this.value).format('0 a')
          },
        },
        tickPositioner: function (min, max) {
          return [min, min + (max - min) * (1 / 3), min + (max - min) * (2 / 3), max]
        },
      },
      legend: {
        layout: 'horizontal',
        align: 'bottom',
        verticalAlign: 'bottom',
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        headerFormat: '',
        pointFormatter: function () {
          if (self.props.lang === 'ru') {
            return '<span><b>' + self.prepareBelarusMapDict(MOCK_DATA).ru[this['hc-key']] + '</b></span> <br> ' + intl.formatMessage({ id: 'page.statistic.text.006' }) + ': ' + this.value.toLocaleString('ru')
          } else {
            return '<span><b>' + self.prepareBelarusMapDict(MOCK_DATA).en[this['hc-key']] + '</b></span> <br> ' + intl.formatMessage({ id: 'page.statistic.text.006' }) + ': ' + this.value.toLocaleString('ru')
          }
        },
      },
      series: [{
        // data: this.props.data,
        data: MOCK_DATA.map((item, index) => {
          return {
            'hc-key': item.key.en,
            'value': item.amount,
            color: index === 3 ? '#72BBDB' : '#FFFFFF',
          }
        }),
        name: '',
        borderColor: '#489EAE',
        borderWidth: 1,
        states: {
          hover: {
            color: 'rgba(25,118,210 ,1)',
          },
        },
        plotOptions: {
          map: {
            allAreas: false,
            joinBy: ['iso-a2', 'code'],
            dataLabels: {
              enabled: false,
              color: 'white',
              style: {
                fontWeight: 'bold',
              },
            },
            mapData: Highcharts.maps['countries/kg/kg-all'] = belarusMapSource,
          },
        },
        dataLabels: {
          enabled: false,
          formatter: function () {
            return self.props.lang === 'ru' ? self.prepareBelarusMapDict(MOCK_DATA).ru[this.point['hc-key']] : self.prepareBelarusMapDict(self.props.pureData).en[this.point['hc-key']]
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
