import * as NAV from './NavConstants'


const initialNavState = {
  location: null,
  current: null,
  selectedCardData: [],
  defaultRoute: '',
}

export default (state = initialNavState, action) => {
  switch (action.type) {
    case NAV.CHANGE_LOCATION:
      return {
        ...state,
        location: action.location,
        current: action.current,
      }
    case NAV.SET_CURRENT_LOCATION: {
      return {
        ...state,
        current: action.current,
      }
    }

    case NAV.SET_CARD_DATA:
      return {
        ...state,
        selectedCardData: action.selectedCardData,
      }

    case NAV.SET_CURRENT_ROUTE:
      return {
        ...state,
        defaultRoute: action.current,
      }

    default:
      return state
  }
}
