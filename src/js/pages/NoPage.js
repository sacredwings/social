import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import ElementVideo from "../elements/Video";
import ElementTopic from "../elements/Topic";
import ElementBlog from "../elements/Blog";

class NoPage extends Component {
    constructor () {
        super();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        Нет такой страницы
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
)(NoPage);

