import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { LocaleProvider } from 'antd'
import ReduxIntlProvider from './reduxIntlProvider'
import uk_UA from 'antd/lib/locale-provider/uk_UA'
import moment from 'moment'
import 'moment/locale/uk'
import { initLocale } from './utils/locale/LocaleUtil'

import configureStore from './store/config/configureStore'
import * as serviceWorker from './serviceWorker'

import Routes from './routes'

import './index.scss'
import 'antd/dist/antd.css'
import 'bootstrap/dist/css/bootstrap-grid.css'

// moment.locale('uk')

const history = createBrowserHistory()
const store = configureStore()

initLocale()

render(
  // <LocaleProvider locale={uk_UA}>
    <Provider store={store}>
      <ReduxIntlProvider>
        <Router history={history}>
          <Routes />
        </Router>
      </ReduxIntlProvider>
    </Provider>,
  // </LocaleProvider>,
  document.getElementById('root'),
)
serviceWorker.unregister()
