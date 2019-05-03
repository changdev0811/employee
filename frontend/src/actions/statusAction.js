import axios from 'axios';

import {
    UPDATE_STATUS_SUCCESS, GET_STATUS_SUCCESS
} from "../actions/types"

const API_URL = "http://localhost:5000";

export function getStatus(email) {
    return function(dispatch){
        axios
            .post(`${API_URL}/getStatus`, { email}, 
            { 
                headers: { 
                    'Content-type': 'application/json',
                    'Accept': 'application/json; charset=utf-8',
                } 
            })
            .then(res => {
                dispatch(getStatusSuccess(res.data.status));
            })
            .catch(err => {

            });
    }
}

export function getStatusSuccess(data){
    return {
        type: GET_STATUS_SUCCESS,
        payload: data
    };
}

export function updateStatus(email, status) {
    return function(dispatch){
        axios
            .post(`${API_URL}/updateStatus`, { email, status }, 
            { 
                headers: { 
                    // 'Content-type': 'application/json',
                    // 'Accept': 'application/json; charset=utf-8',
                } 
            })
            .then(res => {
                dispatch(updateStatusSuccess(res.data));
            })
            .catch(err => {

            });
    }
}

export function updateStatusSuccess(data){
    return {
        type: UPDATE_STATUS_SUCCESS,
        payload: data
    };
}