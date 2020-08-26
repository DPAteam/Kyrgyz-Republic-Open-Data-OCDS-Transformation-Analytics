import { RSAA, getJSON } from 'redux-api-middleware'
import { SUGN_IN, URL, API_URL, LOGIN_URL } from './constants'
import _ from 'lodash'

const logOut = () => {
  localStorage.removeItem('_token')
  window.location.reload(true)
}

const handleErrors = (data, state, res) => {
  if (res.status === 403) {
    localStorage.removeItem('_token')
    window.location.reload(true)
  }
}

const toQueryString = obj => {
  if (_.isEmpty(obj)) return ''
  const parts = []
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]))
    }
  }
  return parts.join('&')
}

export const signin = (types, credentials) => {
  return {
    [RSAA]: {
      // endpoint: URL + SUGN_IN,
      endpoint: API_URL + LOGIN_URL,
      // headers: { 'Content-Type': 'application/json',  },
      method: 'POST',
      body: JSON.stringify(credentials),
      types: types.map((type) => {
        // if(type.match(/ERROR/g)) {
        //   return {
        //     type: type,
        //     payload: handleErrors,
        //   }
        // } else
        if (type.match(/SUCCESS/g)) {
          return {
            type: type,
            payload: (action, state, res) => {
              return res.headers.get('Authorization')
              // const contentType = res.headers.get('Content-Type')
              // if (contentType && ~contentType.indexOf('json')) {
              //   // Just making sure res.json() does not raise an error
              //   return res.json().then(json => normalize(json, { users: arrayOf(userSchema) }));
              // }
            },
          }
        } else {
          return type
        }
      }),
    },
  }
}

export const fileFetch = (path, types, data) => {
  const token = localStorage.getItem('_token')
  return {
    [RSAA]: {
      // endpoint: URL + path,
      endpoint: API_URL + path,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      options: {
        responseType: 'arraybuffer',
      },
      method: 'POST',
      body: JSON.stringify(data) || {},
      types: types.map((type) => {
        if (typeof type !== 'object') {
          return type.match(/ERROR/g) ? {
            type: type,
            payload: handleErrors,
          } : type
        } else
          return type
      }),
    },
  }
}

export const post = (path, types, data) => {
  const token = localStorage.getItem('_token')
  return {
    [RSAA]: {
      // endpoint: URL + path,
      endpoint: API_URL + path,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      method: 'POST',
      body: JSON.stringify(data) || {},
      types: types.map((type) => {
        if (type.match(/ERROR/g)) {
          return {
            type: type,
            payload: (action, state, res) => {
              if (res.status === 403) {
                localStorage.removeItem('_token')
                window.location.reload(true)
              } else {
                return getJSON(res).then(function (json) {
                  return json
                })
              }
            },
          }
        } else {
          return type
        }
      }),
    },
  }
}

export const put = (path, types, data) => {
  const token = localStorage.getItem('_token')
  return {
    [RSAA]: {
      // endpoint: URL + path,
      endpoint: API_URL + path,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      method: 'PUT',
      body: JSON.stringify(data) || {},
      types: types.map((type) => {
        if (type.match(/ERROR/g)) {
          return {
            type: type,
            payload: (action, state, res) => {
              if (res.status === 403) {
                localStorage.removeItem('_token')
                window.location.reload(true)
              } else {
                return getJSON(res).then(function (json) {
                  return json
                })
              }
            },
          }
        } else {
          return type
        }
      }),
    },
  }
}

export const registerUser = (path, types, data) => {
  return {
    [RSAA]: {
      // endpoint: URL + path,
      endpoint: API_URL + path,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(data) || {},
      types: types,
    },
  }
}

export const del = (path, types, id) => {
  const token = localStorage.getItem('_token')
  return {
    [RSAA]: {
      // endpoint: URL + path + '/' + id,
      endpoint: API_URL + path + '/' + id,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      method: 'DELETE',
      types: types.map((type) => {
        if (type.match(/ERROR/g)) {
          return {
            type: type,
            payload: (action, state, res) => {
              if (res.status === 403) {
                localStorage.removeItem('_token')
                window.location.reload(true)
              } else {
                return getJSON(res).then(function (json) {
                  return json
                })
              }
            },
          }
        } else {
          return type
        }
      }),
    },
  }
}

export const delS = (path, types, body) => {
  const token = localStorage.getItem('_token')
  return {
    [RSAA]: {
      // endpoint: URL + path,
      endpoint: API_URL + path,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      method: 'DELETE',
      body: JSON.stringify(body) || {},
      types: types.map((type) => {
        if (type.match(/ERROR/g)) {
          return {
            type: type,
            payload: (action, state, res) => {
              if (res.status === 403) {
                localStorage.removeItem('_token')
                window.location.reload(true)
              } else {
                return getJSON(res).then(function (json) {
                  return json
                })
              }
            },
          }
        } else {
          return type
        }
      }),
    },
  }
}

export const get = (path, types, reqData, useURL = true) => {
  const token = localStorage.getItem('_token')
  let requestData = toQueryString(reqData)
  return {
    [RSAA]: {
      // endpoint: _.startsWith(path, "http://")
      //   ? path
      //   : URL + path + (reqData ? `?${requestData}` : ''),
      // endpoint: URL + path + (reqData ? `?${requestData}` : ''),
      // endpoint: (useURL ? URL + path : path) + (reqData ? `?${requestData}` : ''),
      endpoint: (useURL ? API_URL + path : path) + (reqData ? `?${requestData}` : ''),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      method: 'GET',
      types: types.map((type) => {
        if (type.match(/ERROR/g)) {
          return {
            type: type,
            payload: (action, state, res) => {
              if (res.status === 403) {
                localStorage.removeItem('_token')
                window.location.reload(true)
              } else {
                return getJSON(res).then(function (json) {
                  return json
                })
              }
            },
          }
        } else {
          return type
        }
      }),
    },
  }
}

export const getWithoutToken = (path, types, reqData, useURL = true) => {
  let requestData = toQueryString(reqData)
  return {
    [RSAA]: {
      endpoint: (useURL ? API_URL + path : path) + (reqData ? `?${requestData}` : ''),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      types: types
    },
  }
}

export const postWithoutToken = (path, types, reqData, useURL = true) => {
  let requestData = toQueryString(reqData)
  return {
    [RSAA]: {
      endpoint: API_URL + path,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(reqData) || {},
      types: types
    },
  }
}
