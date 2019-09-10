import { createStore, combineReducers } from 'redux';

import snackBarReducer from './reducers/snackBar';
import profileReducer from './reducers/profile';
import arraysReducer from './reducers/arrays';
import objectsReducer from './reducers/objects';

export default createStore(combineReducers({
  snackBar: snackBarReducer,
  profile: profileReducer,
  reqArrays: arraysReducer,
  reqObjects: objectsReducer
}));