import axios from 'axios';

import {
    GET_EMPLOYEE_SUCCESS
} from "../actions/types"

const API_URL = "http://localhost:5000";

export function getEmployee(email, status) {
    return function(dispatch){
        axios
            .post(`${API_URL}/getEmployee`, { email, status }, 
            { 
                headers: { 
                    'Content-type': 'application/json',
                    'Accept': 'application/json; charset=utf-8',
                } 
            })
            .then(res => {
                dispatch(getEmployeeSuccess(res.data.employees));
            })
            .catch(err => {

            });
    }
}

export function getEmployeeSuccess(data){
    return {
        type: GET_EMPLOYEE_SUCCESS,
        payload: data
    };
}