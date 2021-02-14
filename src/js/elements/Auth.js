import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {ReCaptcha} from 'react-top-recaptcha-v3';

//https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=%D0%9B%D0%9E%D0%93%D0%98%D0%9D&password=%D0%9F%D0%90%D0%A0%D0%9E%D0%9B%D0%AC&captcha_key=q24yud&captcha_sid=656412648896
class Auth extends Component {
    constructor () {
        super();
        this.state = {
            profileLogin: '',
            profilePassword: '',
            info: null,
            remember: false
        };

        this.onChange = this.onChange.bind(this);
        this.onChangeRemember = this.onChangeRemember.bind(this);
        this.onClickAuth = this.onClickAuth.bind(this);

    }

    async componentDidMount () {

    }

    async onClickAuth (event) {
        event.preventDefault();
        this.recaptcha.execute() /* сброс reCaptcha */

        //проверка полей
        if ((this.state.profileLogin.length >= 5) && (this.state.profilePassword.length >= 8)) {

            //запрос
            let result = await axios.post('/api/auth/login', {
                login: this.state.profileLogin,
                password: this.state.profilePassword,
                gtoken: this.state.gtoken
            });

            result = result.data;

            //ответ со всеми значениями
            if ((!result.err) && (result.response)) {
                //запоминаем состояние
                this.props.Store_myUser(result.response.id, result.response.login, result.response.tid, result.response.token, this.state.remember);
                //this.props.history.push('/accounts')
            } else {
                this.setState({info: result.msg})
            }

        } else {
            this.setState({info: 'Не верный логин или пароль'})
        }

    }

    onChange (event) {
        if (event.target.value.length <= 30) {
            const name = event.target.name;
            this.setState({[name]: event.target.value});
        }

        this.setState({info: null})
    }

    onChangeRemember(event) {
        this.setState({remember: event.target.value});
    }

    render() {

        return (
            <div className="container">
                <div className="row">
                    <ReCaptcha
                        ref={ref => this.recaptcha = ref}
                        action='settings'
                        sitekey={global.gappkey}
                        verifyCallback={token => this.setState({gtoken: token})}
                    />

                    <div className="card card-block login-block shadow my-3 mx-auto">
                        <div className="card-body">
                            {(this.state.info) ?
                                <div className="alert alert-warning" role="alert">
                                    {this.state.info}
                                </div> : null
                            }

                            <form onSubmit={this.onClickAuth}>
                                <div className="mb-3">
                                    <label htmlFor="profileLogin" className="form-label">Логин</label>
                                    <input type="text" className="form-control" id="profileLogin" name="profileLogin" minLength="5" value={this.state.profileLogin} onChange={this.onChange}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="profilePassword" className="form-label">Пароль</label>
                                    <input type="password" className="form-control" id="profilePassword" name="profilePassword" minLength="8" value={this.state.profilePassword} onChange={this.onChange} autoComplete="new-password"/>
                                </div>
                                <div className="mb-3 form-check">
                                    <input type="checkbox" className="form-check-input" id="remember" onChange={this.onChangeRemember}/>
                                    <label className="form-check-label" htmlFor="remember">Запомнить меня</label>
                                </div>
                                <button type="submit" className="btn btn-primary">Войти</button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

}

export default connect (
    state => ({

    }),
    dispatch => ({
        Store_myUser: (id, login, tokenId, tokenKey, remember) => {
            dispatch({type: 'AUTH', id: id, login: login, tokenId: tokenId, tokenKey: tokenKey, remember: remember});
        }
    })
)(Auth);

