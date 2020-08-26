export const KPI_CHART_CONFIG = {
  config: {
    chart: {
      animation: {
        duration: 1000
      },
      height: 120,
      type: 'areaspline',
      spacing: [ 0, 0, 0, 0 ],
      margin: [ 0, 0, 0, 0 ],
      style: {
        fontFamily: 'Oswald' //'Open Sans'
      }
    },
    title: {
      text: '',
    },
    xAxis: {
      minPadding: 0,
      maxPadding: 0,
      visible: false,
    },
    yAxis: {
      title: {
        text: '',
      },
      visible: false,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
    },
    lang: {
      noData: "page.common.text.61"
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    },
    series: [ {
      tooltip: {
        headerFormat: '<span><b>{point.x}</b></span><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> <b>{point.y:,.2f}</b><br/>',
      },
      name: '',
      lineWidth: 3,
      color: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [ 0, '#2a577f' ],
          [ 1, '#2a577f' ],
        ],
      },
    } ],
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
        groupPadding: 0,
        shadow: false,
        stacking: 'percent',
      },
      series: {
        pointPlacement: 'on',
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
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [ 0, '#72bbdb' ],
            [ 1, '#ccede6' ],
          ],
        },
      },
    },
  },
}
