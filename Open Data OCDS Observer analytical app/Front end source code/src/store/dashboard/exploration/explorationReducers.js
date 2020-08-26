import * as Types from './explorationConstants'


const explorationDataState = {
  explorationData: {},
  explorationDataIsFetching: false,
  explorationDataErrorMessage: null,
}

const explorationDataStore = (state = explorationDataState, action) => {
  switch (action.type) {
    case Types.GET_EXPLORATION_DATA_REQUEST:
      return {
        ...state,
        explorationDataIsFetching: true,
        explorationDataErrorMessage: null,
      }
    case Types.GET_EXPLORATION_DATA_SUCCESS:
      return {
        ...state,
        explorationDataIsFetching: false,
        explorationData: action.payload,
      }
    case Types.GET_EXPLORATION_DATA_FAILURE:
      return {
        ...state,
        explorationDataIsFetching: false,
        explorationDataErrorMessage: action.errorMessage,
      }
    case Types.GET_EXPLORATION_DATA_CLEAR:
      return {
        ...state,
        explorationData: {},
      }

    default:
      return {
        ...state,
      }
  }
}

export default explorationDataStore
