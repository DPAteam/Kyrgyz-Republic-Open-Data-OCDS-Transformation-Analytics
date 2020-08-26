import * as Type from './constants'


const initialState = {
  governmentProcurement: {},
  governmentProcurementIsFetching: false,
  governmentProcurementErrorMessage: null,
  internationalData: {},
  internationalDataIsFetching: false,
  internationalDataErrorMessage: null,
}

const governmentProcurementState = (state = initialState, action) => {
  switch (action.type) {
    case Type.GET_STORY_GOVERNMENT_PROCUREMENT_REQUEST:
      return {
        ...state,
        governmentProcurementIsFetching: true,
        governmentProcurementErrorMessage: null,
      }

    case Type.GET_STORY_GOVERNMENT_PROCUREMENT_SUCCESS:
      return {
        ...state,
        governmentProcurement: action.payload,
        governmentProcurementIsFetching: false,
      }

    case Type.GET_STORY_GOVERNMENT_PROCUREMENT_FAILURE:
      return {
        ...state,
        governmentProcurementIsFetching: false,
        governmentProcurementErrorMessage: action.errorMessage,
      }

    case Type.GET_STORY_GOVERNMENT_PROCUREMENT_CLEAR:
      return {
        ...state,
        governmentProcurement: {},
      }

    case Type.GET_INTERNATIONAL_DATA_REQUEST:
      return {
        ...state,
        internationalDataIsFetching: true,
        internationalDataErrorMessage: null,
      }

    case Type.GET_INTERNATIONAL_DATA_SUCCESS:
      return {
        ...state,
        internationalData: action.payload,
        internationalDataIsFetching: false,
      }

    case Type.GET_INTERNATIONAL_DATA_FAILURE:
      return {
        ...state,
        internationalDataIsFetching: false,
        internationalDataErrorMessage: action.errorMessage,
      }

    case Type.GET_INTERNATIONAL_DATA_CLEAR:
      return {
        ...state,
        internationalData: {},
        internationalDataErrorMessage: '',
      }

    default:
      return {
        ...state,
      }
  }
}

export default governmentProcurementState
