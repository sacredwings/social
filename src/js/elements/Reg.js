import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {ReCaptcha} from 'recaptcha-v3-react';

//https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=%D0%9B%D0%9E%D0%93%D0%98%D0%9D&password=%D0%9F%D0%90%D0%A0%D0%9E%D0%9B%D0%AC&captcha_key=q24yud&captcha_sid=656412648896
class Reg extends Component {
    constructor () {
        super();
        this.state = {
            login: '',
            password: '',
            email: '',

            requestStatus: null
        };

        this.onChange = this.onChange.bind(this);
        this.onClickReg = this.onClickReg.bind(this);
        //this.onChangeRadio = this.onChangeRadio.bind(this);
    }

    async componentDidMount () {

    }

    async onClickReg (event) {
        event.preventDefault();

        //проверка полей
        if (
            (this.state.email.length >= 5) &&
            (this.state.login.length >= 5) &&
            (this.state.password.length >= 8)
        ) {

            this.recaptcha.execute() /* сброс reCaptcha */
            //запрос
            let result = await axios.post('/api/user/reg', {
                login: this.state.login,
                password: this.state.password,
                email: this.state.email,

                gtoken: this.state.gtoken
            });

            result = result.data;

            //ответ со всеми значениями
            if ((!result.err) && (result.response)) {
                this.setState({requestStatus: result.err})
            } else {
                this.setState({info: result.msg})
            }

        } else {
            this.setState({info: 'Форма заполнена не верно'})
        }

    }

    onChange (event) {
        if (event.target.value.length <= 30) {
            const name = event.target.name;
            this.setState({[name]: event.target.value});
        }

        this.setState({info: null})
    }

    /*
    onChangeRadio (event) {
        if (event.target.id === 'gender1')
            this.setState({gender: 1})
        else
            this.setState({gender: 0})

    }*/

    Form () {
        return <div className="card card-block login-block shadow my-3 mx-auto">
            <div className="card-body">
                <h2>Регистрация</h2>
                {(this.state.info) ?
                    <div className="alert alert-warning" role="alert">
                        {this.state.info}
                    </div> : null
                }

                <form onSubmit={this.onClickReg}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="text" className="form-control" id="email" name="email" minLength="8" maxLength="100" value={this.state.email} onChange={this.onChange} autoComplete=""/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="login" className="form-label">Логин</label>
                        <input type="text" className="form-control" id="login" name="login" minLength="5" maxLength="50" value={this.state.login} onChange={this.onChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Придумайте пароль</label>
                        <input type="password" className="form-control" id="password" name="password" minLength="8" maxLength="60" value={this.state.password} onChange={this.onChange} autoComplete=""/>
                    </div>
                    <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    }
    Instruction () {
        return <div className="alert alert-success" role="alert">
            Письмо отправлено на вашу почту <b>{this.state.email}</b>, следуйте инструкиям в письме !
        </div>
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

                    {this.state.requestStatus === 0 ? this.Instruction() : this.Form()}

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
)(Reg);

