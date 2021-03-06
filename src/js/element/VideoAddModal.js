import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import SelectAlbum from "../object/SelectAlbum";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";

function VideoAddModal (props) {
    let [form, setForm] = useState({
        inputFilePreview: null,
        inputFile: null,
        inputTitle: '',
        inputText: '',
        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0,

        response: {
            count: 0,
            items: []
        },
        count: 100,
        offset: 0,
        arAlbums: [],

        arSelectAlbums: []
    })

    //отслеживаем изменение props
    useEffect (async () => {
        await GetAlbums()
    }, [])

    //получаем результат выбранных альбомов от checked
    const ChangeSelectAlbums = (arSelectAlbums) => {
        setForm(prev => ({...prev, arSelectAlbums: arSelectAlbums}))
    }

    const GetAlbums = async (start) => {
        let fields = {
            params: {
                module: 'video',
                owner_id: props.owner_id,
                offset: (start) ? 0 : form.offset,
                count: form.count
            }
        }

        const url = `/api/album/get`;

        let result = await axios.get(url, fields);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setForm(prev => ({...prev, ...{
            offset: (start) ? 0 : prev.offset + form.count,
            count: result.response.count,
            response: result.response,
            arAlbums: (start) ? result.response.items : [...prev.arAlbums, ...result.response.items],
        }}))
    }

    const onChangeFile = (e) => {
        let name = e.target.id;

        setForm(prev => ({
            ...prev, [name]:e.target.files[0]
        }))
    }

    const onChangeText = (e) => {
        let name = e.target.id;
        let value = e.target.value;

        setForm(prev => ({
            ...prev, [name]: value
        }))
    }

    const onFormClose = (e) => {

        setForm(prev => ({...prev, ...{
                inputFilePreview: null,
                inputFile: null,
                inputTitle: '',
                inputText: '',
                processBarLoaded: 0,
                processBarTotal: 0,
                processBar: 0
            }}))
    }

    const onFormSubmitFile = async (e) => {
        e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'video')

        const url = '/api/video/add';
        const formData = new FormData();

        console.log(form)

        formData.append('file', form.inputFile)
        formData.append('title', form.inputTitle)
        formData.append('text', form.inputText)
        formData.append('gtoken', gtoken)

        //файл есть
        if (form.inputFilePreview)
            formData.append('file_preview', form.inputFilePreview)

        //альбомы выбраны
        if (form.arSelectAlbums.length)
            formData.append('albums', form.arSelectAlbums.join(','))

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
        <div className="modal fade" id="modalVideoAdd" tabIndex="-1" aria-labelledby="modalVideoAdd"
             aria-hidden="true">

            <form onSubmit={onFormSubmitFile}>

                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Новое видео</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <div className="mb-3">
                                <label htmlFor="inputFilePreview" className="form-label">Картинка (значек)</label>
                                <input className="form-control form-control-sm" id="inputFilePreview" type="file" onChange={onChangeFile}/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="inputFile" className="form-label">Видео</label>
                                <input className="form-control form-control-sm" id="inputFile" type="file" onChange={onChangeFile}/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="" className="form-label">Альбомы</label>
                                {/* checked массив альбомов */}
                                <SelectAlbum albums={form.arAlbums} func={ChangeSelectAlbums}/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="inputTitle" className="form-label">Название</label>
                                <input type="text" className="form-control" id="inputTitle"
                                       onChange={onChangeText} value={form.inputTitle}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="inputText" className="form-label">Описание</label>
                                <textarea className="form-control" id="inputText" rows="5"
                                          onChange={onChangeText} value={form.inputText}></textarea>
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
)(VideoAddModal);

