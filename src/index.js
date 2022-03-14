import React from 'react';
import { render } from "react-dom";
import { Provider } from 'react-redux'

//
//import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
//import "font-awesome-sass/assets/stylesheets/_font-awesome.scss";
import 'fontawesome-free/css/all.min.css'

//react-redux.js.org
import store from './js/store'

import App from './js/App';
import * as serviceWorker from './serviceWorker';

import {IO} from "./js/util/websocket";
IO.socket = IO()
IO.socket.Message()

const rootElement = document.getElementById('root');
render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
