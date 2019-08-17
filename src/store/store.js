import { createStore, combineReducers } from 'redux';

import snackBarReducer from './reducers/snackBar';
import profileReducer from './reducers/profile';
import arraysReducer from './reducers/arrays';

export default createStore(combineReducers({
  snackBar: snackBarReducer,
  profile: profileReducer,
  reqArrays: arraysReducer
}));