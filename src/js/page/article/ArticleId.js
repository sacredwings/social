import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from "axios"
import SelectAlbum from "../../object/SelectAlbum"
import ElementFile from "../../object/ElementFile";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async"
import {useParams, Link} from 'react-router-dom'
import RichEditor from '../../object/RichEditor'
import LikeBlock from "../../element/like/Block"
import Spoiler from "../../object/Spoiler"

function ArticleId (props) {
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
        console.log(arSelectAlbums)
        setVideo(prev => ({...prev, arSelectAlbums: arSelectAlbums}))
    }

    const Get = async (event) => {
        //let id = id;

        const url = `/api/article/getById?ids=${id}`;

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
                    {(access) ? <button type="button" className="btn btn-outline-secondary" onClick={onChangeForm}><i className="far fa-edit"></i></button> : null}
                    <h1 dangerouslySetInnerHTML={{__html: video.title}}></h1>
                    <ElementFile file={video._image_id} attributes={{controls: true}}/>
                    <br/>
                    <br/>
                    <Spoiler height={1500}>
                        <div dangerouslySetInnerHTML={{__html: video.text}}></div>
                    </Spoiler>
                </div>
            </div>
            <LikeBlock object={video} objectEdit={Like} module={'article'}/>
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

        const url = `/api/article/edit`
        const formData = new FormData()

        console.log(video)

        formData.append('id', video._id)
        formData.append('title', video.title)
        formData.append('text', video.text) //новый контент
        formData.append('gtoken', gtoken)

        //файл есть
        if (video.inputFileImg)
            formData.append('file_img', video.inputFileImg)

        //альбомы выбраны
        if ((video.arSelectAlbums) && (video.arSelectAlbums.length))
            formData.append('album_ids', video.arSelectAlbums)

        axios.post(url, formData, {

            headers: {
                'Content-Type': 'multipart/form-data'
            },

        })

        //setVideo(prev => ({...prev, text: newContent}))
        //await Get()
    }

    const onResult = (content) => {
        //setNewContent(content)
        setVideo(prev => ({...prev, text: content}))
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
                    <SelectAlbum albums={video._album_ids} module={'article'} user_id={video.to_user_id} group_id={video.to_group_id} func={ChangeSelectAlbums}/>
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
)(ArticleId);

