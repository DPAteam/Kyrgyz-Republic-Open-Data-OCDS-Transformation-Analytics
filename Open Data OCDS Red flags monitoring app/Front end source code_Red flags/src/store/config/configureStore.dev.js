import { createStore, applyMiddleware } from 'redux'
import thunk                            from 'redux-thunk'
import { createLogger }                 from 'redux-logger'
import { apiMiddleware }                from 'redux-api-middleware'
import { routerMiddleware }             from 'react-router-redux'
import { composeWithDevTools }          from 'redux-devtools-extension'

import rootReducer from '../'


const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        thunk,
        apiMiddleware,
        routerMiddleware(),
        createLogger(),
      ),
    ),
  )

  if (module.hot) {
    module.hot.accept('../', () => {
      const nextRootReducer = require('../')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore
