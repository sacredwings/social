import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import SelectAlbum from "../object/SelectAlbum";
import Comment from "../element/Comment";
import ElementFile from "../object/ElementFile";
import AlbumAddModal from "../element/AlbumAddModal";
import {Link} from "react-router-dom";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";

function AlbumVideo (props) {
    let [form, setForm] = useState({
        inputTitle: '',
        text: '',
        inputFile: null,
        id: null,

        response: {
            count: 0,
            items: []
        },
        count: 100,
        offset: 0,
        arAlbums: [],
    })

    let [formEdit, setFormEdit] = useState(null)
    let [formId, setFormId] = useState(null)

    //отслеживаем изменение props
    useEffect(async () => {
        await Get()
    }, [])

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

    const onChangeForm = (id) => {
        setFormEdit(id)
        setForm(prevState => ({
            ...prevState, ...{id: id}
        }))

    }

    const Get = async () => {
        let owner_id = props.owner_id; /* из прямой передачи */

        if (!props.owner_id) { /* из url */
            owner_id = props.match.params.id
            if (props.match.params.owner === 'group')
                owner_id = -owner_id
        }

        const url = `/api/video/getAlbums?owner_id=${owner_id}&offset=${form.offset}&count=${form.count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setForm(prevState => ({
            response: result.response,
            arAlbums: [...prevState.arAlbums, ...result.response.items],
            offset: prevState.offset + prevState.count
        }))
    }

    const ElementVideo = (image_id, video_id, video_title) => {
        let owner = (props.owner_id>0) ? 'user' : 'group'
        let id = (props.owner_id>0) ? props.owner_id : -props.owner_id

        return <>
            <img src={(image_id) ? `${global.urlServer}/${image_id.url}` : `https://elk21.ru/assets/images/34534535.jpg`} style={{width: '100%'}}/>
            <p className="card-text">
                <Link to={`/${owner}/id${id}/video/album_id${video_id}`} >{video_title}</Link>
            </p>
            <button type="button" className="btn btn-success btn-sm" onClick={() => onChangeForm(video_id)}>Редактировать</button>
        </>

    }

    const ListVideo = (arAlbums) => {
        return (
            <div className="row">
                { arAlbums.map(function (video, i, arAlbums) {

                    return ( <div className="col-md-3" key={i}>
                        <div className="card">
                            <div className="card-body">
                                {(formEdit === video.id) ? FormEdit(formId) : ElementVideo(video.image_id, video.id, video.title)}
                            </div>

                        </div>
                    </div>)
                })}
            </div>
        )
    }

    const onFormSubmitFile = async (e) => {
        e.preventDefault() // Stop form submit

        onChangeForm(null)

        let gtoken = await reCaptchaExecute(global.gappkey, 'video')

        const url = '/api/video/editAlbum';
        const formData = new FormData();

        console.log(form)

        formData.append('id', form.id)
        formData.append('title', form.inputTitle)
        //formData.append('text', form.text)
        formData.append('gtoken', gtoken)

        //файл есть
        if (form.inputFile)
            formData.append('file', form.inputFile)

        axios.post(url, formData, {

            headers: {
                'Content-Type': 'multipart/form-data'
            },

        })

        await Get()
    }

    const FormEdit = (album) => {
        return <>
            <form onSubmit={onFormSubmitFile}>

                Редактирование

                <div className="mb-3">
                    <label htmlFor="inputFile" className="form-label">Картинка (значек)</label>
                    <input className="form-control form-control-sm" id="inputFile" type="file" onChange={onChangeFile}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="inputTitle" className="form-label">Название</label>
                    <input type="text" className="form-control" id="inputTitle"
                           onChange={onChangeText} value={form.inputTitle}/>
                </div>

                <div className="">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => onChangeForm(null)}>Отмена</button>
                    <button type="submit" className="btn btn-primary" >
                        Сохранить
                    </button>
                </div>

            </form>
        </>
    }

    const Form = () => {
        return (
            <>
                <AlbumAddModal owner_id={props.owner_id}/>

                <div className="row">
                    <div className="col-lg-12 block-white">

                        <p className="h3">
                            {(props.access) ? <button type="button" className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#modalAlbumAdd">+</button> : null} Альбомы
                        </p>

                        {form.arAlbums.length ? ListVideo(form.arAlbums) : <p>Альбомов нет</p>}

                        {(form.arAlbums.length < form.response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={Get}>еще альбомы ...</button> : null}

                    </div>
                </div>

                <hr />
            </>
        )
    }

    return (
        Form()

    )
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(AlbumVideo);

