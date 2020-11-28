import React from 'react';
import ReactDOM from 'react-dom';
import { StoreContext } from 'storeon/react';

import 'mini.css/dist/mini-dark.min.css';
import './index.css';
import App from './App';
import store from 'store';

store.dispatch('bootstrap');

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
