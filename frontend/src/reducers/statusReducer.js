import {
    UPDATE_STATUS_SUCCESS, GET_STATUS_SUCCESS
  } from "../actions/types";
  
  const initialState = { status: "" };
  
  export default function (state = initialState, action) {
    switch (action.type) {
      case UPDATE_STATUS_SUCCESS:
        return {
          ...state,
          ...action.payload
        };
      case GET_STATUS_SUCCESS:
        return {
          status: action.payload
        }
      default:
        return state;
    }
  }