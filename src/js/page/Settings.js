import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";

class Settings extends Component {
    constructor () {
        super();
        this.state = {
            password: '',
            password_replay: '',
            err: null,
            errText: '',

            file: null,

            processBarLoaded: 0,
            processBarTotal: 0,
            processBar: 0
        };

        this.onChange = this.onChange.bind(this)
        this.onChangeFile = this.onChangeFile.bind(this)

        this.onSavePassword = this.onSavePassword.bind(this)
        this.onSavePhoto = this.onSavePhoto.bind(this)
    }

    async componentDidMount () {

    }

    onChange (event) {
        if (event.target.value.length <= 30) {
            const name = event.target.name;
            this.setState({[name]: event.target.value});
        }
    }

    async onSavePassword (e) {
        e.preventDefault();
        let gtoken = await reCaptchaExecute(global.gappkey, 'setting')

        //проверка полей
        if ((this.state.password.length >= 8) && (this.state.password_replay.length >= 8) && (this.state.password === this.state.password_replay)) {

            //стираем ошибки
            this.setState({err: 0});

            //запрос
            let result = await axios.post('/api/account/setPassword', {
                password: this.state.password,
                gtoken: gtoken
            });
            result = result.data;

            if (result.err)
                this.setState({err: 1, errText: 'Пароль не изменен'})
            else
                this.setState({err: 0, errText: 'Пароль изменен'})

        } else {
            if (this.state.password.length < 8) {this.setState({err: 1, errText: 'Пароль мешьше 8 символов'});}
            if (this.state.password !== this.state.password_replay) {this.setState({err: 1, errText: 'Пароли не совпадают'});}
        }
    }

    //АВА
    onChangeFile(e) {
        this.setState({file:e.target.files[0]})
    }

    async onSavePhoto(e){
        e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'setting')

        let _this = this
        const url = '/api/account/setPhoto';
        const formData = new FormData();

        formData.append('file', this.state.file)
        formData.append('gtoken', gtoken)

        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function (progressEvent) {
                console.log(progressEvent)
                if (progressEvent.lengthComputable) {
                    let percentage = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
                    console.log(progressEvent.loaded + ' ' + progressEvent.total + ' ' + percentage);
                    _this.setState({processBar: percentage, processBarLoaded: progressEvent.loaded, processBarTotal: progressEvent.total})

                }
                // Do whatever you want with the native progress event
            },
        })
    }

    render() {

        return (
            <div className="container my-3">
                <div className="row">

                    <div className="col">
                        <h2 className="mb-3">Настройки</h2>

                        <div className="card">
                            <div className="card-header">
                                Изменение пароля
                            </div>
                            <div className="card-body">
                                {(this.state.err === 1) ?
                                    <div className="alert alert-warning" role="alert">
                                        {this.state.errText}
                                    </div> : null
                                }
                                {(this.state.err === 0) ?
                                    <div className="alert alert-success" role="alert">
                                        {this.state.errText}
                                    </div> : null
                                }

                                <form onSubmit={this.onSavePassword}>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="basic-addon1" role="img" aria-label="jsx-a11y/accessible-emoji">🔒</span>
                                        <input type="text" className="form-control" placeholder="Пароль" name="password" id="password" value={this.state.password} onChange={this.onChange}/>
                                    </div>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="basic-addon1" role="img" aria-label="jsx-a11y/accessible-emoji">🔒</span>
                                        <input type="text" className="form-control" placeholder="Повторите пароль" name="password_replay" id="password_replay" value={this.state.password_replay} onChange={this.onChange}/>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Сохранить</button>
                                </form>

                            </div>
                        </div>

                        <div className="card mt-3">
                            <div className="card-header">
                                Изменить аватар
                            </div>
                            <div className="card-body">
                                <form onSubmit={this.onSavePhoto}>
                                    <div className="mb-3 form-file">
                                        <input type="file" className="form-file-input" id="inputFile" onChange={this.onChangeFile}/>
                                        <label className="form-file-label" htmlFor="inputFile">
                                            <span className="form-file-text">Выберите файл...</span>
                                            <span className="form-file-button">Обзор</span>
                                        </label>
                                    </div>
                                    {((this.state.processBar >0) && (this.state.processBar <100)) ? <div className="mb-3"><p className="text-primary">Загружаю</p></div>:null}
                                    {(this.state.processBar === 100) ? <div className="mb-3"><p className="text-success">Загружено</p></div>:null}
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${this.state.processBar}%`}} aria-valuenow={this.state.processBar} aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <br/>
                                    <button type="submit" className="btn btn-primary">Сохранить</button>
                                </form>
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

    }),
    dispatch => ({
        set_phone: (has_phone) => {
            dispatch({type: 'SET_PHONE', has_phone: has_phone});
        }
    })
)(Settings);

