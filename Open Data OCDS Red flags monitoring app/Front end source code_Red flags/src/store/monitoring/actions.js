import {
  post,
  get,
  put,
  delS, fileFetch,
}                   from "../../api/utils"
import { STATUSES } from "../constants"
import {
  _BUCKET,
  EXPORT_TO,
  FILTER_ALL,
  MAPPING_RISKS,
  SELECT_ALL_PROC,
  UPDATE_OPTIONS,
  GET_PARAMETERS_LIST,
  POST_PARAMETERS_LIST,
  POST_CHECKLIST_SAVE,
  GET_CHECKLIST_SAVE,
  GET_CHECKLIST_CREATE_ID,
  MAPPINGS_URI,
  GET_FAKE_403,
} from '../../api/constants'
import {
  GET_DATA,
  UPDATE_DATA,
  TYPE_OF_VALUES,
  CLEAR_OPTIONS,
  SELECT_OPTION,
  DESELECT_OPTION,
  GET_BUCKET_DATA,
  DELETE_BUCKET_DATA,
  SET_BUCKET_DATA,
  SET_REGIONS,
  PROC_EXPORT,
  GET_RISKS,
  UPDATE_FILTER_OPTIONS,
  GET_ALL_PROCEDURES_IDS,
  GET_PARAMETERS,
  POST_PARAMETERS,
  POST_CHECKLIST,
  GET_CHECKLIST,
  GET_CHECKLIST_CREATE,
  GET_MAPPINGS,
  DROP_OPTION,
  CLEAR_CHECKLIST,
  GET_FAKE_FORBIDDEN,
  CPV_SEARCH_VALUES
} from './constants'

import * as MonitoringConstants from './constants'
import * as API from '../../api/constants'
import * as FileSaver from 'file-saver'

export const getMonitoringAllFilterData = data => {
  const TYPES = [
    MonitoringConstants.GET_MONITORING_DATA + STATUSES.req,
    MonitoringConstants.GET_MONITORING_DATA + STATUSES.suc,
    MonitoringConstants.GET_MONITORING_DATA + STATUSES.err,
  ]
  // return get(API.GET_MONITORING_FILTER_ALL, TYPES, data, false)
  return post(API.GET_MONITORING_FILTER_ALL, TYPES, data)
}

export const getFakeForbidden = data => {
  const TYPES = [
    GET_FAKE_FORBIDDEN + STATUSES.req,
    GET_FAKE_FORBIDDEN + STATUSES.suc,
    GET_FAKE_FORBIDDEN + STATUSES.err,
  ]
  return get(GET_FAKE_403, TYPES, data, false)
}

export const changeTypeOfValues = type => {
  return {
    type: TYPE_OF_VALUES + STATUSES.chenge,
    typeOfValues: type,
  }
}


export const clearNoFilterData = type => {
  return {
    type: MonitoringConstants.CLEAR_NO_FILTER_DATA + STATUSES.cle,
  }
}

export const setRegions = () => {
  return {
    type: SET_REGIONS + STATUSES.suc,
  }
}

export const exportToExcel = (path, ids, fileName) => {
  return (dispatch, getState) => {
    return dispatch(exportToEXCEL(path, ids))
      .then(() => {
        const {
          excelFile,
        } = getState().monitoring
        excelFile.then((arrayBuffer) => {
          const blob = new Blob([arrayBuffer], { type: 'application/vnd.ms-excel' })
          FileSaver.saveAs(blob, `${fileName}.xlsx`)
        })
      })
      .then(() => dispatch({
        type: PROC_EXPORT + STATUSES.cle,
      }))
  }
}

