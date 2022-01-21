import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import VideoPostModalAdd from "../element/video/VideoPostModalAdd";
import axios from "axios";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function AddVideo (props) {
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

        window.$(`#modalAddVideo${formCode}_close`).trigger('click')
    }

    const SelectVideoId = (ids) => {
        props.SendId([ids])

        window.$(`#modalAddVideo${formCode}`).modal("hide")
    }

    const onFormClose = (e) => {

    }

    return (
        <>
            <i className="far fa-file-video" data-bs-toggle="modal" data-bs-target={`#modalAddVideo${formCode}`}></i>

            <div className="modal fade" id={`modalAddVideo${formCode}`} tabIndex="-1" aria-labelledby={`modalAddVideo${formCode}`} aria-hidden="true">

                <div>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Видео</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <div className="mb-3">
                                    <label htmlFor="formFileSm" className="form-label">Выберите видео...</label>
                                    <input className="form-control form-control-sm" id="formFileSm" type="file" onChange={onChangeFiles} multiple={true} accept="video/mp4"/>
                                </div>
                                <hr/>
                                {/*<VideoPostModalAdd user_id={props.user_id} group_id={props.group_id} SelectVideoId={SelectVideoId}/>*/}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id={`modalAddVideo${formCode}_close`}
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
)(AddVideo);

