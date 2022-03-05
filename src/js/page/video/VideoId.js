import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import SelectAlbum from "../../object/SelectAlbum";
import Comment from "../../element/Comment";
import ElementFile from "../../object/ElementFile";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import {useParams, Link} from 'react-router-dom'
import {ServerUrl} from '../../util/proxy'

function VideoId (props) {
    const { id } = useParams()
    let [video, setVideo] = useState({
        title: '',
        text: '',
        inputFilePreview: null,

        arSelectAlbums: [],

        response: {
            count: 0,
            items: []
        },
        count: 100,
        offset: 0,
        arAlbums: [],


    })

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

        const url = `${ServerUrl()}/api/video/getById?ids=${id}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку
        if ((!result.response) || (!result.response[0])) return


        setVideo(prev => ({...prev, ...result.response[0]}))
    }
/*
    const GetAlbums = async (start) => {
        const url = `/api/video/getAlbums?owner_id=${props.owner_id}&offset=${video.offset}&count=${video.count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setVideo(prev => ({...prev, ...{
                offset: (start) ? 0 : prev.offset + video.count,
                count: result.response.count,
                response: result.response,
                arAlbums: (start) ? result.response.items : [...prev.arAlbums, ...result.response.items],
            }}))
    }
*/
    const Element = (video) => {

        return <>
            <div className="row">
                <div className="col-12">
                    <h1>Видео <button type="button" className="btn btn-success btn-sm" onClick={onChangeForm}>Редактировать</button></h1>
                    <h2>{video.title}</h2>
                    <ElementFile file={video} attributes={{controls: true}}/>
                    <p>{video.text}</p>
                </div>
            </div>
            {/*
            <div className="row">
                <div className="col-12">
                    <Comment module='video' object_id={id}/>
                </div>
            </div>*/}
        </>
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

    const onFormSubmitFile = async (e) => {
        e.preventDefault() // Stop form submit

        onChangeForm()

        let gtoken = await reCaptchaExecute(global.gappkey, 'video')

        const url = `${ServerUrl()}/api/video/edit`;
        const formData = new FormData();

        console.log(video)

        formData.append('id', video.id)
        formData.append('title', video.title)
        formData.append('text', video.text)
        formData.append('gtoken', gtoken)

        //файл есть
        if (video.inputFilePreview)
            formData.append('file_preview', video.inputFilePreview)

        //альбомы выбраны
        if (video.arSelectAlbums.length)
            formData.append('albums', video.arSelectAlbums.join(','))

        //если это группа, то отправляем ее id
        if ((props.owner_id) && (props.owner_id<0))
            formData.append('group_id', -props.owner_id)

        axios.post(url, formData, {

            headers: {
                'Content-Type': 'multipart/form-data'
            },

        })

        await Get()
    }

    const ElementEdit = (video) => {
        return <>
            <form onSubmit={onFormSubmitFile}>

                <div className="mb-3">
                    <label htmlFor="inputFilePreview" className="form-label">Картинка (значек)</label>
                    <input className="form-control form-control-sm" id="inputFilePreview" type="file" onChange={onChangeFile}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="" className="form-label">Альбомы</label>
                    {/* checked массив альбомов */}
                    <SelectAlbum albums={video.arAlbums} func={ChangeSelectAlbums}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="inputTitle" className="form-label">Название</label>
                    <input type="text" className="form-control" id="title"
                           onChange={onChangeText} value={video.title}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputText" className="form-label">Описание</label>
                    <textarea className="form-control" id="text" rows="5"
                              onChange={onChangeText} value={video.text}></textarea>
                </div>


                <div className="">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onChangeForm}>Отмена</button>
                    <button type="submit" className="btn btn-primary" >
                        Сохранить
                    </button>
                </div>

            </form>
        </>
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
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
)(VideoId);

