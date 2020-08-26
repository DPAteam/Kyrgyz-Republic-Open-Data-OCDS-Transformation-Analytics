// export const getChartConfig = () => {
//   // let data = this.getContractsCommonInfoQ()
//   return {
//     chart: {
//       type: 'spline',
//       parallelCoordinates: true,
//       parallelAxes: {
//         lineWidth: 2,
//       },
//       backgroundColor: null,
// style: {
//   fontFamily: 'Oswald' //'Open Sans'
// }
//     },
//     legend: {
//       enabled: false,
//     },
//     boost: {
//       seriesThreshold: 1000,
//       useGPUTranslations: true,
//       usePreAllocated: true,
//     },
//     title: {
//       text: '',
//     },
//     plotOptions: {
//       series: {
//         boostThreshold: 1,
//         animation: false,
//         marker: {
//           enabled: false,
//           states: {
//             hover: {
//               enabled: false,
//             },
//           },
//         },
//         states: {
//           hover: {
//             halo: {
//               size: 0,
//             },
//           },
//         },
//         events: {
//           mouseOver: function () {
//             this.group.toFront()
//           },
//         },
//       },
//     },
//     tooltip: {
//       pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
//         '{series.name}: <b>{point.formattedValue}</b><br/>',
//     },
//     xAxis: {
//       categories: [
//         'Дни недели',
//         'Количество позиций договора',
//         'Конкурентность',
//         'Методы закупок',
//         'Тип средств закупки',
//         'Сумма договоров',
//       ],
//       offset: 10,
//     },
//     yAxis: [
//       {
//         type: 'datetime',
//         tooltipValueFormat: '{value:%Y-%m-%d}', // Дни недели
//       },
//       {
//         min: 0,
//         tooltipValueFormat: '{value}', // Количество позиций договора
//       },
//       {
//         categories: data.competitivities, // Конкурентность
//       },
//       {
//         categories: data.procedureTypes, // Методы закупок
//       },
//       {
//         categories: data.funds, // Тип средств закупки
//       },
//       {
//         min: 0, // Сумма договоров
//       },
//     ],
//     colors: ['rgba(11, 200, 200, 0.1)'],
//     series: data.contractsData,
//   }
// }

export const HORIZONTAL_BAR_CHART_COLORS = [
  '#ADD3D6',
  '#8ECACE',
  '#5FBBC2',
  '#489EAE',
  '#72BBDB',
  '#599EC0',
  '#3672A1',
  '#2A577F',
  '#335571',
  '#284357',
]

export const VERTICAL_BAR_CHART_COLORS = [
  '#ADD3D6',
  '#8ECACE',
  '#5FBBC2',
  '#489EAE',
  '#72BBDB',
  '#599EC0',
  '#3672A1',
  '#537798',
  '#5B778D',
  '#42617B',
  '#345A77',
  '#224B6B',
  '#284357',
]

export const HORIZONTAL_BAR_CHART_SECONDARY_COLORS = [
  '#A8E2D1',
  '#63D4B1',
  '#5FBBC2',
  '#72BBDB',
  '#599EC0',
]

export const HORIZONTAL_CHART_DATA = [
  {
    name: 'ТОВ "A"',
    value: 100,
  },
  {
    name: 'ТОВ "B"',
    value: 90,
  },
  {
    name: 'ТОВ "C"',
    value: 80,
  },
  {
    name: 'ТОВ "D"',
    value: 70,
  },
  {
    name: 'ТОВ "E"',
    value: 60,
  },
  {
    name: 'ТОВ "F"',
    value: 50,
  },
  {
    name: 'ТОВ "G"',
    value: 40,
  },
  {
    name: 'ТОВ "H"',
    value: 30,
  },
  {
    name: 'ТОВ "I"',
    value: 20,
  },
  {
    name: 'ТОВ "K"',
    value: 10,
  },
]

export const HORIZONTAL_CHART_CONFIG = {
  chart: {
    type: 'bar',
    style: {
      fontFamily: 'Oswald' //'Open Sans'
    }
  },
  title: {
    text: 'Historic World Population by Region',
  },
  xAxis: {
    categories: [],
    title: {
      text: null,
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: 'TOP-10 A',
      align: 'high',
    },
    labels: {
      overflow: 'justify',
    },
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true,
      },
    },
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'top',
    x: -40,
    y: 80,
    floating: true,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    shadow: true,
  },
  credits: {
    enabled: false,
  },
  series: [],
}

