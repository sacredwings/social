import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import SelectAlbumOne from "../object/SelectAlbumOne";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";

function AlbumAddModal (props) {
    let formDefault = {
        file: null,
        //album_id: null,
        inputTitle: '',
        inputText: '',
        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0
    }

    let [form, setForm] = useState(formDefault)

    //отслеживаем изменение props
    useEffect(async () => {
    }, [])

    const ChangeSelectAlbum = (album_id) => {
        setForm(prev => ({...prev, album_id: album_id}))
    }

    const onChangeFile = (e) => {
        setForm(prev => ({...prev, file:e.target.files[0]}))
    }

    const onChangeText = (e) => {
        let name = e.target.id;
        let value = e.target.value;

        setForm(prev => ({...prev, [name]:value}))
    }

    const onFormClose = (e) => {
        setForm(formDefault)
    }

    const onFormSubmitFile = async (e) => {
        e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'album')

        const url = '/api/album/add';
        const formData = new FormData();

        formData.append('file', form.file)
        formData.append('title', form.inputTitle)
        formData.append('text', form.inputText)
        formData.append('gtoken', gtoken)
        formData.append('module', 'video')

        if (form.album_id)
            formData.append('album_id', form.album_id)

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
                            processBar: percentage,
                            processBarLoaded: progressEvent.loaded,
                            processBarTotal: progressEvent.total
                        }}))
                }
                // Do whatever you want with the native progress event
            },

        })

    }

    return (
        <div className="modal fade" id="modalAlbumAdd" tabIndex="-1" aria-labelledby="modalAlbumAdd"
             aria-hidden="true">

            <form onSubmit={onFormSubmitFile}>

                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Новый альбом</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <p>Выберите видео файл на своем устройстве</p>
                            <div className="mb-3 form-file">
                                <input type="file" className="form-file-input" id="inputFile"
                                       onChange={onChangeFile}/>
                                <label className="form-file-label" htmlFor="inputFile">
                                    <span className="form-file-text">Выберите файл...</span>
                                    <span className="form-file-button">Обзор</span>
                                </label>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="inputTitle" className="form-label">Название</label>
                                <input type="text" className="form-control" id="inputTitle"
                                       onChange={onChangeText} value={form.inputTitle}/>
                            </div>

                            <SelectAlbumOne owner_id={props.owner_id} func={ChangeSelectAlbum}/>

                            <div className="mb-3">
                                <label htmlFor="inputText" className="form-label">Описание</label>
                                <textarea className="form-control" id="inputText" rows="5"
                                          onChange={onChangeText} value={form.inputText}></textarea>
                            </div>

                            {((form.processBar > 0) && (form.processBar < 100)) ?
                                <div className="mb-3"><p className="text-primary">Загружаю</p></div> : null}
                            {(form.processBar === 100) ?
                                <div className="mb-3"><p className="text-success">Загружено</p></div> : null}
                            <div className="progress">
                                <div className="progress-bar progress-bar-striped progress-bar-animated"
                                     role="progressbar" style={{width: `${form.processBar}%`}}
                                     aria-valuenow={form.processBar} aria-valuemin="0"
                                     aria-valuemax="100"></div>
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
)(AlbumAddModal);

