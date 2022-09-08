import React from 'react';
import { BrowserRouter as Router, } from 'react-router-dom';
import { StoreContext } from 'storeon/react';
import { createRoot } from 'react-dom/client';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

import 'mini.css/dist/mini-dark.min.css';
import 'react-tippy/dist/tippy.css'
import './index.css';
import App from './App';
import store from 'store';

TimeAgo.addDefaultLocale(en);
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <Router>
        <App />
      </Router>
    </StoreContext.Provider>
  </React.StrictMode>
);
