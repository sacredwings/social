import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";

function CommentsAdd (props) {
    let [form, setForm] = useState({
        files: null,
        inputText: '',
        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0,
        add: false
    })

    const onChangeFiles = (e) => {
        setForm(prev => ({...prev, files: e.target.files}))
    }

    const onChangeText = (e) => {
        setForm(prev => ({...prev, inputText: e.target.value}))
    }

    const FormNull = () => {
        setForm(prev => ({
            files: null,
            inputText: '',
            processBar: 0,
            processBarLoaded: 0,
            processBarTotal: 0,
            add: true
        }))
    }

    const onFormSubmitFile = async (e) => {

        let gtoken = await reCaptchaExecute(global.gappkey, 'album')

        let module = props.module;
        let object_id = props.object_id;

        const url = '/api/comment/add';
        const formData = new FormData();

        if ((form.files) && (form.files.length))
            for (let i=0; i < form.files.length; i++)
                formData.append(`files[${i}]`, form.files[i])

        formData.append('module', module)
        formData.append('object_id', object_id)
        formData.append('text', form.inputText)
        formData.append('gtoken', gtoken)

        axios.post(url, formData, {

            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function (progressEvent) {
                //известен размер данных формы
                if (progressEvent.lengthComputable) {
                    //процент загрузки
                    let percentage = Math.floor((progressEvent.loaded * 100) / progressEvent.total)

                    if (percentage < 100)
                        setForm(prev => ({
                            ...prev,
                            ...{
                                processBar: percentage,
                                processBarLoaded: progressEvent.loaded,
                                processBarTotal: progressEvent.total
                            }
                        }))
                    else
                        FormNull() //обнуляем форму
                }
                // Do whatever you want with the native progress event
            },

        })


        e.preventDefault() // Stop form submit
    }

    const Form = () => {
        return (
            <>
                <div className="row">

                    <div className="col-lg-12 m-3">
                        <form onSubmit={onFormSubmitFile}>

                            <div className="mb-3">
                                <label htmlFor="inputText" className="form-label">Новый комментарий</label>
                                <textarea className="form-control" id="inputText" rows="5" onChange={onChangeText} value={form.inputText}></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="inputFile" className="form-label">Прикрепить файлы</label>
                                <input className="form-control form-control-sm" id="inputFile" type="file" onChange={onChangeFiles} multiple={true}/>
                            </div>

                            {((form.processBar >0) && (form.processBar <100)) ? <div className="mb-3"><p className="text-primary">Загружаю</p></div>:null}
                            {(form.processBar === 100) ? <div className="mb-3"><p className="text-success">Загружено</p></div>:null}
                            <div className="progress">
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${form.processBar}%`}} aria-valuenow={form.processBar} aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <br/>
                            <button type="submit" className="btn btn-primary" disabled={(form.processBar !== 0) ? true : false}>Добавить комментарий</button>
                        </form>

                    </div>
                </div>

            </>
        )
    }

    const FormGood = () => {
        return <div className="alert alert-success" role="alert">
            Комментарий добавлен
        </div>
    }

    return (
        <>
            {(form.add) ? FormGood() : Form()}

        </>
    )

}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(CommentsAdd);

