import _ from 'lodash'
import {
  GET_DATA,
  UPDATE_DATA,
  TYPE_OF_VALUES,
  SELECT_OPTION,
  CLEAR_OPTIONS,
  DESELECT_OPTION,
  GET_BUCKET_DATA,
  SET_BUCKET_DATA,
  DELETE_BUCKET_DATA,
  SET_REGIONS,
  PROC_EXPORT,
  UPDATE_FILTER_OPTIONS,
  GET_RISKS,
  GET_ALL_PROCEDURES_IDS,
  GET_PARAMETERS,
  POST_PARAMETERS,
  GET_CHECKLIST,
  POST_CHECKLIST,
  GET_CHECKLIST_CREATE,
  GET_MAPPINGS,
  DROP_OPTION,
  CLEAR_CHECKLIST,
} from './constants'

import * as MonitoringConstants from './constants'

import { FILTER_ITEM_TRANSLATION_OPTIONS } from '../../containers/private/constants'
import { STATUSES } from '../constants'
import { message } from 'antd'
import * as intl from 'react-intl'

const FILTER_GROUPS = {
  contractingAuthorityTab: ['buyers', 'buyerRegions'],
  proceduresWithRiskTab: ['statusDetails', 'procurementMethodDetails'],
  procurementSubjectTab: ['itemCpv', 'itemCpv2'],
  riskTab: ['withRisk', 'riskedIndicators', 'hasComplaints', 'riskLevels'],
}


const getFilterType = (length, key) => {
  const MULTI = [
    // 'riskedIndicators',
    // 'regions',
    // 'cpv2Names',
    // 'procedureTypes',
    // 'tenderStatuses',
    // 'tenderScores',
    // 'cpvNames',
    // 'monitoringCause',
    // 'procuringEntities',
    // 'currency',
    // 'tenderRank',
    // 'monitoringOffices',
    // 'monitoringStatus',
    'procurementMethodDetails',
    'statusDetails',
    'itemCpv2',
    'itemCpv',
    'buyers',
    'buyerRegions',
    'riskLevels',
    // 'hasComplaints',
    // 'withRisk',
    'riskedIndicators',
  ]
  // const SEARCH = ['cpv2Names', 'cpvNames', 'procuringEntities']
  const SEARCH = ['itemCpv', 'itemCpv2', 'buyers']
  const TYPES = {
    search: 'search',
    select: 'select',
    multiSelect: 'multiSelect',
  }
  if (
    !_.isEmpty(
      _.find(SEARCH, el => {
        return el === key
      }),
    )
  )
    return TYPES.search

  if (
    !_.isEmpty(
      _.find(MULTI, el => {
        return el === key
      }),
    )
  )
    return TYPES.multiSelect
  return TYPES.select
}

const getFilterOptions = (arr, key) => {
  // if (
  //   key === 'procuringEntities' ||
  //   key === 'cpvNames' ||
  //   key === 'cpv2Names' ||
  //   key === 'riskedIndicators' ||
  //   key === 'queuePriority'
  // )
  if (
    key === 'buyers' ||
    key === 'itemCpv' ||
    key === 'cpv2Names' ||
    key === 'itemCpv2' ||
    key === 'withRisk' ||
    key === 'riskedIndicators'
  )
    return _.map(arr, el => {
      return {
        key: el.key,
        value: el.value,
        // keyId: el.value,
      }
    })

  let newFilterOptions = []

  _.forEach(arr, el => {
    if (!_.isEmpty(el.key)) {
      newFilterOptions.push({
        key: typeof el.key === 'object' ? el.key.key : el.key,
        value: typeof el.key === 'object' ? el.key.value : el.key,
      })
    } else {
      // console.log(`${key} => "key = null"`)
    }
  })

  return newFilterOptions
}

