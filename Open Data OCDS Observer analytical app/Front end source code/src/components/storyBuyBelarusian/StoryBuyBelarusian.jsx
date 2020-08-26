import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import { generate } from 'shortid'

import { bindActionCreators } from 'redux'

import {
  getBelarusProductsShare,
  getCountriesOkrbTopAmount,
  getProductCountriesContractItemsAmount,
  getBuyKyrgyzstanData,
} from '../../store/stories/buyBelarusian/actions'

import DateSelector from '../dateSelector/DateSelector'
import Loader from '../loader/Loader'
import SlideArrow from '../slideArrow/SlideArrow'
import KyrgyzstanMap from '../belarusMap/KyrgystanMap'

import ReactHighmaps from 'react-highcharts/ReactHighmaps'
import ReactHighcharts from 'react-highcharts'
import Highcharts from 'highcharts/highmaps'
import WorldMapSource from '../worldMap/WorldMapSource'
import * as numeral from 'numeral'

import './StoryBuyBelarusian.scss'
import { FormattedMessage } from 'react-intl'
import { setCurrentRoute } from '../../store/navigation/NavActions'


const BUY_DATA = {
  allRegions: {
    top10Products: _.map(['44', '45', '03', '48', '09', '90', '92', '50', '51', '98'], (cpvCode) => ({
      cpv: cpvCode,
      lotsAmount: Math.floor(Math.random() * Math.floor(100)),
      planAmount: Math.floor(Math.random() * Math.floor(100)),
    })),
  },
  eachRegion: [
    {
      name: 'Бишкек',
      top10Products: _.map(['55', '14', '15', '16', '18', '19', '60', '63', '64', '65'], (cpvCode) => ({
        cpv: cpvCode,
        lotsAmount: Math.floor(Math.random() * Math.floor(100)),
        planAmount: Math.floor(Math.random() * Math.floor(100)),
      })),
    },
    {
      name: 'Баткенская Область',
      top10Products: _.map(['22', '66', '24', '70', '71', '72', '73', '30', '75', '31'], (cpvCode) => ({
        cpv: cpvCode,
        lotsAmount: Math.floor(Math.random() * Math.floor(100)),
        planAmount: Math.floor(Math.random() * Math.floor(100)),
      })),
    },
    {
      name: 'Чуйская Область',
      top10Products: _.map(['76', '32', '77', '33', '34', '79', '35', '37', '38', '39'], (cpvCode) => ({
        cpv: cpvCode,
        lotsAmount: Math.floor(Math.random() * Math.floor(100)),
        planAmount: Math.floor(Math.random() * Math.floor(100)),
      })),
    },
    {
      name: 'Иссык-Кульская Область',
      top10Products: _.map(['80', '85', '41', '42', '43', '44', '45', '03', '48', '09'], (cpvCode) => ({
        cpv: cpvCode,
        lotsAmount: Math.floor(Math.random() * Math.floor(100)),
        planAmount: Math.floor(Math.random() * Math.floor(100)),
      })),
    },
    {
      name: 'Нарынская Область',
      top10Products: _.map(['90', '92', '50', '51', '98', '55', '14', '15', '16', '18'], (cpvCode) => ({
        cpv: cpvCode,
        lotsAmount: Math.floor(Math.random() * Math.floor(100)),
        planAmount: Math.floor(Math.random() * Math.floor(100)),
      })),
    },
    {
      name: 'Таласская Область',
      top10Products: _.map(['19', '60', '63', '64', '65', '22', '66', '24', '70', '71'], (cpvCode) => ({
        cpv: cpvCode,
        lotsAmount: Math.floor(Math.random() * Math.floor(100)),
        planAmount: Math.floor(Math.random() * Math.floor(100)),
      })),
    },
    {
      name: 'Ошская Область',
      top10Products: _.map(['72', '73', '30', '75', '31', '76', '32', '77', '33', '34'], (cpvCode) => ({
        cpv: cpvCode,
        lotsAmount: Math.floor(Math.random() * Math.floor(100)),
        planAmount: Math.floor(Math.random() * Math.floor(100)),
      })),
    },
    {
      name: 'Джалал-Абадская Область',
      top10Products: _.map(['79', '35', '37', '38', '39', '80', '85', '41', '42', '43'], (cpvCode) => ({
        cpv: cpvCode,
        lotsAmount: Math.floor(Math.random() * Math.floor(100)),
        planAmount: Math.floor(Math.random() * Math.floor(100)),
      })),
    },
  ],
}

