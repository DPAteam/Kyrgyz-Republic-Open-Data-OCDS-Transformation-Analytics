import * as NavigationConstants from './constants'

const initialState = {
  menuSelectedKey: '1',
  location: null,
  current: null,
}

const navigationStore = (state = initialState, action) => {
  switch (action.type) {
    case NavigationConstants.CHANGE_NAVIGATION_KEY:
      return {
        ...state,
        menuSelectedKey: action.data,
      }
    case NavigationConstants.CHANGE_LOCATION:
      return {
        ...state,
        location: action.location,
        current: action.current,
      }
    default:
      return state
  }
}

export default navigationStore
