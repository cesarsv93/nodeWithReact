import { combineReducers } from 'redux';
import authReducer from './authReducer';
import { reducer as formReducer } from 'redux-form';
import surveysReducer from './surveysReducer'

export default combineReducers({
  auth: authReducer,
  form: formReducer, //Key has to be form, it is not optional. But it can be changed.
  surveys: surveysReducer
});