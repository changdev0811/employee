import {
    GET_EMPLOYEE_SUCCESS
  } from "../actions/types";
  
  const initialState = { employees: [] };
  
  export default function (state = initialState, action) {
    switch (action.type) {
      case GET_EMPLOYEE_SUCCESS:
        return {
          employees: action.payload
        }
      default:
        return state;
    }
  }
    