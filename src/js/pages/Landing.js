import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {Link} from "react-router-dom";
import cookie from '../utils/cookie';
import YandexShare from '../elements/YandexShare';


class Landing extends Component {
    constructor () {
        super();

    }

    async componentDidMount () {
        if (this.props.match.params.ref)
            cookie.set('ref=' + this.props.match.params.ref, false);
    }

    render() {
        return (
            <div className="landing">
                <div id="height">
                    <div className="container">
                        <br/>
                        <br/>
                        <div className="row text-center">
                            <div className="col-lg-12">
                                <img src={`/logo_big.png`} style={{maxWidth: '100px'}}/>
                                <br/>
                                <button type="button" className="btn btn-light">💵 ..поддержи проэкт.. 💵</button>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col-lg-12">
                                <h1 className="">Социальная сеть для военнослужащих</h1>
                                <br/>
                                <p>Исключительно для военных</p>
                                <p>Создавайте и учавствуйте в обсуждениях</p>
                                <p>Бесплатно</p>
                                <p>Анонимно</p>
                            </div>

                        </div>

                        <div className="row text-center">
                            <div className="col-lg-12">
                                <span className="badge bg-warning text-dark">Запуск сети в течении 2 недель</span>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        )
    }

}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({
        Store_myUser: (login, tokenId, tokenKey, remember) => {
            dispatch({type: 'AUTH', login: login, tokenId: tokenId, tokenKey: tokenKey, remember: remember});
        }
    })
)(Landing);

