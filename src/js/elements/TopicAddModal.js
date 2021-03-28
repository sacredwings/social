import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import SelectAlbum from "../objects/SelectAlbum";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import AddFile from "../objects/AddFile";

function TopicAddModal (props) {
    let [form, setForm] = useState({
        inputTitle: '',
        inputText: '',
    })
    let [fileIds, setFileIds] = useState('')

    const ArFileIds = (arIds) => {
        setFileIds(arIds)
    }

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

        let gtoken = await reCaptchaExecute(global.gappkey, 'topic')

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

                            <br/>
                            <div className="row">
                                <div className="col-12">
                                    <AddFile ArFileIds={ArFileIds}/>
                                </div>
                            </div>
                            <br/>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                    onClick={onFormClose}>Закрыть
                            </button>
                            <button type="submit" className="btn btn-primary">Добавить</button>
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

