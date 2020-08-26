import Highcharts from 'highcharts/highmaps'
import WorldMapSource from '../worldMap/WorldMapSource'
import belarusMapSource from '../belarusMap/belarusMapSource'
import kyrgyzstanMapSource from '../belarusMap/kyrgyzstanMapSource'
import kyrgyzstanMapSourceMOCK from '../belarusMap/kyrgyzstanMapSourceMOCK'
import * as numeral from 'numeral'
import { FormattedMessage } from 'react-intl'
import React from 'react'


export const TOP_RESIDENT_NON_RESIDENT_OKRBS_MAP_CONFIG = {
  chart: {
    map: 'countries/kg/kg-all',
    backgroundColor: null,
    style: {
      fontFamily: 'Oswald', //'Open Sans'
    },
    height: 550,
  },
  title: {
    text: '',
    // align: 'left',
    style: { 'font-weigth': 'bold', 'color': '#FFF' },
  },
  colors: ['#cc0000', '#00cc00', '#0000cc', '#cccc00', '#00cccc', '#cccccc'],
  colorAxis: {
    min: 0,
  },
  legend: {
    // layout: 'vertical',
    align: 'left',
    verticalAlign: 'top',
  },
  credits: {
    enabled: false,
  },
  tooltip: {},
  series: [{
    name: 'География распределения',
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
  }],
}

export const SUPPLIER_GEOGRAPHY_MAP_CONFIG = {
  chart: {
    map: 'custom/world',
    backgroundColor: null,
    // height: 800,
    height: window.innerWidth < 600 ? window.innerWidth + 50 : window.innerHeight - 150,
    // width: 1200,
    marginTop: 0,
    reflow: false,
    marginLeft: 50,
    marginRight: 20,
    style: {
      fontFamily: 'Oswald', //'Open Sans'
    },
  },
  title: {
    text: '',
    // align: 'left',
    style: { 'font-weigth': 'bold', 'color': '#FFF' },
  },
  legend: {
    // boxWidth: 450,
    // align: 'center',
    title: {
      text: '',
      style: {
        // color: (Highcharts.theme && Highcharts.theme.textColor) || '#FFFFFF',
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
  colorAxis: {
    min: 1,
    max: 1000000,
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
    },
  },
  credits: {
    enabled: false,
  },
  series: [{
    joinBy: ['iso-a3', 'code'],
    name: 'Количество поставщиков',
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
        mapData: Highcharts.maps['custom/world'] = WorldMapSource,
      },
    },
  }],
}

export const COUNTRY_RANKING_BAR_CHART_CONFIG = {
  chart: {
    height: 600,
    type: 'bar',
    backgroundColor: null,
    style: {
      fontFamily: 'Oswald', //'Open Sans'
    },
  },
  title: {
    text: '',
    style: { 'font-weigth': 'bold', 'color': '#FFF' },
  },
  yAxis: {
    // lineColor: '#AFAFAF',
    gridLineWidth: 1,
    gridLineColor: '#CBCBCB',
    lineWidth: 0,
    min: 0,
    offset: 10,
    title: '',
    labels: {
      formatter: function () {
        return numeral(this.value).format('0 a')
      },
      style: {
        color: '#AFAFAF',
      },
    },

  },
  tooltip: {
    useHTML: true,
    formatter: function () {
      return '<span>' + this.point.name +
        ': <b>' + numeral(this.point.y).format('0 a') + ' сом. (KGS)</b>'
        + '</span>'
    },
  },
  xAxis: {
    lineColor: '#CBCBCB',
    lineWidth: 1,
    tickInterval: 1,
    categories: [],
    // offset: 30,
    labels: {
      x: -40,
      y: 0,
      style: {
        color: '#AFAFAF',
      },
    },
    // labels: {
    //   style: { 'color': '#FFFFFF', 'width': '120px' },
    // },
  },
  series: [
    {},
  ],
  legend: {
    enabled: false,
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: false,
        color: 'grey',
      },
    },
  },
  credits: {
    enabled: false,
  },
}

// export const DISTRIBUTION_OF_SUPPLIER_COUNTRIES_CONFIG = {
//   chart: {
//     backgroundColor: null,
//     plotBackgroundColor: null,
//     plotBorderWidth: null,
//     plotShadow: false,
//     type: 'pie',
// style: {
//   fontFamily: 'Oswald' //'Open Sans'
// }
//   },
//   title: {
//     text: 'Распределение стран поставщиков нерезидентов',
//     style: { 'font-weigth': 'bold', 'color': '#FFF' },
//   },
//   credits: {
//     enabled: false,
//   },
//   colors: [ '#5C6BC080', '#66BB6A80' ],
//   tooltip: {
//     formatter: function () {
//       return '<b>' + this.point.name + ': </b><br> Количество: <b>' + numeral(this.point.y).format('0 a') + ' бел. руб. (KGS)' + '</b><br> Доля: <b>' + numeral(this.point.percentage).format('0') + '%</b>'
//     },
//   },
//   legend: {
//     itemStyle: {
//       color: '#FFFFFF',
//     },
//     itemHoverStyle: {
//       color: '#FFFFFF80',
//     },
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
//           color: '#f7f7f7'
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
//   series: [ {
//     name: 'Capital',
//   } ],
// }

