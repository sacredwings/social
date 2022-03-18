import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import axios from "axios";
import {reCaptchaExecute} from 'recaptcha-v3-react-function-async';


//https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=%D0%9B%D0%9E%D0%93%D0%98%D0%9D&password=%D0%9F%D0%90%D0%A0%D0%9E%D0%9B%D0%AC&captcha_key=q24yud&captcha_sid=656412648896

function Auth (props) {
    let [form, setForm] = useState({
        profileLogin: '',
        profilePassword: '',
        info: null,
        remember: false
    })

    const onClickAuth = async (event) => {
        event.preventDefault();

        let gtoken = await reCaptchaExecute(global.gappkey, 'auth')


        //проверка полей
        if ((form.profileLogin.length >= 5) && (form.profilePassword.length >= 8)) {

            //запрос
            let result = await axios.post(`/api/auth/login`, {
                login: form.profileLogin,
                password: form.profilePassword,
                gtoken: gtoken
            });

            result = result.data;

            //ответ со всеми значениями
            if ((!result.err) && (result.response)) {
                //запоминаем состояние
                props.Store_myUser(result.response._id, result.response.login, result.response.tid, result.response.token, form.remember);
                props.func({
                    message: result.response.message
                })
                //document.location.href = `/user/${result.response._id}`
                //this.props.history.push('/accounts')
            } else {
                setForm(prev => ({...prev, info: result.msg}))
            }

        } else {
            setForm(prev => ({...prev, info: 'Не верный логин или пароль'}))
        }

    }

    const onChange = (event) => {
        if (event.target.value.length <= 30) {
            const name = event.target.name;
            let value = event.target.value

            //удаление пробелов
            if (name === 'profileLogin')
                value = value.replace(/\s/g, '');

            setForm(prev => ({
                ...prev, [name]: value
            }))
        }

        setForm(prev => ({
            ...prev, info: null
        }))
    }

    const onChangeRemember = (event) => {
        let remember = false
        if (event.target.value === 'on') remember = true

        setForm(prev => ({
            ...prev, remember: remember
        }))
    }

    return (
        <div className="container">
            <div className="row">

                <div className="card card-block login-block shadow my-3 mx-auto">
                    <div className="card-body">
                        {(form.info) ?
                            <div className="alert alert-warning" role="alert">
                                {form.info}
                            </div> : null
                        }

                        <form onSubmit={onClickAuth}>
                            <div className="mb-3">
                                <label htmlFor="profileLogin" className="form-label">Логин</label>
                                <input type="text" className="form-control" id="profileLogin" name="profileLogin" minLength="5" value={form.profileLogin} onChange={onChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="profilePassword" className="form-label">Пароль</label>
                                <input type="password" className="form-control" id="profilePassword" name="profilePassword" minLength="8" value={form.profilePassword} onChange={onChange} autoComplete="new-password"/>
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="remember" onChange={onChangeRemember}/>
                                <label className="form-check-label" htmlFor="remember">Запомнить меня</label>
                            </div>
                            <button type="submit" className="btn btn-primary">Войти</button>
                            <br/>
                            <Link to="/reg" className="">Регистрация</Link>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default connect (
    state => ({

    }),
    dispatch => ({
        Store_myUser: (_id, login, tokenId, tokenKey, remember) => {
            dispatch({type: 'AUTH', _id: _id, login: login, tokenId: tokenId, tokenKey: tokenKey, remember: remember});
        }
    })
)(Auth);

