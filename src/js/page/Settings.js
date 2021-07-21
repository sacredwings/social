import React, {useState, useEffect, useReducer} from 'react';
import axios from "axios";
import {connect} from 'react-redux';
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";

function Settings (props) {
    let formDefault = {
        password: '',
        password_replay: '',
        err: null,
        errText: '',

        file: null,

        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0
    }
    let [form, setForm] = useState(formDefault)

    //отслеживаем изменение props
    useEffect(async () => {
        await Get()
    }, [])

    async function Get (userId) {

        //запрос
        let result = await axios.get(`/api/account/get`, {});
        console.log(result)
        result = result.data;

        //ответ со всеми значениями
        if ((result) && (result.err === 0)) {

            result = result.response

            setForm(prevState => ({
                ...prevState,
                ...{
                    first_name: result.first_name,
                    last_name: result.last_name,
                    second_name: result.second_name
                }
            }))

            //if ((result.response) && (result.response[0]))
                //setUser(result.response[0]);
            //else
                //setUser(false);

        }

    }

    const onChange = (event) => {
        if (event.target.value.length <= 30) {
            const name = event.target.name;
            setForm(prevState => ({
                ...prevState,
                [name]: event.target.value
            }))
        }
    }

    const onSavePassword = async (e) => {
        e.preventDefault();
        let gtoken = await reCaptchaExecute(global.gappkey, 'setting')

        //проверка полей
        if ((form.password.length >= 8) && (form.password_replay.length >= 8) && (form.password === form.password_replay)) {

            //стираем ошибки
            setForm(prevState => ({
                ...prevState,
                err: 0
            }))

            //запрос
            let result = await axios.post('/api/account/setPassword', {
                password: form.password,
                gtoken: gtoken
            });
            result = result.data;

            if (result.err)
                setForm(prevState => ({
                    ...prevState,
                    ...{
                        err: 1,
                        errText: 'Пароль не изменен'
                    }
                }))
            else
                setForm(prevState => ({
                    ...prevState,
                    ...{
                        err: 0,
                        errText: 'Пароль изменен'
                    }
                }))
        } else {
            if (form.password.length < 8) {
                setForm(prevState => ({
                    ...prevState,
                    ...{
                        err: 1,
                        errText: 'Пароль мешьше 8 символов'
                    }
                }))
            }
            if (form.password !== form.password_replay) {
                setForm(prevState => ({
                    ...prevState,
                    ...{
                        err: 1,
                        errText: 'Пароли не совпадают'
                    }
                }))
            }
        }
    }

    //АВА
    const onChangeFile = (e) => {
        setForm(prevState => ({
            ...prevState,
            ...{
                file:e.target.files[0]
            }
        }))
    }

    const onSavePhoto = async (e) => {
        e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'setting')

        const url = '/api/account/setPhoto';
        const formData = new FormData();

        formData.append('file', form.file)
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

                    setForm(prevState => ({
                        ...prevState,
                        ...{processBar: percentage, processBarLoaded: progressEvent.loaded, processBarTotal: progressEvent.total}
                    }))
                }
                // Do whatever you want with the native progress event
            },
        })
    }

    const onSaveName = async (e) => {
        e.preventDefault();
        let gtoken = await reCaptchaExecute(global.gappkey, 'setting')

        //запрос
        let result = await axios.post('/api/account/setName', {
            first_name: form.first_name,
            last_name: form.last_name,
            second_name: form.second_name,
            gtoken: gtoken
        });
        result = result.data;


    }

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
                            {(form.err === 1) ?
                                <div className="alert alert-warning" role="alert">
                                    {form.errText}
                                </div> : null
                            }
                            {(form.err === 0) ?
                                <div className="alert alert-success" role="alert">
                                    {form.errText}
                                </div> : null
                            }

                            <form onSubmit={onSavePassword}>
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="basic-addon1" role="img" aria-label="jsx-a11y/accessible-emoji">🔒</span>
                                    <input type="text" className="form-control" placeholder="Пароль" name="password" id="password" value={form.password} onChange={onChange}/>
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="basic-addon1" role="img" aria-label="jsx-a11y/accessible-emoji">🔒</span>
                                    <input type="text" className="form-control" placeholder="Повторите пароль" name="password_replay" id="password_replay" value={form.password_replay} onChange={onChange}/>
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
                            <form onSubmit={onSavePhoto}>
                                <div className="mb-3 form-file">
                                    <input type="file" className="form-file-input" id="inputFile" onChange={onChangeFile}/>
                                    <label className="form-file-label" htmlFor="inputFile">
                                        <span className="form-file-text">Выберите файл...</span>
                                        <span className="form-file-button">Обзор</span>
                                    </label>
                                </div>
                                {((form.processBar >0) && (form.processBar <100)) ? <div className="mb-3"><p className="text-primary">Загружаю</p></div>:null}
                                {(form.processBar === 100) ? <div className="mb-3"><p className="text-success">Загружено</p></div>:null}
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${form.processBar}%`}} aria-valuenow={form.processBar} aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <br/>
                                <button type="submit" className="btn btn-primary">Сохранить</button>
                            </form>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                            Как к вам обращаться ? (видно всем пользователям сети)
                        </div>
                        <div className="card-body">
                            <form onSubmit={onSaveName}>
                                <div className="mb-3">
                                    <label htmlFor="first_name" className="form-label">Имя</label>
                                    <input type="text" className="form-control" placeholder="Имя" name="first_name" id="first_name" value={form.first_name} onChange={onChange}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="last_name" className="form-label">Фамилия</label>
                                    <input type="text" className="form-control" placeholder="Фамилия" name="last_name" id="last_name" value={form.last_name} onChange={onChange}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="second_name" className="form-label">Отчество</label>
                                    <input type="text" className="form-control" placeholder="Отчество" name="second_name" id="second_name" value={form.second_name} onChange={onChange}/>
                                </div>
                                <button type="submit" className="btn btn-primary">Сохранить</button>
                            </form>
                        </div>
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
        set_phone: (has_phone) => {
            dispatch({type: 'SET_PHONE', has_phone: has_phone});
        }
    })
)(Settings);

