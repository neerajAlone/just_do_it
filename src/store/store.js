import { createStore, combineReducers } from 'redux';

import snackBarReducer from './reducers/snackBar';
import profileReducer from './reducers/profile';
import userAdminsReducer from './reducers/userAdmins';

export default createStore(combineReducers({
  snackBar: snackBarReducer,
  profile: profileReducer,
  aUserAdmins: userAdminsReducer
}));