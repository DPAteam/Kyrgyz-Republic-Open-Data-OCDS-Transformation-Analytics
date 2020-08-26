import React from 'react'
import { toNumberFormat, toCurrencyWithPostfix, toPercentFormat } from '../../utils/NumberUtils'
import { ReactComponent as magnifyingGlassIcon } from '../../common/img/magnifying-glass.svg'
import { ReactComponent as cautionSignIcon } from '../../common/img/caution-sign.svg'
import { ReactComponent as pieChartIcon } from '../../common/img/pie-chart.svg'
import { ReactComponent as maleAvatarIcon } from '../../common/img/male-avatar.svg'
import { ReactComponent as shoppingCartIcon } from '../../common/img/shopping-cart.svg'

export const BASE_CARDS_OPTIONS = [
  {
    titleKey: 'dashboard_buyer_info_tenders_title',
    cardData: [
      {
        translateKey: 'dashboard_buyer_info_tenders_count',
        valueKey: 'tendersCount',
        numberFormat: 'number',
        valueGridStyle: {
          width: '60%',
          textAlign: 'right',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
        textGridStyle: {
          width: '40%',
          textAlign: 'left',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
      },
      {
        translateKey: 'dashboard_buyer_info_tenders_amount',
        valueKey: 'tendersAmount',
        numberFormat: 'currency_with_postfix',
        valueGridStyle: {
          width: '60%',
          textAlign: 'right',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
        textGridStyle: {
          width: '40%',
          textAlign: 'left',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
      },
    ],
  },
  {
    titleKey: 'dashboard_buyer_info_risk_tenders_title',
    cardData: [
      {
        translateKey: 'dashboard_buyer_info_risk_tenders_count',
        valueKey: 'riskTendersCount',
        numberFormat: 'number',
        valueGridStyle: {
          width: '60%',
          textAlign: 'right',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
        textGridStyle: {
          width: '40%',
          textAlign: 'left',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
      },
      {
        translateKey: 'dashboard_buyer_info_risk_tenders_amount',
        valueKey: 'riskTendersAmount',
        numberFormat: 'currency_with_postfix',
        valueGridStyle: {
          width: '60%',
          textAlign: 'right',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
        textGridStyle: {
          width: '40%',
          textAlign: 'left',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
      },
    ],
  },
  {
    titleKey: 'dashboard_buyer_info_risk_tenders_percent_title',
    cardData: [
      {
        translateKey: 'dashboard_buyer_info_risk_tenders_percent',
        valueKey: 'riskTendersPercent',
        numberFormat: 'percent',
        valueGridStyle: {
          width: '30%',
          textAlign: 'right',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
        textGridStyle: {
          width: '70%',
          textAlign: 'left',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
      },
      {
        translateKey: 'dashboard_buyer_info_risk_tenders_amount_percent',
        valueKey: 'riskTendersAmountPercent',
        numberFormat: 'percent',
        valueGridStyle: {
          width: '34%',
          textAlign: 'right',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
        textGridStyle: {
          width: '66%',
          textAlign: 'left',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
      },
    ],
  },
  {
    titleKey: 'dashboard_buyer_info_risk_buyers_title',
    cardData: [
      {
        translateKey: 'dashboard_buyer_info_risk_buyers_count',
        valueKey: 'riskBuyersCount',
        numberFormat: 'number',
        valueGridStyle: {
          width: '34%',
          textAlign: 'right',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
        textGridStyle: {
          width: '66%',
          textAlign: 'left',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
      },
      {
        translateKey: 'dashboard_buyer_info_risk_buyers_percent',
        valueKey: 'riskBuyersPercent',
        numberFormat: 'percent',
        valueGridStyle: {
          width: '34%',
          textAlign: 'right',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
        textGridStyle: {
          width: '66%',
          textAlign: 'left',
          boxShadow: 'unset',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 15,
          paddingTop: 15,
        },
      },
    ],
  },
]

export const DASHBOARD_REGION_INDICATOR_COUNT_COLUMNS = {
  mainColumn: {
    title: '',
    dataIndex: 'name',
    translateKey: 'indicator_region_name',
    align: 'left',
    width: 350,
    fixed: 'left',
    sorter: false,
    render: data => {
      let splitedData = data.split('%separator%')
      return (
        <>
        <b>{splitedData[0]}</b>
        <span> - </span>
        <span>{splitedData[1]}</span>
        </>
      )
    },
  },
  childColumn: {
    title: '',
    dataIndex: '',
    align: 'center',
    // width: '25%',
    sorter: null,
    render: (value) => (
      (value === -1) ? '0' : toNumberFormat(value)
    ),
  },
}

export const DASHBOARD_REGION_INDICATOR_AMOUNT_COLUMNS = {
  mainColumn: {
    title: '',
    dataIndex: 'name',
    translateKey: 'indicator_region_name',
    align: 'left',
    width: 350,
    fixed: 'left',
    sorter: false,
    render: data => {
      let splitedData = data.split('%separator%')
      return (
        <>
        <b>{splitedData[0]}</b>
        <span> - </span>
        <span>{splitedData[1]}</span>
        </>
      )
    },
  },
  childColumn: {
    title: '',
    dataIndex: '',
    align: 'center',
    // width: '25%',
    sorter: null,
    render: (value) => (
      (value === -1) ? '0' : toCurrencyWithPostfix(value)
    ),
  },
}

export const DASHBOARD_REGION_INDICATOR_COUNT_PERCENT_COLUMNS = {
  mainColumn: {
    title: '',
    dataIndex: 'name',
    translateKey: 'indicator_region_name',
    align: 'left',
    width: 350,
    fixed: 'left',
    sorter: false,
    render: data => {
      let splitedData = data.split('%separator%')
      return (
        <>
        <b>{splitedData[0]}</b>
        <span> - </span>
        <span>{splitedData[1]}</span>
        </>
      )
    },
  },
  childColumn: {
    title: '',
    dataIndex: '',
    align: 'center',
    // width: '25%',
    sorter: null,
    render: (value) => (
      (value === -1) ? '0%' : toPercentFormat(value, '00')
    ),
  },
}

export const DASHBOARD_REGION_INDICATOR_AMOUNT_PERCENT_COLUMNS = {
  mainColumn: {
    title: '',
    dataIndex: 'name',
    translateKey: 'indicator_region_name',
    align: 'left',
    width: 350,
    fixed: 'left',
    sorter: false,
    render: data => {
      let splitedData = data.split('%separator%')
      return (
        <>
        <b>{splitedData[0]}</b>
        <span> - </span>
        <span>{splitedData[1]}</span>
        </>
      )
    },
  },
  childColumn: {
    title: '',
    dataIndex: '',
    align: 'center',
    // width: '25%',
    sorter: null,
    render: (value) => (
      (value === -1) ? '0%' : toPercentFormat(value, '00')
    ),
  },
}

export const TOP_INFO_CONFIG = [
  {
    title: '',
    translateKey: 'chart_status_card_procuring_entity_with_the_highest_level_of_risk',
    hasMappingSource: false,
    key: 'buyer',
    iconType: 'info-circle',
    iconTypeComponent: maleAvatarIcon,
  },
  {
    title: '',
    translateKey: 'chart_status_card_the_most_risky_procedure_for_the_number',
    hasMappingSource: false,
    key: 'tender',
    iconType: 'info-circle',
    iconTypeComponent: shoppingCartIcon,
  },
  {
    title: '',
    translateKey: 'chart_status_card_the_most_triggered_indicator_by_procedures_amount',
    hasMappingSource: true,
    mappingKey: 'indicators',
    mappingSearchKey: 'id',
    mappingValueKey: 'name',
    key: 'indicator',
    iconType: 'info-circle',
    iconTypeComponent: cautionSignIcon,
  },
]

export const HOME_STATUS_CARD_OPTIONS = [
  {
    titleKey: 'dashboard_buyer_info_tenders_title',
    valueCountKey: 'tendersCount',
    valueCountTranslateKey: 'dashboard_buyer_info_tenders_count',
    valueCountFormatFunction: 'toNumberFormat',
    valueAmountKey: 'tendersAmount',
    valueAmountTranslateKey: 'dashboard_buyer_info_tenders_amount',
    valueAmountFormatFunction: 'toCurrencyWithPostfix',
    iconType: 'info-circle',
    iconTypeComponent: magnifyingGlassIcon,
    colorStyle: 'tile-white',
    // pClass: (window.innerWidth <= 1440) ? '' : 'margin-top-first-block',
    pClass: 'margin-top-first-block',
  },
  {
    titleKey: 'dashboard_buyer_info_risk_tenders_title',
    valueCountKey: 'riskTendersCount',
    valueCountTranslateKey: 'dashboard_buyer_info_risk_tenders_count',
    valueCountFormatFunction: 'toNumberFormat',
    valueAmountKey: 'riskTendersAmount',
    valueAmountTranslateKey: 'dashboard_buyer_info_risk_tenders_amount',
    valueAmountFormatFunction: 'toCurrencyWithPostfix',
    iconType: 'info-circle',
    iconTypeComponent: cautionSignIcon,
    colorStyle: 'tile-white',
    pClass: 'margin-top-second-block',
  },
  {
    titleKey: 'dashboard_buyer_info_risk_tenders_percent_title',
    valueCountKey: 'riskTendersPercent',
    valueCountTranslateKey: 'dashboard_buyer_info_risk_tenders_percent',
    valueCountFormatFunction: 'toPercentFormat',
    valueAmountKey: 'riskTendersAmountPercent',
    valueAmountTranslateKey: 'dashboard_buyer_info_risk_tenders_amount_percent',
    valueAmountFormatFunction: 'toPercentFormat',
    iconType: 'info-circle',
    iconTypeComponent: pieChartIcon,
    colorStyle: 'tile-white',
    // pClass: (window.innerWidth <= 1440) ? '' : 'margin-top-third-block',
    pClass: 'margin-top-third-block',
  },
  {
    titleKey: 'dashboard_buyer_info_risk_buyers_title',
    valueCountKey: 'buyersCount',
    valueCountTranslateKey: 'dashboard_buyer_info_risk_buyers_count',
    valueCountFormatFunction: 'toNumberFormat',
    valueAmountKey: 'riskBuyersCount',
    valueAmountTranslateKey: 'dashboard_buyer_info_risk_buyers_percent',
    valueAmountFormatFunction: 'toNumberFormat',
    iconType: 'info-circle',
    iconTypeComponent: maleAvatarIcon,
    colorStyle: 'tile-white',
    pClass: 'margin-top-fourth-block',
  },
]
