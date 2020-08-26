import * as Types from './indicatorsConstants'


const indicatorsDataState = {
  indicatorsData: {},
  indicatorsDataIsFetching: false,
  indicatorsDataErrorMessage: null,
}

const indicatorsDataStore = (state = indicatorsDataState, action) => {
  switch (action.type) {
    case Types.GET_INDICATORS_DATA_REQUEST:
      return {
        ...state,
        indicatorsDataIsFetching: true,
        indicatorsDataErrorMessage: null,
      }
    case Types.GET_INDICATORS_DATA_SUCCESS:
      return {
        ...state,
        indicatorsDataIsFetching: false,
        indicatorsData: action.payload,
      }
    case Types.GET_INDICATORS_DATA_FAILURE:
      return {
        ...state,
        indicatorsDataIsFetching: false,
        indicatorsDataErrorMessage: action.errorMessage,
      }
    case Types.GET_INDICATORS_DATA_CLEAR:
      return {
        ...state,
        indicatorsData: {},
        indicatorsDataIsFetching: false,
        indicatorsDataErrorMessage: null,
      }

    default:
      return {
        ...state,
      }
  }
}

export default indicatorsDataStore
