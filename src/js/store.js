//СОСТОЯНИЕ ПРИЛОЖЕНИЯ
import { createStore, combineReducers } from 'redux';
import cookie from './utils/cookie';

//Глобальные переменные
global.gappkey = '6LceBPYZAAAAAJQ-wFlu66sLEQy2aFLupYqa4k7o' /* reCaptcha */
global.urlServer = window.location.origin
if (window.location.hostname === 'localhost')
    global.urlServer = `${window.location.protocol}//localhost:${window.location.port}`

//Состояние приложения
const stateApp = {

};

function app (state = stateApp, action) {

    //Обязан вернуть состояние
    return state;
}

//Активный пользователь
const stateMyUser = {
    id: null,
    auth: false,
    login: 'unknown',
    tokenId: null,
    tokenKey: null
};

function myUser (state = stateMyUser, action) {
    switch (action.type) {

        /*
        case '@@INIT':
            if (cookie.get('tid') && cookie.get('token') && ((cookie.get('tid') !== 'undefined') && (cookie.get('token') !== 'undefined')))
                return {
                    ...state,
                    auth: true
                };
            return state;
        */

        case 'AUTH':
            cookie.set('tid=' + action.tokenId, !action.remember);
            cookie.set('token=' + action.tokenKey, !action.remember);

            return {
                ...state,
                auth: true,
                id: action.id,
                login: action.login,
                tokenId: action.tokenId,
                tokenKey: action.tokenKey
            };

        case 'USER_LOGIN':
            return {
                ...state,
                auth: true,
                id: action.id,
                login: action.login
            };

        case 'SET_PHONE':
            return {
                ...state,
                has_phone: action.has_phone
            };

        case 'USER_LOGOUT':
            cookie.clear('tid');
            cookie.clear('token');

            return {
                ...state,
                tokenId: null,
                tokenKey: null,
                has_phone: false,
                auth: false,
            };

        case 'WALLET_UPDATE':
            return {
                ...state,
                wallet: action.wallet
            };

        default:
            return state;
    }
}

const reducers = combineReducers({app, myUser});
const store = createStore( reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() );

export default store;