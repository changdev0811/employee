import { combineReducers } from 'redux';
import authReducer from './authReducer';
import employeeReducer from './employeeReducer';
import statusReducer from './statusReducer';

export default combineReducers({
  auth: authReducer,
  employees: employeeReducer,
  status: statusReducer,
});