export const DISTRIBUTION_OF_SUPPLIER_COUNTRIES_CONFIG = {
  chart: {
    type: 'pie',
    height: 530,
    backgroundColor: '#EBF1F4',
    style: {
      fontFamily: 'Oswald', //'Open Sans'
    },
  },
  title: {
    text: '',
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
      // enableMouseTracking: false,
      startAngle: 315,
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
  tooltip: {

  },
  credits: {
    enabled: false,
  },
  series: []
}

export const BUBBLES_CHART_CONFIG = {
  chart: {
    type: 'bubble',
    plotBorderWidth: 1,
    zoomType: 'xy',
    height: 500,
    backgroundColor: null,
    style: {
      fontFamily: 'Oswald', //'Open Sans'
    },
  },
  legend: {
    enabled: false,
  },
  title: {
    text: '',
    align: 'left',
    // style: { 'font-weigth': 'bold', 'color': '#FFF' },
  },
  xAxis: {
    gridLineColor: '#C4C4C4',
    gridLineWidth: 1,
    title: {
      text: 'Сумма договоров',
      style: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '16px',
        lineHeight: '120.69%',
        textAlign: 'right',
        color: '#C4C4C4',
      },
    },
    labels: {
      formatter: function () {
        return numeral(this.value).format('0 a')
      },
      style: {
        color: '#C4C4C4',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '16px',
      },
    },
  },
  tooltip: {

  },
  yAxis: {
    gridLineColor: '#C4C4C4',
    gridLineWidth: 1,
    title: {
      text: <FormattedMessage id={'page.common.text.18'} />,
      style: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '16px',
        lineHeight: '120.69%',
        textAlign: 'right',
        color: '#C4C4C4',
      },
    },
    labels: {
      formatter: function () {
        return numeral(this.value).format('0 a')
      },
      style: {
        color: '#C4C4C4',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '16px',
      },
    },
    startOnTick: false,
    endOnTick: false,
  },
  series: [],
  credits: {
    enabled: false,
  },
}

export const TOP_FIVE_ITEMS_OF_PURCHASE_CONFIG = {
  chart: {
    type: 'bar',
    backgroundColor: null,
    height: 300,
    style: {
      fontFamily: 'Oswald', //'Open Sans'
    },
  },
  title: {
    text: 'Рейтинг ТОП-5 предметов закупок',
    style: { 'font-weigth': 'bold', 'color': '#FFF' },
  },
  yAxis: {
    min: 0,
    title: '',
    labels: {
      format: '{value:,.f}',
    },
  },
  xAxis: {
    tickInterval: 1,
    categories: [],

  },
  series: [
    {},
  ],
  legend: {
    enabled: false,
  },
  plotOptions: {
    column: {
      // stacking: 'normal',
      dataLabels: {
        enabled: false,
        color: 'grey',
      },
    },
  },
  credits: {
    enabled: false,
  },
}

export const POLYGON_CHART_CONFIG = {
  chart: {
    backgroundColor: null,
    style: {
      fontFamily: 'Oswald', //'Open Sans'
    },
    height: 500,
  },
  series: [{
    type: 'treemap',
    layoutAlgorithm: 'stripes',
    alternateStartingDirection: true,
    levels: [{
      level: 1,
      layoutAlgorithm: 'sliceAndDice',
      dataLabels: {
        enabled: true,
        align: 'left',
        verticalAlign: 'top',
        style: {
          fontSize: '15px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        },
      },
    }],
    data: [],
  }],
  credits: {
    enabled: false,
  },
  plotOptions: {
    treemap: {
      dataLabels: {
        enabled: true,
        y: 10,
        x: 15,
        style: {
          textOutline: false,
        },
      },
    },
  },
  title: {
    // text: 'Распределение ТОП-5 предметов закупок',
    text: '',
  },
}

export const BAR_CHART_CONFIG = {
  chart: {
    height: 600,
    type: 'column',
    backgroundColor: null,
    style: {
      fontFamily: 'Oswald', //'Open Sans'
    },
  },
  title: {
    text: 'Распределение ТОП-10 предметов закупок',
    style: { 'font-weigth': 'bold', 'color': '#FFF' },
  },
  yAxis: {
    min: 0,
    title: '',
    labels: {
      formatter: function () {
        return numeral(this.value).format('0 a')
      },
      style: { 'color': '#FFFFFF' },
    },
  },
  tooltip: {
    useHTML: true,
    formatter: function () {
      return '<span>' + this.series.name +
        ': <b>' + numeral(this.point.y).format('0 a') + ' сом. (KGS)</b>'
        + '</span>'
    },
  },
  xAxis: {
    tickInterval: 1,
    categories: [],
    labels: {
      style: { 'color': '#FFFFFF', 'width': '120px' },
    },
  },
  series: [
    {},
  ],
  legend: {
    enabled: false,
  },
  plotOptions: {
    series: {
      stacking: 'normal',
    },
    // column: {
    //   dataLabels: {
    //     enabled: false,
    //     color: 'grey',
    //   },
    // },
  },
  credits: {
    enabled: false,
  },
}
