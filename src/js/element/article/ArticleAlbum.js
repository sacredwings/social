import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import axios from "axios";

import AlbumAddModal from "../../element/AlbumAddModal";
import {Link} from "react-router-dom";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import ElementFile from "../../object/ElementFile";

function AlbumArticle (props) {
    let [form, setForm] = useState({
        id: null,
        title: '',
        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0
    })
    let [response, setResponse] = useState({
        step: 20,
        count: 0,
        items: [],
    })

    let urlOwner = useRef('user')
    let urlOwnerId = useRef(props.user_id)
    if (props.group_id) {
        urlOwner.current = 'group'
        urlOwnerId.current = props.group_id
    }

    //отслеживаем изменение альбомов
    useEffect(async () => {
        await Get(true)

    }, [props.album_id])

    const onChangeFile = (e) => {
        let name = e.target.id;

        setForm(prev => ({
            ...prev, [name]: e.target.files[0]
        }))
    }

    const onChangeText = (e) => {
        let name = e.target.id;
        let value = e.target.value;

        setForm(prev => ({
            ...prev, [name]: value
        }))
    }

    const onChangeForm = (_id, name) => {
        setForm(prevState => ({
            ...prevState, ...{
                id: _id,
                title: name
            }
        }))
    }

    const Get = async (start) => {
        let offset = 0
        if (!start)
            offset = response.items.length

        let arFields = {
            params: {
                module: 'article',
                offset: offset,
                count: response.step
            }
        }

        if ((!props.group_id) && (!props.user_id)) { /* из url */
            if (props.group_id) arFields.params.group_id = props.match.params.id
            if (props.user_id) arFields.params.user_id = props.match.params.id
        } else {
            if (props.group_id) arFields.params.group_id = props.group_id
            if (props.user_id) arFields.params.user_id = props.user_id
        }

        //альбом существует
        if (props.album_id)
            arFields.params.album_id = props.album_id

        const url = `/api/album/get`

        let result = await axios.get(url, arFields)
        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setResponse(prev => ({...prev, ...{
                count: result.response.count,
                items: (start) ? result.response.items : [...prev.items, ...result.response.items],
                //users: [...prev.arUsers, ...result.response.users],
            }}))
    }

    const ElementAlbum = (_image_id, _video_id, video_title, video) => {
        let attributes = {
            controls: true,
            autoplay: 'autoplay',
            muted: 'muted',
            loop: 'loop'
        }

        return (<div className="row">
                    <div className="col-lg-12">
                        <ElementFile file={_image_id} attributes={attributes}/>
                    </div>
                    <div className="col-lg-12">
                        <Link to={`/${urlOwner.current}/${urlOwnerId.current}/article/${_video_id}`} className="">{video_title}</Link>
                        <p>
                            {<button type="button" className="btn btn-success btn-sm" onClick={() => onChangeForm(_video_id, video_title)}>Редактировать</button>}
                        </p>
                    </div>
                </div>)
    }

    const List = (arAlbums) => {
        return (
            <div className="row">
                { arAlbums.map(function (video, i) {
                    return <div className="col-md-4" key={i}>
                        <div className="card">
                            <div className="card-body">
                                {(form.id === video._id) ? ElementEdit() : ElementAlbum(video._image_id, video._id, video.title)}
                            </div>
                        </div>
                    </div>
                })}
            </div>
        )
    }

    const onFormSubmitFile = async (e) => {
        e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'article')

        const url = `/api/album/edit`
        const formData = new FormData()

        console.log(form)

        formData.append('id', form.id)
        formData.append('title', form.title)
        formData.append('gtoken', gtoken)

        //файл есть
        if (form.inputFileImg)
            formData.append('file_img', form.inputFileImg)

        //файл есть
        if (form.inputFileVideo)
            formData.append('file_video', form.inputFileVideo)

        axios.post(url, formData, {

            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function (progressEvent) {
                console.log(progressEvent)
                if (progressEvent.lengthComputable) {
                    let percentage = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
                    console.log(progressEvent.loaded + ' ' + progressEvent.total + ' ' + percentage);

                    if (percentage === 100) onChangeForm(null, '')

                    setForm(prev => ({...prev, ...{
                            processBarLoaded: progressEvent.loaded,
                            processBarTotal: progressEvent.total,
                            processBar: percentage
                        }}))

                }
                // Do whatever you want with the native progress event
            },

        })

        await Get()
    }

    const ElementEdit = () => {
        return <>
            <form onSubmit={onFormSubmitFile}>

                <div className="mb-3">
                    <label htmlFor="inputFile" className="form-label">Картинка (значек)</label>
                    <input className="form-control form-control-sm" id="inputFileImg" type="file" onChange={onChangeFile}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="inputFile" className="form-label">Видео (значек)</label>
                    <input className="form-control form-control-sm" id="inputFileVideo" type="file" onChange={onChangeFile}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="inputTitle" className="form-label">Название</label>
                    <input type="text" className="form-control" id="title"
                           onChange={onChangeText} value={form.title}/>
                </div>

                <div className="">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => onChangeForm(null, '')}>Отмена</button>
                    <button type="submit" className="btn btn-primary" >
                        Сохранить
                    </button>
                </div>

                <div className="progress">
                    {((form.processBar >0) && (form.processBar <100)) ? <div className="mb-3"><p className="text-primary">Загружаю</p></div>:null}
                    {(form.processBar === 100) ? <div className="mb-3"><p className="text-success">Загружено</p></div>:null}
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${form.processBar}%`}} aria-valuenow={form.processBar} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </form>
        </>
    }

    return (
        <>
            <AlbumAddModal user_id={props.user_id} group_id={props.group_id} module={'article'}/>

            <div className="row">
                <div className="col-lg-12 block-white">

                    <p className="h3">
                        {props.access ? <button type="button" className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#modalAlbumAdd">+</button> : null} Разделы со статьями
                    </p>

                    {(response.items.length) ? List(response.items) : <p>Разделов нет</p>}

                    {(response.items.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={()=>Get()}>еще разделы ...</button> : null}

                </div>
            </div>
            <hr />
        </>
    )
}
/*





* */
export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(AlbumArticle);

