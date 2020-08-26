import React from 'react'

// import IMG1 from '../../article/imgsMock/shutterstock_1236487849.png'
import IMG1 from '../../article/imgsMock/card_1_image.png'
// import IMG2 from '../../article/imgsMock/shutterstock_1130674394.png'
import IMG2 from '../../article/imgsMock/card_2_image.png'
// import IMG3 from '../../article/imgsMock/9e18bebc-4285-475d-8916-505c7bb3aa2e.jpg'
import IMG3 from '../../article/imgsMock/card_3_image.png'


export const ARTICLES = [
  {
    title: 'story.whatToBuy.text.title',
    shortText: 'story.whatToBuy.text.2.1',
    img: IMG1,
    link: '/dashboard/what-to-buy-in-your-region',
  },
  {
    title: 'common.story.title.label.1',
    shortText: 'common.story.text.1.1.1',
    img: IMG2,
    link: '/dashboard/why-government-procurement-is-important-to-the-country',
  },
  {
    title: 'story.buyBelarusian.text.title',
    shortText: 'story.buyBelarusian.text.content',
    img: IMG3,
    link: '/dashboard/buy-kyrgyzstan',
  },
]

export const PROCUREMENT_TOP_COLUMNS = [
  {
    Header: '',
    accessor: 'info',
    maxWidth: 100,
  },
  {
    Header: '',
    accessor: 'value',
  },
]

export const CARDS_DESCRIPTIONS = {
  topOKRB: {
    description: 'page.description.text.1.2',
    time: 'page.description.text.1.4',
    source: <a href="http://zakupki.gov.kg/popp/home.xhtml">zakupki.gov.kg/popp/home.xhtml</a>,
    infoData: {
      'description': 'page.common.text.39.10',
      'period': 'page.common.text.39.5',
      'source': 'page.common.text.39.8',
    }
  },
  topProcurement: {
    description: 'page.description.text.2.2',
    time: 'page.description.text.1.4',
    source: <a href="http://zakupki.gov.kg/popp/home.xhtml">zakupki.gov.kg/popp/home.xhtml</a>,
    infoData: {
      'description': 'page.common.text.39.0',
      'period': 'page.common.text.39.5',
      'source': 'page.common.text.39.8',
    }
  },
  enquiryNumber: {
    description: 'page.description.text.3.2',
    time: 'page.description.text.1.4',
    source: <a href="http://zakupki.gov.kg/popp/home.xhtml">zakupki.gov.kg/popp/home.xhtml</a>,
    infoData: {
      'description': 'page.common.text.39.9',
      'period': 'page.common.text.39.5',
      'source': 'page.common.text.39.8',
    }
  },
  gswDistribution: {
    description: 'page.description.text.4.2',
    time: 'page.description.text.4.4',
    source: <a href="http://zakupki.gov.kg/popp/home.xhtml">zakupki.gov.kg/popp/home.xhtml</a>,
    infoData: {
      'description': 'page.common.text.39.11',
      'period': 'page.common.text.39.6',
      'source': 'page.common.text.39.8',
    }
  },
  mmBusinessLots: {
    description: 'page.description.text.5.2',
    time: 'page.description.text.4.4',
    source: <a href="http://zakupki.gov.kg/popp/home.xhtml">zakupki.gov.kg/popp/home.xhtml</a>,
    infoData: {
      'description': 'page.common.text.39.12',
      'period': 'page.common.text.39.6',
      'source': 'page.common.text.39.8',
    }
  },
  mmBusinessContractsAmount: {
    description: 'page.description.text.6.2',
    time: 'page.description.text.4.4',
    source: <a href="http://zakupki.gov.kg/popp/home.xhtml">zakupki.gov.kg/popp/home.xhtml</a>,
    infoData: {
      'description': 'page.common.text.39.13',
      'period': 'page.common.text.39.6',
      'source': 'page.common.text.39.8',
    }
  },
}


export const ChartConfig = {
  config: {
    chart: {
      backgroundColor: null,
      borderWidth: 0,
      height: 330,
      style: {
        fontFamily: 'Oswald' //'Open Sans'
      }
    },
    title: {
      text: '',
    },
    xAxis: {
      lineColor: '#74B9DC',
      tickColor: '#74B9DC',
      labels: {
        rotation: -45,
        step: 1,
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
      gridLineColor: '#74B9DC',
      gridLineWidth: 1,
      title: {
        text: null,
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
    legend: {
      enabled: false,
    },
    tooltip: {},
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
    series: [ {
      name: '',
      data: [],
    } ],
    credits: {
      enabled: false,
    },
  },
}
