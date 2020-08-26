import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactHighmaps from 'react-highcharts/ReactHighmaps'
import { generate } from 'shortid'
import _ from 'lodash'

import Highcharts from 'highcharts/highmaps'
import WorldMapSource from './WorldMapSource'

import './flags.css'
import * as numeral from 'numeral'

export default class WorldMap extends Component {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    countriesDict: PropTypes.object,
    lang: PropTypes.string,
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !_.isEqual(nextProps.data, this.props.data)
  }

  render() {
    const { intl } = this.context
    const { countriesDict } = this.props
    const self = this
    let mapConfig = {
      chart: {
        height: 590,
        map: 'custom/world',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Oswald', //'Open Sans'
        },
      },
      title: {
        text: intl.formatMessage({ id: 'common.supplierGeography.text' }),
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
      legend: {
        enabled: true,
        useHTML:true,
        title: {
          text: intl.formatMessage({ id: 'page.common.text.36' }),
          style: {
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            textAlign: 'center',
            letterSpacing: '0.05em',
            color: '#AFAFAF',
          },
        },
      },

      credits: {
        enabled: false,
      },
      tooltip: {
        backgroundColor: 'none',
        borderWidth: 0,
        shadow: false,
        useHTML: true,
        padding: 0,
        pointFormatter: function () {
          // const countryName = self.props.lang === 'ru' ? countriesDict[this['iso-a3']] : this.code
          const countryName = self.props.lang === 'ru' ? this.options.name : this.name
          return '<div class="f32"><div class="flag ' + this.properties['hc-key'] + '">' +
            '</div><span>' + countryName + '</span></div>' +
            '<span style="font-size:15px">' + this.value + ' ' + intl.formatMessage({ id: 'page.statistic.text.068' }) + '</span>'
        },
        // positioner: function () {
        //   return {
        //     x: 0,
        //     y: 250,
        //   }
        // },
      },
      colorAxis: {
        min: 1,
        max: 1000,
        type: 'logarithmic',
        minColor: '#E7E7E7',
        maxColor: '#C4C4C4',
        labels: {
          // format: '{value:,.0f}',
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
      },
      series: [{
        data: this.props.data,
        joinBy: ['iso-a3', 'code'],
        name: intl.formatMessage({ id: 'common.supplierGeography.text' }),
        borderColor: '#489EAE',
        borderWidth: 1,
        states: {
          // color: 'rgba(13,71,161 ,1)',
          color: 'rgba(13,71,161 ,1)',
          hover: {
            // color: 'rgba(25,118,210 ,1)',
            // color: 'rgba(25,118,210 ,1)',
            color: '#5992C0',
          },
        },
        plotOptions: {
          map: {
            mapData: Highcharts.maps['custom/world'] = WorldMapSource,
          },
        },
      },
      ],
    }

    return <ReactHighmaps
      config={mapConfig}
      key={generate()}
      id="belarus-map"
      ref="belarus-map"
    />
  }
}
