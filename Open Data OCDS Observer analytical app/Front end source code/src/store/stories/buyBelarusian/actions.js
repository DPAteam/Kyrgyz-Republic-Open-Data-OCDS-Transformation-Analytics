import { get }   from '../../../utils/api/apiUtils'
import * as API  from '../../../utils/api/apiConstants'
import * as TYPE from './constant'


export const getBuyKyrgyzstanData = (year) => {
  const TYPES = [
    TYPE.GET_BUY_KYRGYZSTAN_DATA_REQUEST,
    TYPE.GET_BUY_KYRGYZSTAN_DATA_SUCCESS,
    TYPE.GET_BUY_KYRGYZSTAN_DATA_FAILURE,
  ]
  return get(`${API.BUY_KYRGYZSTAN_DATA_API_URI}?year=${year}`, TYPES)
}

export const getProductCountriesContractItemsAmount = (reqParams) => {
  const TYPES = [
    TYPE.GET_PRODUCT_COUNTRIES_CONTRACT_ITEMS_AMOUNT_REQUEST,
    TYPE.GET_PRODUCT_COUNTRIES_CONTRACT_ITEMS_AMOUNT_SUCCESS,
    TYPE.GET_PRODUCT_COUNTRIES_CONTRACT_ITEMS_AMOUNT_FAILURE,
  ]
  return get(API.GET_PRODUCT_COUNTRIES_CONTRACT_ITEMS_AMOUNT, TYPES, reqParams)
}

export const getCountriesOkrbTopAmount = (reqParams) => {
  const TYPES = [
    TYPE.GET_COUNTRIES_OKRB_TOP_AMOUNT_REQUEST,
    TYPE.GET_COUNTRIES_OKRB_TOP_AMOUNT_SUCCESS,
    TYPE.GET_COUNTRIES_OKRB_TOP_AMOUNT_FAILURE,
  ]
  return get(API.GET_COUNTRIES_OKRB_TOP_AMOUNT, TYPES, reqParams)
}

export const getBelarusProductsShare = (reqParams) => {
  const TYPES = [
    TYPE.GET_BELARUS_PRODUCTS_SHARE_REQUEST,
    TYPE.GET_BELARUS_PRODUCTS_SHARE_SUCCESS,
    TYPE.GET_BELARUS_PRODUCTS_SHARE_FAILURE,
  ]
  return get(API.GET_BELARUS_PRODUCTS_SHARE, TYPES, reqParams)
}