const getFilterPosition = elem => {
  // const FILTERS_POS = {
  //   full: [
  //     'regions',
  //     'procuringEntities',
  //     'procuringEntityKind',
  //     'gsw',
  //     'cpvNames',
  //     'cpv2Names',
  //     'riskedIndicators',
  //     'queuePriority',
  //   ],
  //   half: [
  //     'procedureTypes',
  //     'tenderStatuses',
  //     'currency',
  //     'complaints',
  //     'riskedProcedures',
  //     'tenderRank',
  //     'monitoringStatus',
  //     'monitoringCause',
  //     'monitoringAppeal',
  //     'monitoringOffices',
  //   ],
  // }
  const FILTERS_POS = {
    full: [
      'buyers',
      'itemCpv',
      'itemCpv2',
      'buyerRegions',
      'riskedIndicators',
    ],
    half: [
      'procurementMethodDetails',
      'statusDetails',
      // 'riskLevels',
      // 'hasComplaints',
      // 'withRisk',
    ],
    colMd4: [
      'withRisk',
      'hasComplaints',
      'riskLevels',
    ],
  }

  const filtersGroups = {
    queuePriority: ['queuePriority'],
    // customer: ['regions', 'procuringEntities', 'procuringEntityKind'],
    customer: ['regions', 'procuringEntities'],
    procedure: ['procedureTypes', 'tenderStatuses', 'currency', 'complaints'],
    subjectPurchase: ['gsw', 'cpvNames', 'cpv2Names'],
    risk: ['riskedIndicators', 'riskedProcedures', 'tenderRank'],
    monitoring: ['monitoringStatus', 'monitoringOffices', 'monitoringCause', 'monitoringAppeal'],
  }
  const groups = Object.values(FILTERS_POS)
  const groupKeys = Object.keys(filtersGroups)

  const CLASSES = ['col-md-12', 'col-md-6', 'col-md-4']

  if (!!_.find(groups[0], str => str === elem)) return CLASSES[0]
  else if (!!_.find(groups[1], str => str === elem)) return CLASSES[1]
  else if (!!_.find(groups[2], str => str === elem)) return CLASSES[2]

  return CLASSES[0]
}

const getGroupName = elem => {
  // const filtersGroups = {
  //   queuePriority: ['queuePriority'],
  //   // customer: ['regions', 'procuringEntities', 'procuringEntityKind'],
  //   // customer: ['regions', 'procuringEntities'],
  //   customer: ['buyerRegions', 'buyer'],
  //   procedure: ['procedureTypes', 'tenderStatuses', 'currency', 'complaints'],
  //   subjectPurchase: ['gsw', 'cpvNames', 'cpv2Names'],
  //   risk: ['riskedIndicators', 'riskedProcedures', 'tenderRank'],
  //   monitoring: ['monitoringStatus', 'monitoringOffices', 'monitoringCause', 'monitoringAppeal'],
  // }

  // const groups = Object.values(filtersGroups)
  // const groupKeys = Object.keys(filtersGroups)
  const groups = Object.values(FILTER_GROUPS)
  const groupKeys = Object.keys(FILTER_GROUPS)

  if (!!_.find(groups[0], str => str === elem)) return groupKeys[0]
  else if (!!_.find(groups[1], str => str === elem)) return groupKeys[1]
  else if (!!_.find(groups[2], str => str === elem)) return groupKeys[2]
  else if (!!_.find(groups[3], str => str === elem)) return groupKeys[3]
  else if (!!_.find(groups[4], str => str === elem)) return groupKeys[4]
  else if (!!_.find(groups[5], str => str === elem)) return groupKeys[5]

  return null
}

const getFilterUAKey = elem => {
  let KEYS = {
    buyers: 'common.text.24',
    procurementMethodDetails: 'common.text.113',
    statusDetails: 'common.text.114',
    buyerRegions: 'common.text.23',
    riskLevels: 'common.text.120',
    hasComplaints: 'common.text.115',
    withRisk: 'common.text.123',
    itemCpv2: 'common.text.116',
    itemCpv: 'common.text.117',
    riskedIndicators: 'common.text.119',
  }
  if (_.isEmpty(KEYS[elem]) || KEYS[elem] === '') return elem
  return KEYS[elem]
}

