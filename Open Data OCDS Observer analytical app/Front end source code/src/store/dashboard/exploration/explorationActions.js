import * as Types from "./explorationConstants"
import * as API   from "../../../utils/api/apiConstants"

import { get }    from "../../../utils/api/apiUtils"


export const getExplorationData = () => {
  const TYPES = [
    Types.GET_EXPLORATION_DATA_REQUEST,
    Types.GET_EXPLORATION_DATA_SUCCESS,
    Types.GET_EXPLORATION_DATA_FAILURE
  ]
  return get(API.EXPLORATION_API_URI, TYPES)
}
