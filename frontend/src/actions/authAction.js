import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {
    SET_CURRENT_USER
} from "../actions/types"

const API_URL = "http://localhost:5000";

export function login(email) {
    return function(dispatch){
        axios
            .post(`${API_URL}/login`, { email }, 
            { 
                headers: { 
                    'Content-type': 'application/json',
                    'Accept': 'application/json; charset=utf-8',
                } 
            })
            .then(res => {
                // Save to localStorage
                const { token } = res.data;
                // Set token to ls
                localStorage.setItem("jwtToken",token);
                // Set token to Auth header
                setAuthToken(token);
                // Decode token to get user data
                const decoded = jwt_decode(token);
                // Set current user
                dispatch(setCurrentUser(decoded));
            })
            .catch(err => {

            });
    }
}

export function setCurrentUser(decoded){
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
}

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
  };