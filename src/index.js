import React from 'react';
import ReactDOM from 'react-dom';

//react-redux.js.org
import { Provider } from 'react-redux'
import store from './js/store'

import App from './js/App';
import * as serviceWorker from './serviceWorker';

import io from "./js/util/websocket";
io.socket = io()

const rootElement = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
