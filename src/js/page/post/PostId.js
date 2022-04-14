import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from "axios"
import SelectAlbum from "../../object/SelectAlbum"
import Comment from "../../element/comment/Get"
import ElementFile from "../../object/ElementFile";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async"
import {useParams, Link} from 'react-router-dom'
import RichEditor from '../../object/RichEditor'
import LikeBlock from "../../element/like/Block";


function PostId (props) {
    const { id } = useParams()
    let [newContent, setNewContent] = useState('')

    let [video, setVideo] = useState(null)

    let [formEdit, setFormEdit] = useState(false)


    //отслеживаем изменение props
    useEffect(async () => {
        await Get()
        //await GetAlbums()
    }, [])

    //получаем результат выбранных альбомов от checked
    const ChangeSelectAlbums = (arSelectAlbums) => {
        setVideo(prev => ({...prev, arSelectAlbums: arSelectAlbums}))
    }

    const Get = async (event) => {
        //let id = id;

        const url = `/api/post/getById?ids=${id}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку
        if ((!result.response) || (!result.response[0])) return


        setVideo(prev => ({...prev, ...result.response[0]}))
    }

    const Element = (video) => {
        //оступ к объекту
        let access = false
        if (video.from_id === props.myUser._id)
            access = true

        return <>
            <div className="row">
                <div className="col-12">
                    <button type="button" className="btn btn-outline-secondary" onClick={onChangeForm}><i className="far fa-edit"></i></button>
                    <div dangerouslySetInnerHTML={{__html: video.text}}></div>
                    {video._file_ids ? ListFiles(video._file_ids) : null}
                </div>
            </div>
            <LikeBlock object={video} objectEdit={Like} article={'post'}/>
        </>
    }

    const ListFiles = (files) => {
        let attributes = {
            controls: true,
        }

        if (!files) return null

        let classFile = "col-lg-12"

        switch (files.length) {
            case 1:
                classFile = "col-lg-12"
                break;
            case 2:
                classFile = "col-lg-6"
                break;
            case 3:
                classFile = "col-lg-4"
                break;
            case 4:
                classFile = "col-lg-3"
                break;
            default:
                classFile = "col-lg-3"
        }

        return <>
            { files.map((file, i) => {
                return <div key={i} className={classFile}>
                    <ElementFile  file={file} attributes={attributes} link={true}/>
                </div>
            })}
        </>
    }

    const Like = async (id, dislike) => {

        const result = (prev) => {

            let arDislike = prev.dislike
            let arLike = prev.like

            if (!dislike) {
                arLike.my = !prev.like.my
                if (prev.like.my)
                    arLike.count ++
                else
                    arLike.count --

                if (prev.dislike.my) {
                    arDislike.my = !prev.dislike.my
                    arDislike.count --
                }
            } else {
                arDislike.my = !prev.dislike.my
                if (prev.dislike.my)
                    arDislike.count ++
                else
                    arDislike.count --

                if (prev.like.my) {
                    arLike.my = !prev.like.my
                    arLike.count --
                }
            }


            return {...prev, ...{
                    dislike: arDislike, like: arLike
                }}
        }

        setVideo(result)
    }

    const onChangeFile = (e) => {
        let name = e.target.id;

        setVideo(prev => ({
            ...prev, [name]:e.target.files[0]
        }))
    }

    const onChangeText = (e) => {
        let name = e.target.id;
        let value = e.target.value;

        setVideo(prev => ({
            ...prev, [name]: value
        }))
    }

    const onChangeForm = () => {
        setFormEdit(!formEdit)
    }

    const OnSave = async () => {
        await onFormSubmitFile()
    }

    const onFormSubmitFile = async (e) => {
        if (e)
            e.preventDefault() // Stop form submit

        onChangeForm()

        let gtoken = await reCaptchaExecute(global.gappkey, 'video')

        const url = `/api/post/edit`;
        const formData = new FormData();

        console.log(video)

        formData.append('id', video._id)
        formData.append('text', newContent) //новый контент
        formData.append('gtoken', gtoken)

        //файл есть
        if (video.inputFileImg)
            formData.append('file_img', video.inputFileImg)

        //альбомы выбраны
        if (video.arSelectAlbums.length)
            formData.append('albums', video.arSelectAlbums.join(','))

        axios.post(url, formData, {

            headers: {
                'Content-Type': 'multipart/form-data'
            },

        })

        setVideo(prev => ({...prev, text: newContent}))
        //await Get()
    }

    const onResult = (content) => {
        console.log(content)
        setNewContent(content)
    }

    const ElementEdit = (video) => {
        return <>
            <form onSubmit={onFormSubmitFile}>

                <div className="mb-3">
                    <label htmlFor="inputFileImg" className="form-label">Картинка (значек)</label>
                    <input className="form-control form-control-sm" id="inputFileImg" type="file" onChange={onChangeFile}/>
                    <ElementFile file={video._image_id} attributes={{controls: true}}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="" className="form-label">Альбомы</label>
                    {/* checked массив альбомов */}
                    <SelectAlbum albums={video.arAlbums} func={ChangeSelectAlbums}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Название</label>
                    <input type="text" className="form-control" id="title"
                           onChange={onChangeText} value={video.title}/>
                </div>

                <div className="mb-3">
                    <label className="form-label">Текст</label>
                    <RichEditor content={video.text} onResult={onResult} btnPosition={{top: true, right: true, bottom: true}} onSave={OnSave}/>
                </div>

                {/*
                <hr/>
                <h3>Результат</h3>
                <div dangerouslySetInnerHTML={{ __html: newContent }}></div>
                <br/>*/}
                {/*<div className="mb-3">
                    <label htmlFor="inputText" className="form-label">Описание</label>
                    <textarea className="form-control" id="text" rows="5"
                              onChange={onChangeText} value={video.text}></textarea>
                </div>*/}

                <div className="">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={onChangeForm}>Отмена</button>&nbsp;
                    <button type="submit" className="btn btn-primary btn-sm">
                        Сохранить
                    </button>
                </div>

            </form>
        </>
    }

    return (
        <div className="container article">
            <div className="row">
                <div className="col-lg-12 block">
                    {(video) ?
                        (formEdit) ? ElementEdit(video) : Element(video)
                        : null}
                </div>
            </div>
        </div>
    )
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(PostId);

