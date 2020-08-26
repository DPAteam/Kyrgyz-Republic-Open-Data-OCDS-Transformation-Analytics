import * as Types from "./statisticConstants"
import * as API   from "../../../utils/api/apiConstants"

import { get }    from "../../../utils/api/apiUtils"


export const getStatisticData = (dateRange) => {
  const TYPES = [
    Types.GET_STATISTIC_DATA_REQUEST,
    Types.GET_STATISTIC_DATA_SUCCESS,
    Types.GET_STATISTIC_DATA_FAILURE
  ]
  return get(`${API.STATISTIC_API_URI}?from=${dateRange.dateFrom}&to=${dateRange.dateTo}`, TYPES)
}
