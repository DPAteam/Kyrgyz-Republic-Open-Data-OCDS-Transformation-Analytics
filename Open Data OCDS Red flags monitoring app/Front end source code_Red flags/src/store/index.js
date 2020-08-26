import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import auth from './auth/reducer'
import monitoring from './monitoring/reducer'
import navigationStore from './navigation/reducer'
import { localeReducer } from './locale/LocaleReducer'


export default combineReducers({
  locale: localeReducer,
  routing: routerReducer,
  auth,
  monitoring,
  navigationStore,
})
