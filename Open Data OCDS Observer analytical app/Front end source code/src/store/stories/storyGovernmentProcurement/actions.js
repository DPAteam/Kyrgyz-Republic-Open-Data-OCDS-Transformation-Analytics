import { get }   from '../../../utils/api/apiUtils'
import * as Type from './constants'
import * as API  from '../../../utils/api/apiConstants'


export const getStoryGovernmentProcurement = () => {
  const TYPES = [
    Type.GET_STORY_GOVERNMENT_PROCUREMENT_REQUEST,
    Type.GET_STORY_GOVERNMENT_PROCUREMENT_SUCCESS,
    Type.GET_STORY_GOVERNMENT_PROCUREMENT_FAILURE,
  ]
  return get(API.STORY_GOVERNMENT_PROCUREMENT, TYPES)
}

export const getInternationalData = () => {
  const TYPES = [
    Type.GET_INTERNATIONAL_DATA_REQUEST,
    Type.GET_INTERNATIONAL_DATA_SUCCESS,
    Type.GET_INTERNATIONAL_DATA_FAILURE,
  ]
  return get(API.INTERNATIONAL_API_URI, TYPES)
}
