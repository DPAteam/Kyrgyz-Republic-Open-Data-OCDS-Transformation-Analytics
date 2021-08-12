export const HIGHCHART_LOCALE = {
  'ru': {
    symbols: [' тыс.', ' млн.', ' млрд.', ' трлн.'],
    currencyType: ' сом.',
    piecesTitle: ' шт.',
  },
  'en': {
    symbols: ['k', 'M', 'G', 'T', 'P', 'E'],
    currencyType: ' KGS',
    piecesTitle: '',
  },
  'ky': {
    symbols: [' тыс.', ' млн.', ' млрд.', ' трлн.'],
    currencyType: ' сом.',
    piecesTitle: ' шт.',
  },
}

export const QANTITY_COST_OPTIONS = [
  { key: 'count' },
  { key: 'amount' },
]

export const SELECT_TYPES = {
  search: 'search',
  select: 'select',
  multiSelect: 'multiSelect',
}

export const CHART_COLORS_A = [
  '#A8E2D1',
  '#63D4B1',
]

export const CHART_COLORS_B = [
  '#489EAE',
  '#ADD3D6',
]

export const CHART_COLORS_C = [
  '#489EAE',
  '#ADD3D6',
]

export const CHART_COLORS_D = [
  '#72BBDB',
  '#489EAE',
  '#5FBBC2',
  '#63D4B1',
  '#A8E2D1',
  '#f5b041',
  '#3398da',
  '#1abc9b',
  '#f39c13',
  '#2f86c1',
  '#19a589',
  '#ca6f1d',
]

export const CHART_COLORS = [
  '#85c1e9',
  '#76d7c3',
  '#f8c370',
  '#5cade2',
  '#48c9b0',
  '#f5b041',
  '#3398da',
  '#1abc9b',
  '#f39c13',
  '#2f86c1',
  '#19a589',
  '#ca6f1d',
]

export const OKGZ_FIELD_BY_LANGUAGE = {
  ru: 'name',
  en: 'nameEn',
  ky: 'nameKg',
}

export const INDICATOR_FIELD_BY_LANGUAGE = {
  ru: 'description',
  en: 'descriptionEn',
  ky: 'descriptionKg',
}

export const TRANSLATED_FIELD_BY_LANGUAGE = {
  ru: 'valueRu',
  en: 'valueEn',
  ky: 'valueKy',
}

export const FILTER_ITEM_TRANSLATION_OPTIONS = {
  'buyers': {
    mappingKey: null,
  },
  'hasComplaints': {
    mappingKey: 'translatedValues',
    prefixName: 'complaint.',
    searchKey: 'value',
    searchValueKey: 'key',
    doubleNameKey: null,
    needMD5Hash: false,
    ru: 'valueRu',
    en: 'valueEn',
    ky: 'valueKy',
  },
  'withRisk': {
    mappingKey: 'translatedValues',
    prefixName: 'risk-type.',
    searchKey: 'value',
    searchValueKey: 'key',
    doubleNameKey: null,
    needMD5Hash: false,
    ru: 'valueRu',
    en: 'valueEn',
    ky: 'valueKy',
  },
  'procurementMethodDetails': {
    mappingKey: 'translatedValues',
    prefixName: 'procurement-method-details.',
    searchKey: 'value',
    searchValueKey: 'value',
    doubleNameKey: null,
    needMD5Hash: false,
    ru: 'valueRu',
    en: 'valueEn',
    ky: 'valueKy',
  },
  'statusDetails': {
    mappingKey: 'translatedValues',
    prefixName: 'status-detail.',
    searchKey: 'value',
    searchValueKey: 'value',
    doubleNameKey: null,
    needMD5Hash: false,
    ru: 'valueRu',
    en: 'valueEn',
    ky: 'valueKy',
  },
  'buyerRegions': {
    mappingKey: 'translatedValues',
    prefixName: 'region.',
    searchKey: 'value',
    searchValueKey: 'value',
    doubleNameKey: null,
    needMD5Hash: true,
    ru: 'valueRu',
    en: 'valueEn',
    ky: 'valueKy',
  },
  'riskLevels': {
    mappingKey: 'translatedValues',
    prefixName: 'risk-level.',
    searchKey: 'value',
    searchValueKey: 'key',
    doubleNameKey: null,
    needMD5Hash: false,
    ru: 'valueRu',
    en: 'valueEn',
    ky: 'valueKy',
  },
  'itemCpv': {
    mappingKey: 'cpvList',
    prefixName: '',
    searchKey: 'code',
    searchValueKey: 'key',
    doubleNameKey: null,
    needMD5Hash: false,
    ru: 'name',
    en: 'nameEn',
    ky: 'name',
  },
  'itemCpv2': {
    mappingKey: 'okgzList',
    prefixName: '',
    searchKey: 'code',
    searchValueKey: 'key',
    doubleNameKey: null,
    needMD5Hash: false,
    ru: 'name',
    en: 'nameEn',
    ky: 'nameKg',
  },
  'riskedIndicators': {
    mappingKey: 'indicators',
    prefixName: '',
    searchKey: 'id',
    searchValueKey: 'key',
    doubleNameKey: 'name',
    needMD5Hash: false,
    ru: 'description',
    en: 'descriptionEn',
    ky: 'descriptionKg',
  },
}
