import { Base64 } from 'js-base64'
import * as AuthConstants from './constants'
import { STATUSES } from '../constants'
import _ from 'lodash'
import jwt_decode from 'jwt-decode'

const initialState = {
  isAuth: !!localStorage.getItem('_token'),
  isFetching: false,
  user: localStorage.getItem('_token') ? JSON.parse(Base64.decode(localStorage.getItem('_token').split('.')[1])) : {},
  userInfo: localStorage.getItem('_token') ? jwt_decode(localStorage.getItem('_token').split(' ')[1]) : {},
  error: null,
  registerUserData: {},
  sendEmailStatue: {},
  checkTokenStatus: {},
  setNewPasswordStatus: {},
}

const handleSignIn = token => {
  return {
    getUser: function () {
      const TOKEN = localStorage.getItem('_token')
      return JSON.parse(Base64.decode(TOKEN.split('.')[1]))
    },
    setToken: function () {
      localStorage.setItem('_token', token)
    },
  }
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case (AuthConstants.LOGIN + STATUSES.req):
      return {
        ...state,
        isAuth: false,
        userInfo: {},
        isFetching: true,
        error: null,
      }
    case (AuthConstants.LOGIN + STATUSES.suc):
      // handleSignIn(action.payload.token).setToken()

      handleSignIn(action.payload).setToken()
      return {
        ...state,
        user: handleSignIn(action.payload).getUser(),
        isAuth: true,
        userInfo: jwt_decode(action.payload.split(' ')[1]),
        isFetching: false,
      }
    case (AuthConstants.LOGIN + STATUSES.err):
      return {
        ...state,
        isFetching: false,
        isAuth: false,
        error: {
          // name: action.payload.error,
          // status: action.payload.status,
          // description: action.payload.message,
          name: action.payload.name,
          status: action.payload.status,
          description: action.payload.message,
        },
      }

    case (AuthConstants.GET_USERS + STATUSES.req):
      return {
        ...state,
        isFetching: true,
        error: null,
      }

    case (AuthConstants.GET_USERS + STATUSES.suc):
      return {
        ...state,
        isFetching: false,
        users: action.payload,
      }

    case (AuthConstants.GET_USERS + STATUSES.err):
      return {
        ...state,
        isFetching: false,
        error: {
          name: action.payload.error,
          status: action.payload.status,
          description: action.payload.message,
        },
      }

    case (AuthConstants.DELETE_USER + STATUSES.req):
      return {
        ...state,
        isFetching: true,
        error: null,
      }

    case (AuthConstants.DELETE_USER + STATUSES.suc):
      return {
        ...state,
        isFetching: false,
        // users: action.payload,
      }

    case (AuthConstants.DELETE_USER + STATUSES.err):
      return {
        ...state,
        isFetching: false,
        error: {
          name: action.payload.error,
          status: action.payload.status,
          description: action.payload.message,
        },
      }

    case (AuthConstants.CREATE_NEW_USER + STATUSES.req):
      return {
        ...state,
        isFetching: true,
        error: null,
      }

    case (AuthConstants.CREATE_NEW_USER + STATUSES.suc):
      return {
        ...state,
        isFetching: false,
        // users: action.payload,
      }

    case (AuthConstants.CREATE_NEW_USER + STATUSES.err):
      return {
        ...state,
        isFetching: false,
        error: {
          name: action.payload.error,
          status: action.payload.status,
          description: action.payload.message,
        },
      }

    case (AuthConstants.REGISTER_NEW_USER + STATUSES.req):
      return {
        ...state,
        isFetching: true,
        error: null,
      }

    case (AuthConstants.REGISTER_NEW_USER + STATUSES.suc):
      // handleSignIn(action.payload).setToken()
      return {
        ...state,
        // user: handleSignIn(action.payload.token).getUser(),
        // isAuth: true,
        isFetching: false,
        registerUserData: action.payload,
      }

    case (AuthConstants.REGISTER_NEW_USER + STATUSES.err):
      return {
        ...state,
        isFetching: false,
        error: {
          name: action.payload.error,
          status: action.payload.status,
          description: action.payload.message,
        },
      }

    case (AuthConstants.SEND_RESTORE_EMAIL + STATUSES.req):
      return {
        ...state,
        isFetching: true,
        error: null,
      }

    case (AuthConstants.SEND_RESTORE_EMAIL + STATUSES.suc):
      // handleSignIn(action.payload).setToken()
      return {
        ...state,
        // user: handleSignIn(action.payload.token).getUser(),
        // isAuth: true,
        isFetching: false,
        sendEmailStatue: action.payload,
      }

    case (AuthConstants.SEND_RESTORE_EMAIL + STATUSES.err):
      return {
        ...state,
        isFetching: false,
        error: {
          name: action.payload.error,
          status: action.payload.status,
          description: action.payload.message,
        },
      }

case (AuthConstants.CHECK_RESTORE_PASSWORD_TOKEN + STATUSES.req):
      return {
        ...state,
        isFetching: true,
        error: null,
      }

    case (AuthConstants.CHECK_RESTORE_PASSWORD_TOKEN + STATUSES.suc):
      // handleSignIn(action.payload).setToken()
      return {
        ...state,
        // user: handleSignIn(action.payload.token).getUser(),
        // isAuth: true,
        isFetching: false,
        checkTokenStatus: action.payload,
      }

    case (AuthConstants.CHECK_RESTORE_PASSWORD_TOKEN + STATUSES.err):
      return {
        ...state,
        isFetching: false,
        error: {
          name: action.payload.error,
          status: action.payload.status,
          description: action.payload.response.message,
        },
      }

case (AuthConstants.SAVE_NEW_PASSWORD + STATUSES.req):
      return {
        ...state,
        isFetching: true,
        error: null,
      }

    case (AuthConstants.SAVE_NEW_PASSWORD + STATUSES.suc):
      // handleSignIn(action.payload).setToken()
      return {
        ...state,
        // user: handleSignIn(action.payload.token).getUser(),
        // isAuth: true,
        isFetching: false,
        setNewPasswordStatus: action.payload,
      }

    case (AuthConstants.SAVE_NEW_PASSWORD + STATUSES.err):
      return {
        ...state,
        isFetching: false,
        error: {
          name: action.payload.error,
          status: action.payload.status,
          description: action.payload.message,
        },
      }

    case (AuthConstants.LOGOUT + STATUSES.suc):
      localStorage.removeItem('_token')
      return {
        ...state,
        isAuth: false,
      }

    case (AuthConstants.SET_USER_JWT + STATUSES.chenge):
      handleSignIn(action.token).setToken()
      return {
        ...state,
        user: handleSignIn(action.token).getUser(),
        isAuth: true,
        isFetching: false,
      }

    default:
      return state
  }
}

export default auth