// const TEMP_DATA = [
//     { name:'Бишкек', value: 1},
//     { name:'Ошская Область', value: 2},
//     { name:'Баткенская Область', value: 3},
//     { name:'Джалал-Абадская Область', value: 4},
//     { name:'Таласская Область', value: 5},
//     { name:'Иссык-Кульская Область', value: 6},
//     { name:'Нарынская Область', value: 7},
//     { name:'Чуйская Область', value: 8},
//     { name:'Ош', value: 9},
// ]

const TEMP_DATA = [
  ['Бишкек', 8],
  ['Баткенская Область', 7],
  ['Чуйская Область', 6],
  ['Иссык-Кульская Область', 5],
  ['Нарынская Область', 4],
  ['Таласская Область', 3],
  ['Ошская Область', 2],
  ['Джалал-Абадская Область', 1],
  ['Ош', 1],
]


class StoryBuyBelarusian extends React.Component {

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    props.setCurrentRoute('/dashboard/buy-kyrgyzstan')
    // this.props.getProductCountriesContractItemsAmount({ year: 'last' })
    this.props.getBuyKyrgyzstanData(moment().format('YYYY'))
    // this.props.getCountriesOkrbTopAmount({ year: 'last' })
    // this.props.getBelarusProductsShare({ year: 'last' })
    this.state = {
      pieChartDisplay: true,
      selectedRegionName: null,
    }
  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   return !_.isEqual(
  //     !_.isEqual(nextProps.productCountries, this.props.productCountries),
  //     !_.isEqual(nextProps.countriesTop, this.props.countriesTop),
  //     !_.isEqual(nextProps.belarusProductsShare, this.props.belarusProductsShare),
  //   )
  // }

  prepareWorldMapData = data => {
    let preparedData = _.cloneDeep(data)
    return {
      data: () => {
        return preparedData.map((item) => {
          return {
            'code': item.key.en,
            'value': item.amount,
          }
        })
      },
      dictionary: () => {
        if (this.props.lang === 'ru') {
          return preparedData.reduce((obj, item) => (obj[item.key.en] = item.key.ru, obj), {})
        }
        return preparedData.reduce((obj, item) => (obj[item.key.en] = item.key.en, obj), {})
      },
    }
  }

  getStoryChartConfig = (mapData, pieData) => {
    const self = this
    const { selectedRegionName } = this.state
    let buyDataPrepared = this.prepareDataForBarChart()
    // let workData = selectedRegionName ? _.find(BUY_DATA.eachRegion, { name: selectedRegionName }) : BUY_DATA.allRegions
    let workData = selectedRegionName ? _.find(buyDataPrepared.eachRegion, { name: selectedRegionName }) : buyDataPrepared.allRegions
    // workData
    //   // allRegions
    //   // eachRegion
    //   selectedRegionName
    const clonedMapData = _.cloneDeep(mapData)
    const clonedPieData = _.cloneDeep(pieData)
    const { intl } = this.context
    return {
      getMapConf: () => {
        const countriesDict = this.prepareWorldMapData(clonedMapData).dictionary()
        let config = {
          chart: {
            height: 500,
            map: 'custom/world',
            backgroundColor: null,
            style: {
              fontFamily: 'Oswald', //'Open Sans'
            },
          },
          title: {
            useHTML: true,
            text: '<span class="story-info-value">' + numeral(self.props.belarusProductsShare.share).format('0') + '%</span>' + ' ' + intl.formatMessage({ id: 'page.statistic.text.077' }),
            align: 'left',
            style: { 'font-weigth': 'bold', 'color': '#FFF' },
          },
          legend: {
            title: {
              text: '',
              style: {
                color: '#FFF',
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
            headerFormat: '',
            pointFormatter: function () {
              if (_.isEmpty(countriesDict)) return
              return '<span style="color: #FFF" ><span class="f32"><span class="flag ' + this.properties['hc-key'] + '">' +
                '</span></span> ' + countriesDict[this['iso-a3']] + '<br>' + '</span>'
            },
            positioner: function () {
              return {
                x: 0,
                y: 250,
              }
            },
          },
          colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic',
            minColor: '#90A4AE',
            maxColor: '#57D0B3',
            labels: {
              style: {
                'color': '#FFFFFF',
              },
              formatter: function () {
                return numeral(this.value).format('0 a')
              },
            },
            tickPositioner: function (min, max) {
              return [min, min + (max - min) * (1 / 3), min + (max - min) * (2 / 3), max]
            },
          },
          series: [{
            point: {
              events: {
                click: function (e) {
                  if (clonedPieData[e.target.point.code] === undefined) {
                    self.refs['story-pie-chart'].chart.series[0].setData({ name: null, y: 0 })
                  } else {
                    self.refs['story-pie-chart'].chart.series[0].setData(clonedPieData[e.target.point.code].values.map(
                      item => {
                        return { name: item.key.ru, y: item.amount }
                      },
                    ))
                  }
                },
              },
            },
            events: {
              mouseOut: function () {
              },
            },
            data: this.prepareWorldMapData(clonedMapData).data(),
            joinBy: ['iso-a3', 'code'],
            name: '',
            borderColor: 'rgba(0,0,0,0)',
            borderWidth: 2,
            states: {
              hover: {
                color: 'rgba(255,138,101 ,1)',
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
        return config
      },
      getPieConf: () => {
        let config = {
          chart: {
            type: 'bar',
            height: 550,
            backgroundColor: null,
            style: {
              fontFamily: 'Oswald', //'Open Sans'
            },
          },
          title: {
            text: intl.formatMessage({ id: 'page.common.text.10' }),
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
          tooltip: {
            // self.props.changeOnHover
            formatter: function () {
              if (this.point.lotsAmountDangerFlag) {
                return '<span style="font-size: 14px">' + this.key + '</span><br/>'
                  + '<span  style="font-size: 14px">' + this.point.fieldDescriptionPublished + '</span>' + ': ' + '<span  style="font-size: 14px; font-weight: 600; color:#FF0000">' + this.point.fieldAmount.toLocaleString(self.props.lang === 'en' ? 'en' : 'ru') + '</span><span style="font-size: 14px; font-weight: 600">' + ' ' + intl.formatMessage({ id: 'common.byn.text' }) + '</span><br/>'
                  + '<span  style="font-size: 14px">' + this.point.fieldDescriptionLots + '</span>' + ': ' + '<span  style="font-size: 14px; font-weight: 600">' + this.point.fieldAmountPlaned.toLocaleString(self.props.lang === 'en' ? 'en' : 'ru') + ' ' + intl.formatMessage({ id: 'common.byn.text' }) + '</span>'
              } else {
                return '<span style="font-size: 14px">' + this.key + '</span><br/>'
                  + '<span  style="font-size: 14px">' + this.point.fieldDescription + '</span>' + ': ' + '<span  style="font-size: 14px; font-weight: 600">' + numeral(this.point.fieldAmount).format('0.0 a').toLocaleString(self.props.lang === 'en' ? 'en' : 'ru') + ' ' + intl.formatMessage({ id: 'common.byn.text' }) + '</span>'
              }
            },
          },
          xAxis: {
            categories: _.map(workData.top10Products, (product) => {
              let i18nCpv = _.find(this.props.translationI18nData.entries, { key: product.cpv })
              return !_.isEmpty(i18nCpv) ? (this.props.lang === 'en' ? i18nCpv.en : i18nCpv.ru) : ''
            }),
            lineWidth: 0,
            title: {
              text: null,
            },
            labels: {
              style: {
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'right',
                letterSpacing: '0.05em',
                color: '#AFAFAF',
              },
            },
          },
          yAxis: {
            lineColor: '#CBCBCB',
            // lineColor: '#AFAFAF',
            lineWidth: 0.5,
            min: 0,
            // offset: 10,
            title: {
              // margin: 30,
              text: intl.formatMessage({ id: 'common.byn.text' }),
              style: {
                fontWeight: 'normal',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.05em',
                color: '#AFAFAF',
              },
            },
            labels: {
              enabled: false,
              // formatter: function () {
              //   return numeral(this.value).format('0 a')
              // },
            },
          },
          legend: {
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
              letterSpacing: '0.05em',
              display: 'inline-block',
            },
            // labelFormatter: function () {
            //   return this.legendText
            // },
          },
          credits: {
            enabled: false,
          },
          plotOptions: {
            series: {
              stacking: 'normal',
            },
          },
          series: !_.isEmpty(workData) ? [{
            name: intl.formatMessage({ id: 'page.common.text.11' }),
            borderWidth: 0,
            color: '#ADD3D6',
            legendIndex: 2,
            // data: _.map(workData.top10Products, (product) => (product.planAmount)),
            data: _.map(workData.top10Products, (product) => ({
              y: product.planAmount,
              fieldAmount: product.planAmountSum,
              fieldAmountPlaned: product.planAmountSum,
              fieldAmountLots: product.lotsAmountSum,
              fieldDescription: intl.formatMessage({ id: 'page.common.text.11' }),
              fieldDescriptionPublished: intl.formatMessage({ id: 'page.common.text.12' }),
              fieldDescriptionLots: intl.formatMessage({ id: 'page.common.text.11' }),
              lotsAmountDangerFlag: product.lotsAmountDangerFlag,
            })),

            // dataLabels: {
            //   verticalAlign: 'top',
            //   enabled: true,
            //   connectorColor: '#000000',
            //   style: {
            //     fontWeight: 600,
            //     fontSize: '14px',
            //     color: '#7e7e7e',
            //     textOutline: 0,
            //   },
            //   // color: '#333',
            //   //inside: true
            // },
          }, {
            name: intl.formatMessage({ id: 'page.common.text.12' }),
            borderWidth: 0,
            color: '#5992C0',
            legendIndex: 1,
            // data: _.map(workData.top10Products, (product) => (product.lotsAmount)),
            data: _.map(workData.top10Products, (product) => ({
              y: product.lotsAmount,
              fieldAmount: product.lotsAmountSum,
              fieldAmountPlaned: product.planAmountSum,
              fieldAmountLots: product.lotsAmountSum,
              fieldDescription: intl.formatMessage({ id: 'page.common.text.12' }),
              fieldDescriptionPublished: intl.formatMessage({ id: 'page.common.text.12' }),
              fieldDescriptionLots: intl.formatMessage({ id: 'page.common.text.11' }),
              lotsAmountDangerFlag: product.lotsAmountDangerFlag,
            })),

            // dataLabels: {
            //   verticalAlign: 'top',
            //   enabled: true,
            //   connectorColor: '#000000',
            //   style: {
            //     fontWeight: 600,
            //     fontSize: '14px',
            //     color: '#ffffff',
            //     textOutline: 0,
            //   },
            //   // color: '#333',
            //   //inside: true
            // },
          }] : [],

          // series: [{
          //   name: intl.formatMessage({ id: 'page.common.text.11' }),
          //   borderWidth: 0,
          //   color: '#ADD3D6',
          //   legendIndex: 2,
          //   data: [2, 2, 3, 2, 1, 4, 1, 3, 8, 6],
          // }, {
          //   name: intl.formatMessage({ id: 'page.common.text.12' }),
          //   borderWidth: 0,
          //   color: '#5992C0',
          //   legendIndex: 1,
          //   data: [5, 3, 4, 7, 2, 6, 8, 3, 1, 4],
          // }],
        }


        // let config = {
        //   chart: {
        //     type: 'pie',
        //     height: 500,
        //     backgroundColor: null,
        //     style: {
        //       fontFamily: 'Oswald', //'Open Sans'
        //     },
        //   },
        //   colors: ['#64B5F6', '#81C784', '#FFB74D', '#90A4AE', '#E57373'],
        //   legend: {
        //     itemStyle: {
        //       color: '#FFF',
        //     },
        //   },
        //   title: {
        //     text: intl.formatMessage({ id: 'page.statistic.text.078' }),
        //     style: {
        //       color: '#FFF',
        //     },
        //   },
        //   credits: {
        //     enabled: false,
        //   },
        //   plotOptions: {
        //     pie: {
        //       allowPointSelect: true,
        //       cursor: 'pointer',
        //       dataLabels: {
        //         enabled: true,
        //         format: '<b>{point.percentage:.0f} %</b>',
        //         distance: -50,
        //         style: {
        //           textOutline: false,
        //           color: '#212121',
        //         },
        //         filter: {
        //           property: 'percentage',
        //           operator: '>',
        //           value: 4,
        //         },
        //       },
        //       showInLegend: true,
        //     },
        //   },
        //   tooltip: {
        //     headerFormat: '',
        //     formatter: function () {
        //       return '<b>' + this.point.name + ': </b><br> ' + intl.formatMessage({ id: 'page.statistic.text.079' }) + ': ' + numeral(this.point.y).format('0.00 a') + ' ' + intl.formatMessage({ id: 'common.byn.text' }) + ' <br>' + intl.formatMessage({ id: 'page.statistic.text.066' }) + ': ' + Math.round(this.point.percentage) + '%'
        //     },
        //   },
        //   series: [{
        //     name: 'TOP-5 Предметов Закупок',
        //     borderColor: 'rgba(0,0,0,0)',
        //     borderWidth: 2,
        //   }],
        // }

        // config.series[0].data = clonedPieData[Object.keys(clonedPieData)[0]].values.map(item => {
        //   return {
        //     name: item.key.ru,
        //     y: item.amount,
        //   }
        // })

        return config
      },
    }
  }


  fetchData = (startDate, endDate, year) => {
    // this.props.getCountriesOkrbTopAmount({ year: year || 'last' })
    // this.props.getProductCountriesContractItemsAmount({ year: year || 'last' })
    this.props.getBuyKyrgyzstanData(year || moment().format('YYYY'))
    // this.props.getBelarusProductsShare({ year: year || 'last' })
  }

  handleScrollToFirstBlock = () => {
    document.getElementById('start-page').scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  hoverRegions = (selectedRegion) => {
    this.setState({
      selectedRegionName: selectedRegion,
    })
  }

  prepareMapData = () => {
    return _.map(_.orderBy(this.props.buyKyrgyzstanData.lotsAmountFromPlannedAmountByRegion, ['value'], 'desc'), (itemData) => ([itemData.name, itemData.percent, itemData.lotsAmount, itemData.plansAmount]))
  }


  prepareDataForBarChart = () => {
    return {
      allRegions: {
        top10Products: _.map(this.props.buyKyrgyzstanData.countryTop10Planned, (plannedData) => {
          // let allAmount = plannedData.planAmount + plannedData.lotsAmount
          // let planAmountPercent = plannedData.planAmount === 0 ? 0 : Math.round(((plannedData.planAmount / allAmount) * 100))
          // let lotsAmountPercent = 100 - planAmountPercent

          // let lotsAmountPercent = plannedData.lotsAmount === 0 ? 0 : Math.round(((plannedData.lotsAmount / plannedData.planAmount) * 100))
          let lotsAmountPercent = plannedData.lotsAmount === 0 ? 0 : parseInt(((plannedData.lotsAmount / plannedData.planAmount) * 100))
          lotsAmountPercent = lotsAmountPercent > 100 ? 100 : lotsAmountPercent
          let planAmountPercent = 100 - lotsAmountPercent

          return {
            cpv: plannedData.name,
            lotsAmount: lotsAmountPercent,
            planAmount: planAmountPercent,
            lotsAmountSum: plannedData.lotsAmount,
            planAmountSum: plannedData.planAmount,
            lotsAmountDangerFlag: plannedData.lotsAmount > plannedData.planAmount,
          }
        }),
      },
      eachRegion: _.map(this.props.buyKyrgyzstanData.top10PlannedByRegion, (regionData) => ({
        name: regionData.name,
        top10Products: _.map(regionData.cpvs, (cpvData) => {
          // let allAmount = cpvData.planAmount + cpvData.lotsAmount
          // let planAmountPercent = cpvData.planAmount === 0 ? 0 : Math.round(((cpvData.planAmount / allAmount) * 100))
          // let planAmountPercent = cpvData.planAmount === 0 ? 0 : Math.round(((cpvData.planAmount / allAmount) * 100))
          // let lotsAmountPercent = 100 - planAmountPercent
          // let lotsAmountPercent = cpvData.lotsAmount === 0 ? 0 : Math.round(((cpvData.lotsAmount / cpvData.planAmount) * 100))
          let lotsAmountPercent = cpvData.lotsAmount === 0 ? 0 : parseInt(((cpvData.lotsAmount / cpvData.planAmount) * 100))
          lotsAmountPercent = lotsAmountPercent > 100 ? 100 : lotsAmountPercent
          let planAmountPercent = 100 - lotsAmountPercent

          return {
            cpv: cpvData.name,
            planAmount: planAmountPercent,
            lotsAmount: lotsAmountPercent,
            lotsAmountSum: cpvData.lotsAmount,
            planAmountSum: cpvData.planAmount,
            lotsAmountDangerFlag: cpvData.lotsAmount > cpvData.planAmount,
          }
        }),
      })),
    }
  }

  render() {
    const {
      productCountries,
      belarusProductsShare,
      countriesTop,
      buyKyrgyzstanData,
    } = this.props

    const { selectedRegionName } = this.state

    let regionPercentAmount = selectedRegionName ? numeral(_.find(buyKyrgyzstanData.lotsAmountFromPlannedAmountByRegion, { name: selectedRegionName }).percent).format('0') : numeral(buyKyrgyzstanData.lotsAmountFromPlannedAmount).format('0')

    return (
      <div className="StoryBuyBelarusian">
        <div className="">
          <Fragment>
            {this.props.buyKyrgyzstanDataIsFetching ?
              <Loader
                theme={'light'}
                isActive={_.isEmpty(productCountries && countriesTop)}
              /> :
              <div className="row">
                <div className="col-md-12 col-xl-8">
                  <div className="row">
                    <div className="col-md-12 col-xl-12">
                      <div className="info-value" ref="story-info-value-two">
                          <span className='story-info-value-percent'
                                ref="story-info-value-uncompetitive">{regionPercentAmount}%</span>
                        <span className="story-info-value-text"><FormattedMessage
                          id="page.statistic.text.070.1" /></span>
                      </div>
                    </div>
                  </div>


                  {/*<ReactHighmaps*/}
                  {/*  key={generate()}*/}
                  {/*  config={this.getStoryChartConfig(productCountries, countriesTop).getMapConf()}*/}
                  {/*  id="story-map-chart"*/}
                  {/*  ref="story-map-chart"*/}
                  {/*/>*/}
                  <KyrgyzstanMap
                    // data={TEMP_DATA}
                    data={this.prepareMapData()}
                    // pureData={TEMP_DATA}
                    pureData={this.prepareMapData()}
                    title={null}
                    height={550}
                    changeOnHover={true}
                    // countriesDict={this.prepareBelarusMapDict(this.props.buyersRegionsBuyersCount)}
                    lang={this.props.lang}
                    hoverRegion={this.hoverRegions}
                    selectedRegion={this.state.selectedRegionName}
                    tooltipTranslateKey=""
                  />

                </div>
                <div className="col-md-12 col-xl-4">
                  <div className={this.state.pieChartDisplay ? '' : 'invisible'}>
                    <ReactHighcharts
                      key={generate()}
                      config={this.getStoryChartConfig(productCountries, countriesTop).getPieConf()}
                      id="story-pie-chart"
                      ref="story-pie-chart"
                    />
                  </div>
                </div>
              </div>}
            {/*<p style={{*/}
            {/*  color: "#ffffff",*/}
            {/*  textAlign: "right",*/}
            {/*  fontSize: '12px',*/}
            {/*}}><FormattedMessage id="common.footer.info.label" /> zakupki.gov.kg/popp/home.xhtml</p>*/}
            <DateSelector onClick={(start, end, year) => this.fetchData(start, end, year)} onlyYears={true} customStartDate={true}/>
            <div className="row justify-content-center margin-top-30">
              <SlideArrow onClick={this.handleScrollToFirstBlock} />
            </div>
          </Fragment>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({
                           buyBelarusianState,
                           locale,
                           dashboard,
                         }) => {
  return {
    productCountries: buyBelarusianState.productCountriesContractItemsAmount,
    productCountriesIsFetching: buyBelarusianState.productCountriesContractItemsAmountIsFetching,
    countriesTop: buyBelarusianState.countriesOkrbTopAmount,
    countriesTopIsFetching: buyBelarusianState.countriesOkrbTopAmountIsFetching,
    belarusProductsShare: buyBelarusianState.belarusProductsShare,
    buyKyrgyzstanData: buyBelarusianState.buyKyrgyzstanData,
    buyKyrgyzstanDataIsFetching: buyBelarusianState.buyKyrgyzstanDataIsFetching,
    lang: locale.lang,
    translationI18nData: dashboard.translationI18nData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProductCountriesContractItemsAmount: bindActionCreators(getProductCountriesContractItemsAmount, dispatch),
    getCountriesOkrbTopAmount: bindActionCreators(getCountriesOkrbTopAmount, dispatch),
    getBelarusProductsShare: bindActionCreators(getBelarusProductsShare, dispatch),
    setCurrentRoute: bindActionCreators(setCurrentRoute, dispatch),
    getBuyKyrgyzstanData: bindActionCreators(getBuyKyrgyzstanData, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoryBuyBelarusian)