const getFilters = arr => {
  const keys = Object.keys(arr)
  const data = Object.values(arr)

  let filters = keys.map((elem, i) => {
    return {
      key: elem === 'queuePriority' ? 'hasPriorityStatus' : elem,
      keyUA: getFilterUAKey(elem),
      type: getFilterType(data[i].length, elem),
      options: getFilterOptions(data[i], elem),
      group: getGroupName(elem),
      position: getFilterPosition(elem),
      translationOptions: FILTER_ITEM_TRANSLATION_OPTIONS[elem],
    }
  })

  return filters
  // let result = []
  //
  // result.push(_.find(filters, ['keyUA', 'common.text.23']))
  // result.push(_.find(filters, ['keyUA', 'Валюта закупівлі']))
  // result.push(_.find(filters, ['keyUA', 'common.text.24']))
  // result.push(_.find(filters, ['keyUA', 'Товари, послуги/Роботи']))
  // result.push(_.find(filters, ['keyUA', 'Тип замовника']))
  // result.push(_.find(filters, ['keyUA', 'common.text.116']))
  // result.push(_.find(filters, ['keyUA', 'За методом закупівлі']))
  // result.push(_.find(filters, ['keyUA', 'Предмет закупівлі']))
  // result.push(_.find(filters, ['keyUA', 'Стадія процедури']))
  // result.push(_.find(filters, ['keyUA', 'Спрацьований індикатор ризику']))
  // result.push(_.find(filters, ['keyUA', 'Моніторинг']))
  // result.push(_.find(filters, ['keyUA', 'Процедури за ознакою ризику']))
  // result.push(_.find(filters, ['keyUA', 'Підрозділ, що проводить моніторинг']))
  // result.push(_.find(filters, ['keyUA', 'Група ризику']))
  // result.push(_.find(filters, ['keyUA', 'Підстава моніторингу']))
  // result.push(_.find(filters, ['keyUA', 'Наявність скарг']))
  // result.push(_.find(filters, ['keyUA', 'Оскарження результатів моніторингу в суді']))
  // result.push(_.find(filters, ['keyUA', 'Черга']))
  //
  // return result
}

const getFilterSelection = (key, selected) => {
  if (selected == null) return null
  if (
    key === 'withRisk' ||
    key === 'hasComplaints'
    // key === 'monitoringAppeal' ||
    // key === 'monitoringStatus' ||
    // key === 'procedureId' ||
    // key === 'procuringEntityKind' ||
    // key === 'riskedProcedure' ||
    // key === 'searchField' ||
    // key === 'searchValue'
  )
    return selected

  if (key === 'tenderScores') {
    if (_.isEmpty(selected)) return null
    return [parseFloat(selected)]
  }
  return selected
}

const setSelectedFilter = (filtersState, selectParams) => {
  let selectedFilters = { ...filtersState }
  selectedFilters[selectParams.key] = getFilterSelection(
    selectParams.key,
    selectParams.selected,
    selectedFilters,
  )

  return selectedFilters
}

const setSelectedDisplay = (filtersState, selectParams, props, selectedUA, translationOptions) => {
  let selectedFilters = { ...filtersState }
  selectedFilters[selectParams.key] = {
    key: selectParams.key,
    keyUA: selectParams.keyUA,
    selected: selectParams.selected,
    props: selectParams.props,
    selectedUA: selectedUA,
    translationOptions: translationOptions,
  }
  return selectedFilters
}

const deselectedFilter = (filtersState, selectParams) => {
  let filters = _.cloneDeep(filtersState)
  filters[selectParams.key] = _.filter(filters[selectParams.key], o => {
    return o !== selectParams.selected
  })
  return filters
}
const dropFilter = (filtersState, filterKey) => {
  let filters = _.cloneDeep(filtersState)
  delete filters[filterKey]
  return filters
}

const deselectedDisplay = (filtersState, selectParams) => {
  let filters = _.cloneDeep(filtersState)

  if (_.isEmpty(filtersState)) return

  if (filters[selectParams.key] === undefined) return

  if (filters[selectParams.key].selected !== undefined) {
    filters[selectParams.key].selected = _.filter(filtersState[selectParams.key].selected, o => {
      return o !== selectParams.selected
    })
  }
  if (!_.isEmpty(filters[selectParams.key].selectedUA))
    filters[selectParams.key].selectedUA = _.filter(
      filtersState[selectParams.key].selectedUA,
      o => {
        let keyUA = _.find(selectParams.prevOptions, ['key', selectParams.selected])
        if (keyUA === undefined) return null

        return o !== keyUA.value
      },
    )

  return filters
}

const initialState = {
  allData: null,
  allDataIsFetching: false,
  allDataError: null,
  noDataFound: false,

  //OLD UKRAINE DATA
  data: null,
  dataIsFetching: false,
  error: null,

  bucket: {},
  bucketIsFetching: null,

  excelFile: null,
  excelHeaders: null,
  exportIsFetching: null,
  procedureIds: null,

  mappings: {},
  mappingsIsFetching: null,

  filters: null,
  filtersSelected: {},
  filtersDisplay: {},

  typeOfValues: 'count',

  regions: [],
  risks: [],
  indicators: [],
  importanceCoefficient: {},
  tendersCompletedDays: null,
  prioritizationPercent: {},
  bucketRiskGroupParameters: {},

  tenderOuterId: null,
  tenderId: null,
  indicatorQuestions: [],
  status: null,
  id: null,
  indicatorsChecklist: [],
}

