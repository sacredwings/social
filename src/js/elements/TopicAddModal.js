import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {ReCaptcha} from "react-top-recaptcha-v3";
import SelectAlbum from "../objects/SelectAlbum";

function TopicAddModal (props) {
    let [recaptcha, setRecaptcha] = useState('')
    let [gtoken, setGtoken] = useState('')
    let [form, setForm] = useState({
        files: null,
        inputTitle: '',
        inputText: '',
        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0
    })

    //отслеживаем изменение props
    useEffect(async () => {
        //await GetAlbums()
    }, [])

    const onChangeFiles = (e) => {
        setForm(prev => ({...prev, files: e.target.files}))
    }

    const onChangeText = (e) => {
        let name = e.target.id;
        let value = e.target.value;

        setForm(prev => ({
            ...prev, [name]: value
        }))
    }

    const onFormClose = (e) => {
        setForm(prev => ({
            files: null,
            inputTitle: '',
            inputText: '',
            processBarLoaded: 0,
            processBarTotal: 0,
            processBar: 0
        }))
    }

    const onFormSubmit = async (e) => {
        e.preventDefault() // Stop form submit

        await recaptcha.execute() /* сброс reCaptcha */

        const url = '/api/topic/add';
        const formData = new FormData();

        if ((form.files) && (form.files.length))
            for (let i=0; i < form.files.length; i++)
                formData.append(`files[${i}]`, form.files[i])

        formData.append('title', form.inputTitle)
        formData.append('text', form.inputText)
        formData.append('gtoken', gtoken)

        //если это группа, то отправляем ее id
        if ((props.owner_id) && (props.owner_id<0))
            formData.append('group_id', -props.owner_id)

        axios.post(url, formData, {

            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function (progressEvent) {
                console.log(progressEvent)
                if (progressEvent.lengthComputable) {
                    let percentage = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
                    console.log(progressEvent.loaded + ' ' + progressEvent.total + ' ' + percentage);

                    setForm(prev => ({...prev, ...{
                            processBarLoaded: progressEvent.loaded,
                            processBarTotal: progressEvent.total,
                            processBar: percentage
                        }}))

                }
                // Do whatever you want with the native progress event
            },

        })
    }

    return (

        <div className="modal fade" id="modalTopicAdd" tabIndex="-1" aria-labelledby="modalTopicAdd"
             aria-hidden="true">

            <ReCaptcha
                ref={ref => setRecaptcha(ref)}
                action='settings'
                sitekey={global.gappkey}
                verifyCallback={token => setGtoken(token)}
            />
            <form onSubmit={onFormSubmit}>

                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Новое обсуждение</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <div className="mb-3">
                                <label htmlFor="inputTitle" className="form-label">Название</label>
                                <input type="text" className="form-control" id="inputTitle" onChange={onChangeText} value={form.inputTitle}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="inputText" className="form-label">Описание</label>
                                <textarea className="form-control" id="inputText" rows="5" onChange={onChangeText} value={form.inputText}></textarea>
                            </div>

                            <div className="mb-3 form-file">
                                <input type="file" className="form-file-input" id="inputFile" onChange={onChangeFiles} multiple={true}/>
                                <label className="form-file-label" htmlFor="inputFile">
                                    <span className="form-file-text">Выберите файлы...</span>
                                    <span className="form-file-button">Обзор</span>
                                </label>
                            </div>

                            {((form.processBar >0) && (form.processBar <100)) ? <div className="mb-3"><p className="text-primary">Загружаю</p></div>:null}
                            {(form.processBar === 100) ? <div className="mb-3"><p className="text-success">Загружено</p></div>:null}
                            <div className="progress">
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${form.processBar}%`}} aria-valuenow={form.processBar} aria-valuemin="0" aria-valuemax="100"></div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                    onClick={onFormClose}>Закрыть
                            </button>
                            <button type="submit" className="btn btn-primary"
                                    disabled={(form.processBar !== 0) ? true : false}>Добавить
                            </button>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(TopicAddModal);

