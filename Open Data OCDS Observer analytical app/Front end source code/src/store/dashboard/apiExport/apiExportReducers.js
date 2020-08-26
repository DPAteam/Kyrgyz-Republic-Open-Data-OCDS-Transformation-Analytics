import * as Types from './apiExportConstants'


const apiExportDataState = {
  jsonData: {},
  jsonDataIsFetching: false,
  jsonDataErrorMessage: null,
}

const apiExportDataStore = (state = apiExportDataState, action) => {
  switch (action.type) {
    case Types.GET_JSON_DATA_REQUEST:
      return {
        ...state,
        jsonDataIsFetching: true,
        jsonDataErrorMessage: null,
      }
    case Types.GET_JSON_DATA_SUCCESS:
      return {
        ...state,
        jsonDataIsFetching: false,
        jsonData: action.payload,
      }
    case Types.GET_JSON_DATA_FAILURE:
      return {
        ...state,
        jsonDataIsFetching: false,
        jsonDataErrorMessage: action.errorMessage,
      }
    case Types.GET_JSON_DATA_CLEAR:
      return {
        ...state,
        jsonData: {},
      }
    case Types.PROC_EXPORT_REQUEST:
      return {
        ...state,
        excelFileIsFetching: true,
        excelFileErrorMessage: null,
      }
    case Types.PROC_EXPORT_SUCCESS:
      return {
        ...state,
        excelFileIsFetching: false,
        excelFile: action.payload.fileBlob,
      }
    case Types.PROC_EXPORT_FAILURE:
      return {
        ...state,
        excelFileIsFetching: false,
        excelFileErrorMessage: action.errorMessage,
      }
    case Types.PROC_EXPORT_CLEAR:
      return {
        ...state,
        excelFile: {},
      }

    default:
      return {
        ...state,
      }
  }
}

export default apiExportDataStore
