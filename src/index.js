import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { auth } from 'firebase/app';
import 'firebase/auth';

import './index.css';
import './firebaseInitializer';
import App from './App';
import store from './store/store';
import * as serviceWorker from './serviceWorker';

auth().onAuthStateChanged(()=>{
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
