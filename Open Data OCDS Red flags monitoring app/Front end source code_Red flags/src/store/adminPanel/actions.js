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

import {
  API_URL,
  GET_ALL_USERS,
  DELETE_CURRENT_USER,
  SAVE_USERS_CHANGES
} from "../../api/constants";

export const setAdminPanelActive = () => {
  return {
    type: OPEN_ADMIN_PANEL
  };
};

export const setAdminPanelDisactive = () => {
  return {
    type: CLOSE_ADMIN_PANEL
  };
};

export const getAllUsers = () => {
  const _token = localStorage.getItem("_token");
  return async dispatch => {
    dispatch({ type: GET_ALL_USERS_REQUEST });

    let usersData = null;

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: _token
      }
    };
    console.log({
      _token
    })
    try {
      const response = await fetch(
        `${API_URL}${GET_ALL_USERS}`,
        requestOptions
      );
      const result = await response.json();
      usersData = result;
    } catch (error) {
      console.error("Error fetching users data from the server", error);
    }

    if (!usersData) {
      dispatch({ type: GET_ALL_USERS_HASERROR });
    }

    return dispatch({
      type: GET_ALL_USERS_SUCCESS,
      usersData
    });
  };
};

export const deleteCurrentUser = id => {
  const _token = localStorage.getItem("_token");
  return async dispatch => {
    dispatch({ type: DELETE_CURRENT_USER_REQUEST });

    let usersData = null;

    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_token}`
      }
    };

    try {
      const response = await fetch(
        `${API_URL}${DELETE_CURRENT_USER}${id}`,
        requestOptions
      );
      const result = await response.json();
      usersData = result;
    } catch (error) {
      console.error("Error fetching users data from the server", error);
    }

    if (!usersData) {
      dispatch({ type: DELETE_CURRENT_USER_HASERROR });
    }
  };
};

export const saveUsersChanges = users => {
  const _token = localStorage.getItem("_token");
  return async dispatch => {
    dispatch({ type: SAVE_USERS_CHANGES_REQUEST });

    let usersData = null;

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_token}`
      },
      body: JSON.stringify(users)
    };

    try {
      const response = await fetch(
        `${API_URL}${SAVE_USERS_CHANGES}`,
        requestOptions
      );
      const result = await response.json();
      usersData = result;
    } catch (error) {
      console.error("Error fetching users data from the server", error);
    }

    if (!usersData) {
      dispatch({ type: SAVE_USERS_CHANGES_HASERROR });
    }
  };
};