const monitoring = (state = initialState, action) => {
  switch (action.type) {
    case MonitoringConstants.GET_MONITORING_DATA + STATUSES.req:
      return {
        ...state,
        allDataIsFetching: true,
        allDataError: null,
      }
    case MonitoringConstants.GET_MONITORING_DATA + STATUSES.suc:
      return {
        ...state,
        allData: action.payload,
        // data: action.payload,
        allDataIsFetching: false,
        allDataError: null,
        filters: getFilters(action.payload.availableFilters),
      }
    case MonitoringConstants.GET_MONITORING_DATA + STATUSES.err:
      return {
        ...state,
        allDataIsFetching: false,
        allDataError: action.payload.message,
        // error: {
        //   name: action.payload.error || null,
        //   status: action.payload.status || null,
        //   description: action.payload.message || null,
        // },
      }
    case MonitoringConstants.GET_MONITORING_DATA + STATUSES.cle:
      return {
        ...state,
        allData: null,
        allDataIsFetching: false,
        allDataError: null,
      }

//OLD DATA UKRAINE
    case GET_DATA + STATUSES.req:
      return {
        ...state,
        dataIsFetching: true,
        allDataIsFetching: true,
        error: null,
      }
    case GET_DATA + STATUSES.suc:
      return {
        ...state,
        data: action.payload,
        dataIsFetching: false,
        allDataIsFetching: false,
        error: null,
        filters: getFilters(action.payload.availableFilters),
      }
    case GET_DATA + STATUSES.err:
      return {
        ...state,
        dataIsFetching: false,
        allDataIsFetching: false,
        error: {
          name: action.payload.error || null,
          status: action.payload.status || null,
          description: action.payload.message || null,
        },
      }
    case GET_DATA + STATUSES.cle:
      return {
        ...state,
        dataIsFetching: false,
        allDataIsFetching: false,
        error: null,
        data: null,
      }

    case UPDATE_DATA + STATUSES.req:
      return {
        ...state,
        dataIsFetching: true,
        allDataIsFetching: true,
        error: null,
      }
    case UPDATE_DATA + STATUSES.suc:
      return {
        ...state,
        data: action.payload,
        allData: action.payload,
        dataIsFetching: false,
        allDataIsFetching: false,
        filters: getFilters(action.payload.availableFilters),
        error: null,
      }
    case UPDATE_DATA + STATUSES.err:
      return {
        ...state,
        data: null,
        allData: null,
        dataIsFetching: false,
        allDataIsFetching: false,
        error: {
          name: action.payload.error || null,
          status: action.payload.status || null,
          description: action.payload.message || null,
        },
      }
    case UPDATE_DATA + STATUSES.cle:
      return {
        ...state,
        dataIsFetching: false,
        allDataIsFetching: false,
        error: null,
        data: null,
        allData: null,
      }

    case UPDATE_FILTER_OPTIONS + STATUSES.req:
      return {
        ...state,
        noDataFound: false,
        dataIsFetching: true,
        error: null,
      }
    case UPDATE_FILTER_OPTIONS + STATUSES.suc:
      let clonedData = _.cloneDeep(state.allData)
      let parsedData = _.map(action.payload[Object.keys(action.payload)[0]], el => {
        return {
          key: el.key,
          value: el.value,
        }
      })
      clonedData.availableFilters[Object.keys(action.payload)[0]] = parsedData

      if (_.isEmpty(action.payload[Object.keys(action.payload)[0]])) {
        // message.error('За даним запитом даних не знайдено')

        return {
          ...state,
          noDataFound: true,
        }
      }

      return {
        ...state,
        data: clonedData,
        dataIsFetching: false,
        filters: getFilters(clonedData.availableFilters),
        error: null,
      }
    case UPDATE_FILTER_OPTIONS + STATUSES.err:
      return {
        ...state,
        dataIsFetching: false,
        error: {
          name: action.payload.error || null,
          status: action.payload.status || null,
          description: action.payload.message || null,
        },
      }
    case UPDATE_FILTER_OPTIONS + STATUSES.cle:
      return {
        ...state,
        dataIsFetching: false,
        error: null,
        data: null,
      }

    case CLEAR_OPTIONS + STATUSES.cle:
      return {
        ...state,
        filtersSelected: {},
        filtersDisplay: {},
        error: null,
      }

    case MonitoringConstants.CLEAR_NO_FILTER_DATA + STATUSES.cle:
      return {
        ...state,
        noDataFound: false,
      }

    case SELECT_OPTION + STATUSES.suc:
      return {
        ...state,
        filtersSelected: setSelectedFilter(state.filtersSelected, action.selected),
        filtersDisplay: setSelectedDisplay(
          state.filtersDisplay,
          action.selected || null,
          action.props || null,
          action.selected.selectedUA || null,
          action.selected.translationOptions || null,
        ),
        error: null,
      }

    case DESELECT_OPTION + STATUSES.suc:
      return {
        ...state,
        filtersSelected: deselectedFilter(state.filtersSelected, action.selected),
        filtersDisplay: deselectedDisplay(state.filtersDisplay, action.selected, action.props),
        error: null,
      }

    case DROP_OPTION + STATUSES.suc:
      return {
        ...state,
        filtersSelected: dropFilter(state.filtersSelected, action.filterKey),
        filtersDisplay: dropFilter(state.filtersDisplay, action.filterKey),
        error: null,
      }

    case TYPE_OF_VALUES + STATUSES.chenge:
      return {
        ...state,
        typeOfValues: action.typeOfValues,
      }

    case GET_BUCKET_DATA + STATUSES.req:
      return {
        ...state,
        bucketIsFetching: true,
        error: null,
      }
    case GET_BUCKET_DATA + STATUSES.suc:
      return {
        ...state,
        bucket: action.payload,
        bucketIsFetching: false,
        error: null,
      }
    case GET_BUCKET_DATA + STATUSES.err:
      return {
        ...state,
        bucketIsFetching: false,
        error: {
          name: action.payload.error || null,
          status: action.payload.status || null,
          description: action.payload.message || null,
        },
      }

    case SET_BUCKET_DATA + STATUSES.req:
      return {
        ...state,
        bucketIsFetching: true,
        error: null,
      }
    case SET_BUCKET_DATA + STATUSES.suc:
      return {
        ...state,
        // bucket: action.payload,
        bucketIsFetching: false,
        error: null,
      }
    case SET_BUCKET_DATA + STATUSES.err:
      return {
        ...state,
        bucketIsFetching: false,
        error: {
          name: '',
          status: '',
          description: 'SERVER ERROR',
        },
        // error: {
        //   name: action.payload.error || null,
        //   status: action.payload.status || null,
        //   description: action.payload.message || null,
        // },
      }

    case DELETE_BUCKET_DATA + STATUSES.req:
      return {
        ...state,
        bucketIsFetching: true,
        error: null,
      }
    case DELETE_BUCKET_DATA + STATUSES.suc:
      return {
        ...state,
        bucketIsFetching: false,
        error: null,
      }
    case DELETE_BUCKET_DATA + STATUSES.err:
      return {
        ...state,
        bucketIsFetching: false,
        error: {
          name: '',
          status: '',
          description: 'SERVER ERROR',
        },
        // error: {
        //   name: action.payload.error || null,
        //   status: action.payload.status || null,
        //   description: action.payload.message || null,
        // },
      }

    case SET_REGIONS + STATUSES.suc:
      return {
        ...state,
        regions: state.allData ? state.allData.availableFilters.regions : [],
      }

    case PROC_EXPORT + STATUSES.req:
      return {
        ...state,
        exportIsFetching: true,
        error: null,
      }
    case PROC_EXPORT + STATUSES.suc:
      return {
        ...state,
        excelFile: action.payload.fileBlob,
        excelHeaders: action.payload.headers,
        procedureIds: null,
        exportIsFetching: false,
        error: null,
      }
    case PROC_EXPORT + STATUSES.err:
      return {
        ...state,
        exportIsFetching: false,
        error: {
          name: action.payload.error || null,
          status: action.payload.status || null,
          description: action.payload.message || null,
        },
      }
    case PROC_EXPORT + STATUSES.cle:
      return {
        ...state,
        excelFile: null,
        excelHeaders: null,
        exportIsFetching: false,
        error: null,
      }

    case GET_RISKS + STATUSES.suc:
      return {
        ...state,
        risks: action.payload,
      }

    case GET_ALL_PROCEDURES_IDS + STATUSES.req:
      return {
        ...state,
        dataIsFetching: true,
        error: null,
      }
    case GET_ALL_PROCEDURES_IDS + STATUSES.suc:
      return {
        ...state,
        procedureIds: action.payload,
        dataIsFetching: false,
        error: null,
      }
    case GET_ALL_PROCEDURES_IDS + STATUSES.err:
      return {
        ...state,
        dataIsFetching: false,
        error: {
          name: action.payload.error || null,
          status: action.payload.status || null,
          description: action.payload.message || null,
        },
      }
    case GET_ALL_PROCEDURES_IDS + STATUSES.cle:
      return {
        ...state,
        procedureIds: null,
        dataIsFetching: false,
        error: null,
      }

    case GET_PARAMETERS + STATUSES.req:
    case POST_PARAMETERS + STATUSES.req:
      return {
        ...state,
        error: null,
      }
    case GET_PARAMETERS + STATUSES.suc:
    case POST_PARAMETERS + STATUSES.suc:
      return {
        ...state,
        indicators: action.payload.indicators,
        importanceCoefficient: action.payload.importanceCoefficient,
        tendersCompletedDays: action.payload.tendersCompletedDays,
        prioritizationPercent: action.payload.prioritizationPercent,
        bucketRiskGroupParameters: action.payload.bucketRiskGroupParameters,
        error: null,
      }
    case GET_PARAMETERS + STATUSES.err:
    case POST_PARAMETERS + STATUSES.err:
      return {
        ...state,
        error: {
          name: action.payload.error || null,
          status: action.payload.status || null,
          description: action.payload.message || null,
        },
      }

    case GET_CHECKLIST + STATUSES.req:
      return {
        ...state,
        error: null,
      }
    case GET_CHECKLIST + STATUSES.suc:
      return {
        ...state,
        id: action.payload.id,
        tenderOuterId: action.payload.tenderOuterId,
        tenderId: action.payload.tenderId,
        reason: action.payload.reason,
        indicatorsChecklist: action.payload.indicators,
        error: null,
      }
    case GET_CHECKLIST + STATUSES.err:
      return {
        ...state,
        error: {
          name: action.payload.error || null,
          status: action.payload.status || null,
          description: action.payload.message || null,
        },
      }

    case POST_CHECKLIST + STATUSES.req:
      return {
        ...state,
        error: null,
      }
    case POST_CHECKLIST + STATUSES.suc:
      return {
        ...state,
        id: null,
        tenderOuterId: null,
        status: null,
        indicatorsChecklist: null,
        error: null,
      }
    case POST_CHECKLIST + STATUSES.err:
      return {
        ...state,
        error: {
          name: action.payload.error || null,
          status: action.payload.status || null,
          description: action.payload.message || null,
        },
      }

    case GET_CHECKLIST_CREATE + STATUSES.req:
      return {
        ...state,
        error: null,
      }
    case GET_CHECKLIST_CREATE + STATUSES.suc:
      return {
        ...state,
        id: null,
        tenderOuterId: action.payload.tenderOuterId,
        tenderId: action.payload.tenderId,
        indicatorQuestions: action.payload.indicators,
        indicatorsChecklist: null,
        error: null,
      }
    case GET_CHECKLIST_CREATE + STATUSES.err:
      return {
        ...state,
        error: {
          name: action.payload.error || null,
          status: action.payload.status || null,
          description: action.payload.message || null,
        },
      }

    case CLEAR_CHECKLIST + STATUSES.cle:
      return {
        ...state,
        id: null,
        tenderOuterId: null,
        tenderId: null,
        reason: '',
        indicatorsChecklist: [],
      }

    case GET_MAPPINGS + STATUSES.req:
      return {
        ...state,
        mappingsIsFetching: true,
        error: null,
      }
    case GET_MAPPINGS + STATUSES.suc:
      return {
        ...state,
        mappings: action.payload,
        mappingsIsFetching: false,
        error: null,
      }
    case GET_MAPPINGS + STATUSES.err:
      return {
        ...state,
        mappingsIsFetching: false,
        error: {
          name: action.payload.error || null,
          status: action.payload.status || null,
          description: action.payload.message || null,
        },
      }
    default:
      return state
  }
}

export default monitoring
