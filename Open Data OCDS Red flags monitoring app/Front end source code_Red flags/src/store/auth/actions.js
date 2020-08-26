import {
  signin,
  get,
  del,
  put,
  registerUser,
  getWithoutToken,
  postWithoutToken,
} from '../../api/utils'
import { STATUSES } from '../constants'
import * as AuthConstants from './constants'
import * as API from '../../api/constants'
import { TYPE_OF_VALUES } from '../monitoring/constants'


export const setUserJWT = token => {
  return {
    type: AuthConstants.SET_USER_JWT + STATUSES.chenge,
    token: token,
  }
}

export const userLogin = (data) => {
  const types = [
    AuthConstants.LOGIN + STATUSES.req,
    AuthConstants.LOGIN + STATUSES.suc,
    AuthConstants.LOGIN + STATUSES.err,
  ]
  return signin(types, data)
}

export const userLogout = () => {
  return { type: AuthConstants.LOGOUT + STATUSES.suc }
}

export const getUsers = () => {
  const types = [
    AuthConstants.GET_USERS + STATUSES.req,
    AuthConstants.GET_USERS + STATUSES.suc,
    AuthConstants.GET_USERS + STATUSES.err,
  ]
  return get(API.GET_USERS_LIST, types)
}

export const deleteUser = id => {
  const types = [
    AuthConstants.DELETE_USER + STATUSES.req,
    AuthConstants.DELETE_USER + STATUSES.suc,
    AuthConstants.DELETE_USER + STATUSES.err,
  ]
  return del(API.DELETE_USER_BY_ID, types, id)
}

export const deleteUserById = id => {
  return dispatch => Promise.resolve(dispatch(deleteUser(id)))
    .then(() => {
      dispatch(getUsers())
    })
}

export const createNewUser = user => {
  const types = [
    AuthConstants.CREATE_NEW_USER + STATUSES.req,
    AuthConstants.CREATE_NEW_USER + STATUSES.suc,
    AuthConstants.CREATE_NEW_USER + STATUSES.err,
  ]
  return put(API.CREATE_USER, types, user)
}

export const registrationNewUser = user => {
  const types = [
    AuthConstants.REGISTER_NEW_USER + STATUSES.req,
    AuthConstants.REGISTER_NEW_USER + STATUSES.suc,
    AuthConstants.REGISTER_NEW_USER + STATUSES.err,
  ]
  return registerUser(API.USER_REGISTRATION_API, types, user)
}

export const resetSendEmail = user => {
  const types = [
    AuthConstants.SEND_RESTORE_EMAIL + STATUSES.req,
    AuthConstants.SEND_RESTORE_EMAIL + STATUSES.suc,
    AuthConstants.SEND_RESTORE_EMAIL + STATUSES.err,
  ]
  // return getWithoutToken(API.SEND_RESTORE_EMAIL_API, types, user)
  return postWithoutToken(API.SEND_RESTORE_EMAIL_API, types, user)
}

export const resetCheckToken = user => {
  const types = [
    AuthConstants.CHECK_RESTORE_PASSWORD_TOKEN + STATUSES.req,
    AuthConstants.CHECK_RESTORE_PASSWORD_TOKEN + STATUSES.suc,
    AuthConstants.CHECK_RESTORE_PASSWORD_TOKEN + STATUSES.err,
  ]
  return getWithoutToken(API.CHECK_RESTORE_PASSWORD_TOKEN_API, types, user)
}

export const resetSaveNewPass = user => {
  const types = [
    AuthConstants.SAVE_NEW_PASSWORD + STATUSES.req,
    AuthConstants.SAVE_NEW_PASSWORD + STATUSES.suc,
    AuthConstants.SAVE_NEW_PASSWORD + STATUSES.err,
  ]
  return postWithoutToken(API.SAVE_NEW_PASSWORD_API, types, user)
}

export const createUser = user => {
  return dispatch => Promise.resolve(dispatch(createNewUser(user)))
    .then(() => {
      dispatch(getUsers())
    })
}

