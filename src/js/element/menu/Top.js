import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import axios from "axios";

class WidgetTopMenu extends Component {
    constructor (props) {
        super(props);

        this.getUser = this.getUser.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.getUser();
    }

    componentDidUpdate(prevProps) {
        // Выполнен вход
        if (!prevProps.myUser.auth && this.props.myUser.auth)
            this.getUser();
    }

    async getUser() {
        if (this.props.myUser.auth) return;

        try {
            let result = await axios.get('/api/account/get');

            if (result.data && result.data.response) {
                let response = result.data.response;
                this.props.login(response.id, response.login);
            }

        } catch (err) {
        }
    }

    logout(event) {
        event.preventDefault();
        this.props.logout();
        this.props.history.replace('/');
    }

    render() {
        let avatar = {
            height: '25px'
        };

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">ВоеннаяСоцСеть</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
                            {(this.props.myUser.auth) ?
                                null : null}
                            {(this.props.myUser.auth) ?
                                <ul className={"navbar-nav ml-auto"}>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {this.props.myUser.login}
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                            <Link className="dropdown-item" to={`/user/id${this.props.myUser.id}`}>Моя страница</Link>
                                            <Link className="dropdown-item" to="/settings">Настройки</Link>
                                            <div className="dropdown-divider"/>
                                            <a className="dropdown-item" href="#" onClick={this.logout}>Выход</a>
                                        </div>
                                    </li>
                                </ul>
                                :
                                <ul className="navbar-nav ml-auto">
                                    <li className="nav-item">

                                        <Link className="nav-link" to="/reg">Регистрация</Link>

                                    </li>
                                    <Link className="btn btn-primary" to='/auth'>Войти</Link>
                                </ul>
                            }
                        </ul>

                    </div>
                </div>
            </nav>

        )
    }

}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({
        login: (id, login) => {
            dispatch({type: 'USER_LOGIN', id: id, login: login});
        },
        logout: () => {
            dispatch({type: 'USER_LOGOUT'});
        }
    })
)(withRouter(WidgetTopMenu));