import React, {Component, useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import axios from "axios";


function MenuTop (props) {
    useEffect(async () => {
        await getUser()
    }, [])

    const getUser = async () => {
        if (props.myUser.auth) return;

        try {
            let result = await axios.get(`/api/account/get`);

            if (result.data && result.data.response) {
                let response = result.data.response;
                props.login(response._id, response.login);
            }

        } catch (err) {
        }
    }

    const logout = (event) => {
        //event.preventDefault();
        props.logout();
        props.history.replace('/');
    }

    const UserButton = () => {
        return <form className="d-flex">
            <ul className="navbar-nav">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
                       role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {props.myUser.login}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-right"
                        aria-labelledby="navbarDropdownMenuLink">
                        <li><Link className="dropdown-item" to={`/user/${props.myUser.id}`}>Моя страница</Link></li>
                        <li><Link className="dropdown-item" to="/settings">Настройки</Link></li>
                        <div className="dropdown-divider"/>
                        <li><Link className="dropdown-item" to="#" onClick={logout}>Выход</Link></li>
                    </ul>
                </li>
            </ul>
        </form>
    }

    const AuthRegButton = () => {
        return <form className="d-flex">
            <ul className="navbar-nav">

                <li className="nav-item">
                    <Link className="nav-link active" to="/auth">Вход</Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to="/reg">Регистрация</Link>
                </li>

            </ul>
        </form>
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">ВоенСеть</Link>

                <div className="collapse navbar-collapse" id="navbarMenuTop">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Главная</Link>
                        </li>
                    </ul>
                </div>

                {(props.myUser.auth) ? UserButton() : AuthRegButton()}

            </div>
        </nav>

    )

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
)(MenuTop);