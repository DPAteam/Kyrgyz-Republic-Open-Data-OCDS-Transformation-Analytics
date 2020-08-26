import React from 'react'
import { Route, Switch } from 'react-router'
import connect from 'react-redux/es/connect/connect'
import _ from 'lodash'
import NotAuthorized from '../components/error/403/NotAuthorized'

import Public from '../containers/public'
import Private from '../containers/private'
import ListComponent from '../containers/list'
import AdminPanel from '../containers/administration/adminPanel'
import { bindActionCreators } from 'redux'
import { setUserJWT } from '../store/auth/actions'
import ResetPage from '../components/forms/reset/ResetPage'


const Routes = props => {
  if (window.location.pathname === '/reset-password') {
    let preparedSearch = {}
    _.forEach(window.location.search.substring(1).split('&'), (searchItem) => {
      preparedSearch = _.merge({}, preparedSearch, {
        [searchItem.split('=')[0]]: searchItem.split('=')[1],
      })
    })
    preparedSearch = _.merge({}, preparedSearch, { ...props })
    return <ResetPage {...preparedSearch} />
  }

  if (window.location.search.match('jwt')) {
    let token = window.location.search.split('jwt=')[1]
    localStorage.setItem('_token', 'Bearer ' + token)
    Promise.resolve(props.setUserJWT('Bearer ' + token)).then(() => {
      // window.history.pushState({}, document.title, '/')
      window.location.replace('/')
    })
  }

  return <Switch>
    <Route exact path="/" component={props.isAuth ? Private : Public} />
    <Route exact path="/list" component={props.isAuth ? ListComponent : Public} />
    {/*{_.includes(props.userInfo.permissions, 'admin.base') ? <Route exact path="/administration" component={AdminPanel} /> :*/}
    {/*  <div style={{ width: '100%' }}><NotAuthorized /></div>}*/}
  </Switch>
}

const mapStateToProps = ({ auth }) => {
  return {
    isAuth: auth.isAuth,
    userInfo: auth.userInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserJWT: bindActionCreators(setUserJWT, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)