export const MOK_DATA_BAR_CHART = [
  {
    date : '2019-10-28',
    data: [
      {
        companyName: 'ТОВ А',
        value: 100
      },
      {
        companyName: 'ТОВ Б',
        value: 90
      },
      {
        companyName: 'ТОВ В',
        value: 80
      },
      {
        companyName: 'ТОВ Г',
        value: 70
      },
      {
        companyName: 'ТОВ Д',
        value: 60
      },
      {
        companyName: 'ТОВ К',
        value: 50
      },
      {
        companyName: 'ТОВ Л',
        value: 40
      },
      {
        companyName: 'ТОВ М',
        value: 30
      },
      {
        companyName: 'ТОВ Н',
        value: 20
      },
      {
        companyName: 'ТОВ О',
        value: 10
      },
    ]
  },
  {
    date : '2019-10-29',
    data: [
      {
        companyName: 'ТОВ А',
        value: 99
      },
      {
        companyName: 'ТОВ Б',
        value: 89
      },
      {
        companyName: 'ТОВ В',
        value: 79
      },
      {
        companyName: 'ТОВ Г',
        value: 69
      },
      {
        companyName: 'ТОВ Д',
        value: 59
      },
      {
        companyName: 'ТОВ К',
        value: 49
      },
      {
        companyName: 'ТОВ Л',
        value: 39
      },
      {
        companyName: 'ТОВ М',
        value: 29
      },
      {
        companyName: 'ТОВ Н',
        value: 19
      },
      {
        companyName: 'ТОВ О',
        value: 9
      },
    ]
  },
  {
    date : '2019-10-30',
    data: [
      {
        companyName: 'ТОВ А',
        value: 98
      },
      {
        companyName: 'ТОВ Б',
        value: 88
      },
      {
        companyName: 'ТОВ В',
        value: 78
      },
      {
        companyName: 'ТОВ Г',
        value: 68
      },
      {
        companyName: 'ТОВ Д',
        value: 58
      },
      {
        companyName: 'ТОВ К',
        value: 48
      },
      {
        companyName: 'ТОВ Л',
        value: 38
      },
      {
        companyName: 'ТОВ М',
        value: 28
      },
      {
        companyName: 'ТОВ Н',
        value: 18
      },
      {
        companyName: 'ТОВ О',
        value: 8
      },
    ]
  },
  {
    date : '2019-11-01',
    data: [
      {
        companyName: 'ТОВ А',
        value: 97
      },
      {
        companyName: 'ТОВ Б',
        value: 87
      },
      {
        companyName: 'ТОВ В',
        value: 77
      },
      {
        companyName: 'ТОВ Г',
        value: 67
      },
      {
        companyName: 'ТОВ Д',
        value: 57
      },
      {
        companyName: 'ТОВ К',
        value: 47
      },
      {
        companyName: 'ТОВ Л',
        value: 37
      },
      {
        companyName: 'ТОВ М',
        value: 27
      },
      {
        companyName: 'ТОВ Н',
        value: 17
      },
      {
        companyName: 'ТОВ О',
        value: 7
      },
    ]
  },
  {
    date : '2019-11-02',
    data: [
      {
        companyName: 'ТОВ А',
        value: 96
      },
      {
        companyName: 'ТОВ Б',
        value: 86
      },
      {
        companyName: 'ТОВ В',
        value: 76
      },
      {
        companyName: 'ТОВ Г',
        value: 66
      },
      {
        companyName: 'ТОВ Д',
        value: 56
      },
      {
        companyName: 'ТОВ К',
        value: 46
      },
      {
        companyName: 'ТОВ Л',
        value: 36
      },
      {
        companyName: 'ТОВ М',
        value: 26
      },
      {
        companyName: 'ТОВ Н',
        value: 16
      },
      {
        companyName: 'ТОВ О',
        value: 6
      },
    ]
  },
  {
    date : '2019-11-03',
    data: [
      {
        companyName: 'ТОВ А',
        value: 95
      },
      {
        companyName: 'ТОВ Б',
        value: 85
      },
      {
        companyName: 'ТОВ В',
        value: 75
      },
      {
        companyName: 'ТОВ Г',
        value: 65
      },
      {
        companyName: 'ТОВ Д',
        value: 55
      },
      {
        companyName: 'ТОВ К',
        value: 45
      },
      {
        companyName: 'ТОВ Л',
        value: 35
      },
      {
        companyName: 'ТОВ М',
        value: 25
      },
      {
        companyName: 'ТОВ Н',
        value: 15
      },
      {
        companyName: 'ТОВ О',
        value: 5
      },
    ]
  },
  {
    date : '2019-11-04',
    data: [
      {
        companyName: 'ТОВ А',
        value: 94
      },
      {
        companyName: 'ТОВ Б',
        value: 84
      },
      {
        companyName: 'ТОВ В',
        value: 74
      },
      {
        companyName: 'ТОВ Г',
        value: 64
      },
      {
        companyName: 'ТОВ Д',
        value: 54
      },
      {
        companyName: 'ТОВ К',
        value: 44
      },
      {
        companyName: 'ТОВ Л',
        value: 34
      },
      {
        companyName: 'ТОВ М',
        value: 24
      },
      {
        companyName: 'ТОВ Н',
        value: 14
      },
      {
        companyName: 'ТОВ О',
        value: 4
      },
    ]
  }
]


export const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']