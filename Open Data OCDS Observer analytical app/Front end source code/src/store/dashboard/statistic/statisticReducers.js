import * as Types from './statisticConstants'


const statisticDataState = {
  statisticData: {},
  statisticDataIsFetching: false,
  statisticDataErrorMessage: null,
}

const statisticDataStore = (state = statisticDataState, action) => {
  switch (action.type) {
    case Types.GET_STATISTIC_DATA_REQUEST:
      return {
        ...state,
        statisticDataIsFetching: true,
        statisticDataErrorMessage: null,
      }
    case Types.GET_STATISTIC_DATA_SUCCESS:
      return {
        ...state,
        statisticDataIsFetching: false,
        statisticData: action.payload,
      }
    case Types.GET_STATISTIC_DATA_FAILURE:
      return {
        ...state,
        statisticDataIsFetching: false,
        statisticDataErrorMessage: action.errorMessage,
      }
    case Types.GET_STATISTIC_DATA_CLEAR:
      return {
        ...state,
        statisticData: {},
      }

    default:
      return {
        ...state,
      }
  }
}

export default statisticDataStore