export const exportToEXCEL = (path, ids) => {
  const TYPES = [
    PROC_EXPORT + STATUSES.req,
    {
      type: PROC_EXPORT + STATUSES.suc,
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
    PROC_EXPORT + STATUSES.err,
  ]
  return fileFetch(path, TYPES, ids)
}

export const getData = data => {
  const TYPES = [
    GET_DATA + STATUSES.req,
    GET_DATA + STATUSES.suc,
    GET_DATA + STATUSES.err,
  ]
  return post(FILTER_ALL, TYPES, data)
}

export const updateData = data => {
  const TYPES = [
    UPDATE_DATA + STATUSES.req,
    UPDATE_DATA + STATUSES.suc,
    UPDATE_DATA + STATUSES.err,
  ]
  return post(FILTER_ALL, TYPES, data)
}

export const updateFilterOptions = data => {
  const TYPES = [
    UPDATE_FILTER_OPTIONS + STATUSES.req,
    UPDATE_FILTER_OPTIONS + STATUSES.suc,
    UPDATE_FILTER_OPTIONS + STATUSES.err,
  ]
  return post(UPDATE_OPTIONS, TYPES, data)
}

export const selectFilterOption = (obj) => {
  return {
    type: SELECT_OPTION + STATUSES.suc,
    selected: obj,
  }
}

export const deselectFilterOption = (obj) => {
  return {
    type: DESELECT_OPTION + STATUSES.suc,
    selected: obj,
  }
}

export const dropFilterOption = (filterKey) => {
  return {
    type: DROP_OPTION + STATUSES.suc,
    filterKey: filterKey,
  }
}

export const clearFiltersOption = () => {
  return {
    type: CLEAR_OPTIONS + STATUSES.cle,
  }
}

export const clearSelectedProcedureIds = () => {
  return {
    type: GET_ALL_PROCEDURES_IDS + STATUSES.cle,
  }
}

export const clearChecklistData = () => {
  return {
    type: CLEAR_CHECKLIST + STATUSES.cle,
  }
}

export const updateCpvSearchValues = (filterKey, searchValue, clear = false) => {
  return {
    type: CPV_SEARCH_VALUES + STATUSES.suc,
    filterKey: filterKey,
    searchValue: searchValue,
    clear: clear,
  }
}

export const getBucketData = (requestParams) => {
  const TYPES = [
    GET_BUCKET_DATA + STATUSES.req,
    GET_BUCKET_DATA + STATUSES.suc,
    GET_BUCKET_DATA + STATUSES.err,
  ]
  return post(API.GET_ALL_BUCKET_DATA, TYPES, requestParams)
}

export const setBucketData = data => {
  const TYPES = [
    SET_BUCKET_DATA + STATUSES.req,
    SET_BUCKET_DATA + STATUSES.suc,
    SET_BUCKET_DATA + STATUSES.err,
  ]
  return post(API.ADD_TO_BUCKET, TYPES, data)
}

export const deleteBucketItem = data => {
  const TYPES = [
    DELETE_BUCKET_DATA + STATUSES.req,
    DELETE_BUCKET_DATA + STATUSES.suc,
    DELETE_BUCKET_DATA + STATUSES.err,
  ]
  return delS(API.REMOVE_FROM_BUCKET, TYPES, data)
}

export const getRisks = () => {
  const TYPES = [
    GET_RISKS + STATUSES.req,
    GET_RISKS + STATUSES.suc,
    GET_RISKS + STATUSES.err,
  ]
  return get(MAPPING_RISKS, TYPES)
}

export const getAllProcIds = (data) => {
  const TYPES = [
    GET_ALL_PROCEDURES_IDS + STATUSES.req,
    GET_ALL_PROCEDURES_IDS + STATUSES.suc,
    GET_ALL_PROCEDURES_IDS + STATUSES.err,
  ]
  return post(SELECT_ALL_PROC, TYPES, data)
}

export const getParameters = () => {
  const TYPES = [
    GET_PARAMETERS + STATUSES.req,
    GET_PARAMETERS + STATUSES.suc,
    GET_PARAMETERS + STATUSES.err,
  ]
  return get(GET_PARAMETERS_LIST, TYPES)
}

export const getMappings = () => {
  const TYPES = [
    GET_MAPPINGS + STATUSES.req,
    GET_MAPPINGS + STATUSES.suc,
    GET_MAPPINGS + STATUSES.err,
  ]
  return get(MAPPINGS_URI, TYPES)
}

export const postParameters = data => {
  const TYPES = [
    POST_PARAMETERS + STATUSES.req,
    POST_PARAMETERS + STATUSES.suc,
    POST_PARAMETERS + STATUSES.err,
  ]
  return post(POST_PARAMETERS_LIST, TYPES, data)
}

export const postChecklist = data => {
  const TYPES = [
    POST_CHECKLIST + STATUSES.req,
    POST_CHECKLIST + STATUSES.suc,
    POST_CHECKLIST + STATUSES.err,
  ]
  return post(POST_CHECKLIST_SAVE, TYPES, data)
}

export const getChecklist = id => {
  const TYPES = [
    GET_CHECKLIST + STATUSES.req,
    GET_CHECKLIST + STATUSES.suc,
    GET_CHECKLIST + STATUSES.err,
  ]
  return get(GET_CHECKLIST_SAVE + `${id}`, TYPES)
}

export const getChecklistCreate = id => {
  const TYPES = [
    GET_CHECKLIST_CREATE + STATUSES.req,
    GET_CHECKLIST_CREATE + STATUSES.suc,
    GET_CHECKLIST_CREATE + STATUSES.err,
  ]
  return get(GET_CHECKLIST_CREATE_ID + `${id}`, TYPES)
}

export const setBucketItemAndUpdate = data => {
  return dispatch => Promise.resolve(dispatch(setBucketData(data)))
    .then(() => {
      dispatch(getBucketData())
    })
}

export const deleteBucketItemAndUpdate = id => {
  return dispatch => Promise.resolve(dispatch(deleteBucketItem(id)))
    .then(() => {
      dispatch(getBucketData())
    })
}

export const clearFiltersAndUpdate = (reqParams) => {
  return dispatch => Promise.resolve(dispatch(clearFiltersOption()))
    .then(() => {
      dispatch(getData(reqParams))
    })
}
