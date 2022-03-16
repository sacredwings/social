import React, {Component, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";


//https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=%D0%9B%D0%9E%D0%93%D0%98%D0%9D&password=%D0%9F%D0%90%D0%A0%D0%9E%D0%9B%D0%AC&captcha_key=q24yud&captcha_sid=656412648896

function Reg (props) {
    //const {id} = useParams()

    let [form, setForm] = useState({
        email: '',
        login: '',
        password: ''
    })

    async function onClickReg (event) {
        event.preventDefault();

        //проверка полей
        if (
            (form.email.length >= 5) &&
            (form.login.length >= 5) &&
            (form.password.length >= 8)
        ) {

            let gtoken = await reCaptchaExecute(global.gappkey, 'reg')

            //let login = form.login.replace(' ', '')
            //let password = form.password.replace(' ', '')

            //запрос
            let result = await axios.post(`/api/user/reg`, {
                login: form.login,
                password: form.password,
                email: form.email,

                gtoken: gtoken
            });

            result = result.data;

            //ответ со всеми значениями
            if ((!result.err) && (result.response)) {
                //this.setState({requestStatus: result.err})
                props.Store_myUser(result.response._id, result.response.login, result.response.tid, result.response.token, form.remember);
                document.location.href = `/user/${result.response._id}`
            } else {
                setForm(prev => ({...prev, ...{info: result.msg}}))
            }

        } else {
            setForm(prev => ({...prev, ...{info: 'Форма заполнена не верно'}}))
        }

    }

    function onChange (event) {
        if (event.target.value.length <= 30) {
            const name = event.target.name
            let value = event.target.value

            //удаление пробелов
            if ((name === 'email') || (name === 'login'))
                value = value.replace(/\s/g, '');

            setForm(prev => ({...prev, ...{[name]: value}}))
        }
        setForm(prev => ({...prev, ...{info: null}}))
    }

    /*
    onChangeRadio (event) {
        if (event.target.id === 'gender1')
            this.setState({gender: 1})
        else
            this.setState({gender: 0})

    }*/

    function Form () {
        return <div className="card card-block login-block shadow my-3 mx-auto">
            <div className="card-body">

                <div className="row text-center">
                    <div className="col-lg-12">
                        <h2 className="">Регистрация</h2>

                        <video controls={true} preload="preload" style={{width: '100%'}}>
                            <source src="https://voenset.ru/files/f1/97/f197b1a41bd0b659d5db8f73c5badd64.mp4"
                                    type="video/mp4"/>
                        </video>

                    </div>

                </div>

                <hr/>
                {(form.info) ?
                    <div className="alert alert-danger" role="alert">
                        {form.info}
                    </div> : null
                }

                <form onSubmit={onClickReg}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="text" className="form-control" id="email" name="email" minLength="8" maxLength="100" value={form.email} onChange={onChange} autoComplete=""/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="login" className="form-label">Логин</label>
                        <input type="text" className="form-control" id="login" name="login" minLength="5" maxLength="50" value={form.login} onChange={onChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Придумайте пароль</label>
                        <input type="password" className="form-control" id="password" name="password" minLength="8" maxLength="60" value={form.password} onChange={onChange} autoComplete=""/>
                    </div>
                    <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    }
    function Instruction () {
        return <div className="alert alert-success" role="alert">
            Письмо отправлено на вашу почту <b>{form.email}</b>, следуйте инструкиям в письме !
        </div>
    }

    return (
        <div className="container">
            <div className="row">
                {Form()}
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
)(Reg);

