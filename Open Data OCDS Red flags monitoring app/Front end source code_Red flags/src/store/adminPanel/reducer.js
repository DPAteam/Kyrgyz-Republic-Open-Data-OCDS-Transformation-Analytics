import {
  OPEN_ADMIN_PANEL,
  CLOSE_ADMIN_PANEL,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_HASERROR,
  DELETE_CURRENT_USER_REQUEST,
  DELETE_CURRENT_USER_HASERROR,
  SAVE_USERS_CHANGES_REQUEST,
  SAVE_USERS_CHANGES_HASERROR
} from "./constants";

const initialState = {
  adminPanelIsOpen: false,
  isLoading: false,
  success: false,
  deleteUserSuccess: false,
  saveUserSuccess: false,
  hasError: false,
  deleteUserError: false,
  saveUserError: false,
  users: null
};

const adminPanel = (state = initialState, action) => {
  const { type, usersData } = action;

  switch (type) {
    case OPEN_ADMIN_PANEL:
      return {
        ...state,
        adminPanelIsOpen: true
      };

    case CLOSE_ADMIN_PANEL:
      return {
        ...state,
        adminPanelIsOpen: false
      };

    case GET_ALL_USERS_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasError: false
      };

    case GET_ALL_USERS_HASERROR:
      return {
        ...state,
        isLoading: false,
        hasError: true,
        success: false
      };

    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasError: false,
        success: true,
        users: usersData
      };

    case DELETE_CURRENT_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasError: false
      };

    case DELETE_CURRENT_USER_HASERROR:
      return {
        ...state,
        isLoading: false,
        deleteUserError: true,
        deleteUserSuccess: false
      };

    case SAVE_USERS_CHANGES_REQUEST:
      return {
        ...state,
        isLoading: true,
        saveUserError: false
      };

    case SAVE_USERS_CHANGES_HASERROR:
      return {
        ...state,
        isLoading: false,
        saveUserError: true,
        saveUserSuccess: false
      };

    default:
      return state;
  }
};

export default adminPanel;
