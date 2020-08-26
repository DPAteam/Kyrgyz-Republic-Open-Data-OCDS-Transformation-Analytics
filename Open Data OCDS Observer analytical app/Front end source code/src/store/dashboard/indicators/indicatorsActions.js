import * as Types from "./indicatorsConstants"
import * as API   from "../../../utils/api/apiConstants"

import { get }    from "../../../utils/api/apiUtils"

export const getIndicatorsData = () => {
  const TYPES = [
    Types.GET_INDICATORS_DATA_REQUEST,
    Types.GET_INDICATORS_DATA_SUCCESS,
    Types.GET_INDICATORS_DATA_FAILURE
  ]
  return get(API.INDICATORS_API_URI, TYPES)
}

export const clearIndicatorsData = () => {
  return dispatch => dispatch({type: Types.GET_INDICATORS_DATA_CLEAR})
}
