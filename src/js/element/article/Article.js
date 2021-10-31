import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import ArticleAdd from "../../element/AddArticle";
import ElementFile from "../../object/ElementFile";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import AlbumAddModal from "../AlbumAddModal";

function Article (props) {
    let [form, setForm] = useState({
        id: null,
        title: ',',
        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0
    })
    let [response, setResponse] = useState({
        step: 6,
        count: 0,
        items: [],
        users: []
    })

    //показ формы ввода
    let [formViewer, setFormViewer] = useState(false)
    let ownerId = useRef(Number (props.owner_id))
    let linkUrl = useRef(`/${props.owner}/id${(ownerId.current > 0) ? ownerId.current : -ownerId.current}/article`)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [props])

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

    const onChangeForm = (id, name) => {
        setForm(prevState => ({
            ...prevState, ...{
                id: id,
                title: name
            }
        }))
    }

    const Get = async (start) => {

        let offset = 0
        if (!start)
            offset = response.items.length

        let owner_id = props.owner_id; /* из прямой передачи */

        if (!props.owner_id) { /* из url */
            owner_id = props.match.params.id
            if (props.match.params.owner === 'group')
                owner_id = -owner_id
        }

        let fields = {
            params: {
                owner_id: owner_id,
                offset: offset,
                count: response.step,
            }
        }

        //альбом существует
        if (props.album_id)
            fields.params = fields.album_id

        let url = `/api/article/get`;

        let result = await axios.get(url, fields);
        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setResponse(prev => ({...prev, ...{
                count: result.response.count,
                items: (start) ? result.response.items : [...prev.items, ...result.response.items],
                //users: [...prev.arUsers, ...result.response.users],
            }}))
    }

    const ElementAlbum = (image_id, video_id, video_title, video) => {
        let owner = (props.owner_id>0) ? 'user' : 'group'
        let id = (props.owner_id>0) ? props.owner_id : -props.owner_id

        return (<div className="row">
            <div className="col-lg-4">
                <ElementFile file={image_id}/>
            </div>
            <div className="col-lg-8">
                <Link to={`/article/id${video_id}`} className="">{video_title}</Link>
                <p>
                    {<button type="button" className="btn btn-success btn-sm" onClick={() => onChangeForm(video_id, video_title)}>Редактировать</button>}
                </p>
            </div>
        </div>)
    }

    const List = (arAlbums) => {
        return (
            <div className="list-group">
                { arAlbums.map(function (video, i) {
                    return ( <div className="list-group-item list-group-item-action" key={i}>
                        {(form.id === video.id) ? ElementEdit() : ElementAlbum(video.image_id, video.id, video.title)}
                    </div>)
                })}
            </div>
        )
    }

    const onFormSubmitFile = async (e) => {
        e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'article')

        const url = '/api/article/edit';
        const formData = new FormData();

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
            <div className="row">
                <div className="col-lg-12 block-white">
                    <p className="h3">
                        {props.access ?
                            <button type="button" className="btn btn-success btn-sm" onClick={()=>{setFormViewer(!formViewer)}}>{(formViewer) ? `-` : `+`}</button>
                            : null
                        }&#160;
                        Статьи
                    </p>

                    {(props.access && formViewer)  ? <ArticleAdd owner_id={props.owner_id}/> : null}&#160;

                    {(response.items.length) ? List(response.items) : <p>Статей нет</p>}

                    {(response.items.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={()=>Get()}>еще ...</button> : null}

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
)(Article);

