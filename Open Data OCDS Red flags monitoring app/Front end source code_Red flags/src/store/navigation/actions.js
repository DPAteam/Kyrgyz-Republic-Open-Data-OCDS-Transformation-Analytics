import * as NavigationConstants from './constants'
// import { STATUSES } from '../constants'


//////////////////////////////
export const changeLocation = (location, current) => {
  return dispatch => dispatch({type: NavigationConstants.CHANGE_LOCATION, location, current})
}

// export const setCurrentLocation = current => {
//   return dispatch => dispatch({type: NAV.SET_CURRENT_LOCATION, current})
// }
/////////////////////////////

export function changeNavigationItem(navItemKey) {
  return {
    type: NavigationConstants.CHANGE_NAVIGATION_KEY,
    data: navItemKey,
  }
  // return (dispatch) => dispatch({
  //   type: NavigationConstants.CHANGE_NAVIGATION_KEY,
  //   data: navItemKey,
  // })
}