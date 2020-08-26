import * as Types from './apiExportConstants'
import * as API from '../../../utils/api/apiConstants'
import FileSaver from 'file-saver'

import { fileFetch } from '../../../utils/api/apiUtils'


export const getJsonData = (dateRange) => {
  const TYPES = [
    Types.GET_JSON_DATA_REQUEST,
    Types.GET_JSON_DATA_SUCCESS,
    Types.GET_JSON_DATA_FAILURE,
  ]
  return fileFetch(`${API.EXPORT_JSON_API_URI}?from=${dateRange.dateFrom}&to=${dateRange.dateTo}`, TYPES)
}

export const getCsvData = (dateRange) => {
  const TYPES = [
    Types.GET_CSV_DATA_REQUEST,
    Types.GET_CSV_DATA_SUCCESS,
    Types.GET_CSV_DATA_FAILURE,
  ]
  return fileFetch(`${API.EXPORT_CSV_API_URI}?from=${dateRange.dateFrom}&to=${dateRange.dateTo}`, TYPES)
}


export const exportToFile = (dateRange, type, fileName) => {
  return (dispatch, getState) => {
    return dispatch(exportTo(dateRange, type))
      .then(() => {
        const {
          excelFile,
        } = getState().apiExportDataStore
        excelFile.then((arrayBuffer) => {
          const blob = new Blob([arrayBuffer])
          FileSaver.saveAs(blob, fileName)
        })
      })
      .then(() => dispatch({
        type: Types.PROC_EXPORT_CLEAR
      }))
  }
}

export const exportTo = (dateRange, type) => {
  const TYPES = [
    Types.PROC_EXPORT_REQUEST,
    {
      type: Types.PROC_EXPORT_SUCCESS,
      payload: (action, state, res) => {
        return {
          headers: {
            headersFileType: res.headers.get('Content-Type'),
            headersFilename: res.headers.get('Content-Disposition'),
          },
          fileBlob: res.arrayBuffer()
        }
      }
    },
    Types.PROC_EXPORT_FAILURE,
  ]
  return fileFetch(`${type === 'json' ? API.EXPORT_JSON_API_URI : API.EXPORT_CSV_API_URI}?from=${dateRange.dateFrom}&to=${dateRange.dateTo}`, TYPES)
}