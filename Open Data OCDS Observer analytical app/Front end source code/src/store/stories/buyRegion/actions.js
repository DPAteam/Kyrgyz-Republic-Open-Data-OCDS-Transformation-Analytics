import { get } from '../../../utils/api/apiUtils'
import * as API from '../../../utils/api/apiConstants'
import * as TYPE from './constants'


export const getWhatToBuyRegionsData = (dateRange) => {
  const TYPES = [
    TYPE.WHAT_TO_BUY_REGIONS_REQUEST,
    TYPE.WHAT_TO_BUY_REGIONS_SUCCESS,
    TYPE.WHAT_TO_BUY_REGIONS_FAILURE,
  ]
  // return get(`${API.WHAT_TO_BUY_REGIONS_API_URI}?year=${year}`, TYPES)
  return get(`${API.WHAT_TO_BUY_REGIONS_API_URI}?from=${dateRange.dateFrom}&to=${dateRange.dateTo}`, TYPES)
}

export const getRegionsTopProcurement = (reqData) => {
  const TYPES = [
    TYPE.GET_REGIONS_TOP_PROCUREMENT_REQUEST,
    TYPE.GET_REGIONS_TOP_PROCUREMENT_SUCCESS,
    TYPE.GET_REGIONS_TOP_PROCUREMENT_FAILURE,
  ]
  return get(API.GET_REGIONS_TOP_PROCUREMENT, TYPES, reqData)
}

export const getRegionsCompetitivityProcurement = (reqData) => {
  const TYPES = [
    TYPE.GET_REGIONS_COMPETITIVITY_PROCUREMENT_REQUEST,
    TYPE.GET_REGIONS_COMPETITIVITY_PROCUREMENT_SUCCESS,
    TYPE.GET_REGIONS_COMPETITIVITY_PROCUREMENT_FAILURE,
  ]
  return get(API.GET_REGIONS_COMPETITIVITY_PROCUREMENT, TYPES, reqData)
}

export const getLocality = () => {
  const TYPES = [
    TYPE.LOCALITY_REQUEST,
    TYPE.LOCALITY_SUCCESS,
    TYPE.LOCALITY_FAILURE,
  ]
  return get(API.DETECT_LOCALITY, TYPES)
}
