import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import * as serviceWorker from './serviceWorker';
import App from './App';

ReactDOM.render((
  <BrowserRouter>
    <Auth0Provider
      domain="dev-pomwe-m8.us.auth0.com"
      clientId="miljlZt93f1F30WDEvyWoWXlJ29vy30F"
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>
), document.getElementById('root'));

serviceWorker.unregister();
