import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function AddPhoto (props) {
    let [form, setForm] = useState({
        files: null,
        inputText: '',
        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0
    })
    let [formCode, setFormCode] = useState(getRandomInt(0, 9999))

    //отслеживаем изменение props
    useEffect(async () => {
        //await GetAlbums()
    }, [])

    const onChangeFiles = (e) => {
        props.SendFile(e.target.files)

        //setForm(prev => ({...prev, files: e.target.files}))
        console.log(e.target.files)
    }

    const onChangeId = (e) => {

    }

    const onFormClose = (e) => {

    }
    
    return (
        <>
            <i className="far fa-file-image" data-bs-toggle="modal" data-bs-target={`#modalAddPhoto${formCode}`}></i>

            <div className="modal fade" id={`modalAddPhoto${formCode}`} tabIndex="-1" aria-labelledby={`modalAddPhoto${formCode}`} aria-hidden="true">

                <div>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Изображения</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <div className="mb-3 form-file">
                                    <input type="file" className="form-file-input" id="inputFile" onChange={onChangeFiles} multiple={true} accept="image/gif, image/png, image/jpeg"/>
                                    <label className="form-file-label" htmlFor="inputFile">
                                        <span className="form-file-text">Выберите файлы...</span>
                                        <span className="form-file-button">Обзор</span>
                                    </label>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                        onClick={onFormClose}>Закрыть
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>

    )
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(AddPhoto);

