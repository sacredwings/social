import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import axios from "axios"
import ArticleAdd from "../../element/AddArticle"
import ElementFile from "../../object/ElementFile"
import {reCaptchaExecute} from "recaptcha-v3-react-function-async"
import LikeBlockMini from "../like/BlockMini";
import Spoiler from "../../object/Spoiler"

function Article (props) {
    let [form, setForm] = useState({
        id: null,
        title: '',
        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0
    })
    let [response, setResponse] = useState({
        step: 200,
        count: 0,
        items: [],
        users: []
    })

    let [responseAlbum, setResponseAlbum] = useState(null)

    //показ формы ввода
    let [formViewer, setFormViewer] = useState(false)

    let urlOwner = useRef('user')
    let urlOwnerId = useRef(props.user_id)
    if (props.group_id) {
        urlOwner.current = 'group'
        urlOwnerId.current = props.group_id
    }
    let urlLink = useRef(`/${urlOwner.current}/${urlOwnerId.current}/article`)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением

        await GetById(props.album_id)
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

    const GetById = async (id) => {
        if (!id) {
            setResponseAlbum(null)
            return
        }

        let arFields = {
            params: {
                ids: id
            }
        }

        let url = `/api/album/getById`

        let result = await axios.get(url, arFields);
        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setResponseAlbum(result.response[0])
    }

    const Get = async (start) => {

        let offset = 0
        if (!start)
            offset = response.items.length

        let arFields = {
            params: {
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

        let url = `/api/article/get`

        let result = await axios.get(url, arFields)
        result = result.data
        if (result.err) return //ошибка, не продолжаем обработку

        if (!result.response) return

        setResponse(prev => ({...prev, ...{
                count: result.response.count,
                items: (start) ? result.response.items : [...prev.items, ...result.response.items],
                //users: [...prev.arUsers, ...result.response.users],
            }}))
    }

    const ElementAlbum = (arAlbums) => {
        if ((arAlbums) && (arAlbums.length))
            return arAlbums.map((item, i) => {
                let style = {
                    marginLeft: '3px'
                }
                return <span style={style} className="badge bg-info text-dark" key={i}>{item.title}</span>
            })

        return null
    }

    const ElementArticle = (_image_id, video_id, video_title, video) => {
        //let owner = (props.owner_id>0) ? 'user' : 'group'
        //let id = (props.owner_id>0) ? props.owner_id : -props.owner_id
        if (_image_id)
            return <div className="row">
                <div className="col-lg-4">
                    <ElementFile file={_image_id} attributes={{controls: true}}/>
                </div>
                <div className="col-lg-8">
                    <Link to={`/article/${video_id}`} dangerouslySetInnerHTML={{__html: video_title}}></Link>
                    {/*(props.access) ? <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => onChangeForm(video_id, video_title)}><i className="far fa-edit"></i></button> : null*/}
                    <br/>
                    {ElementAlbum(video._album_ids)}
                </div>
                <div className="col-lg-12">
                    <LikeBlockMini object={video}/>
                </div>
            </div>
        return <div className="row">
            <div className="col-lg-12">
                <Link to={`/article/${video_id}`} dangerouslySetInnerHTML={{__html: video_title}}></Link>
                {/*(props.access) ? <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => onChangeForm(video_id, video_title)}><i className="far fa-edit"></i></button> : null*/}
                <br/>
                {ElementAlbum(video._album_ids)}
            </div>
            <div className="col-lg-12">
                <LikeBlockMini object={video}/>
            </div>
        </div>
    }

    const List = (arAlbums) => {
        return (
            <div className="list-group">
                { arAlbums.map(function (video, i) {
                    return ( <div className="list-group-item list-group-item-action" key={i}>
                        {(form.id === video._id) ? ElementEdit() : ElementArticle(video._image_id, video._id, video.title, video)}
                    </div>)
                })}
            </div>
        )
    }

    const onFormSubmitFile = async (e) => {
        if (e)
            e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'article')

        const url = `/api/article/edit`
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
                    <button type="button" className="btn btn-secondary" onClick={() => onChangeForm(null, '')}>Отмена</button>
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
                    <div className="block white">
                        <p className="h3">
                            {props.access ?
                                <button type="button" className="btn btn-success btn-sm" onClick={()=>{setFormViewer(!formViewer)}}>{(formViewer) ? `-` : `+`}</button>
                                : null
                            }&#160;
                            &#160;{(responseAlbum) ? `Раздел: ${responseAlbum.title}` : 'Статья'}
                        </p>

                        {(responseAlbum) ? <ElementFile file={responseAlbum._image_id} attributes={{controls: true, autoplay: 'autoplay', muted: 'muted'}}/> : ''}
                    </div>
                    {(responseAlbum) ?

                        <div className="block white">
                            <p>Описание раздела</p>
                            <Spoiler height={400}>
                                <div dangerouslySetInnerHTML={{__html: responseAlbum.text}}></div>
                            </Spoiler>
                        </div>

                        : null}

                    {(props.access && formViewer)  ? <ArticleAdd group_id={props.group_id} user_id={props.user_id}/> : null}&#160;

                    {(response.items.length) ? List(response.items) : <p>Разделов нет</p>}

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

