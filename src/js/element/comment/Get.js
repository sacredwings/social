import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import ElementFile from "../../object/ElementFile";
import CommentAdd from "./Add";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import RichEditor from "../../object/RichEditor";
//import Comment from "../Comment";
//import RichEditor from '../../object/RichEditor'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function Comment (props) {
    let [formCode, setFormCode] = useState(getRandomInt(0, 9999))

    //запрос
    let [response, setResponse] = useState({
        step: 30,
        count: 0,
        items: []
    })

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [props])

    const Get = async (start) => {
        let offset = 0
        if (!start)
            offset = response.items.length

        let arFields = {
            params: {
                offset: offset,
                count: response.step,
                module: props.module,
                object_id: props.object_id,
            }
        }

        const url = `/api/comment/get`

        let result = await axios.get(url, arFields)

        result = result.data
        if (result.err) return //ошибка, не продолжаем обработку

        if (!result.response) return

        setResponse(prev => ({...prev, ...{
                count: result.response.count,
                items: (start) ? result.response.items : [...prev.items, ...result.response.items],
            }}))
    }

    const Delete = async (id) => {
        let gtoken = await reCaptchaExecute(global.gappkey, 'post')

        let url = `/api/comment/delete`

        let result = await axios.post(url, {id: id, gtoken: gtoken})

        result = result.data
        if (result.err) return //ошибка, не продолжаем обработку

        if (!result.response) return

        let newList = []
        response.items.forEach(function(item, i, arr) {
            if (item._id !== id) {
                newList.push(item)
            }
        })

        setResponse(prev => ({...prev, ...{
                items: newList,
            }}))

    }

    const OnChecked = async (element) => {
        let newList = response.items.map(function(item, i, arr) {
            if (item._id === element._id) {
                item.checked = !item.checked
            }

            return item
        })
        setResponse(prev => ({...prev, ...{
                items: newList,
            }}))
    }

    const OnResult = (content, id) => {
        let newList = response.items.map(function(item, i, arr) {
            if (item._id === id) {
                item.text = content
            }

            return item
        })
        setResponse(prev => ({...prev, ...{
                items: newList,
            }}))
    }

    const OnSaveButton = async (id) => {
        await OnSave(id)
    }

    const OnSave = async (id) => {
        let element = null
        response.items.forEach(function(item, i, arr) {
            if (item._id === id) {
                element = item
            }
        })

        if (!element) return false
        await OnChecked(element)

        let arFields = {
            id: element._id,
            text: element.text,

            gtoken: await reCaptchaExecute(global.gappkey, 'post')
        }
        const url = `/api/comment/edit`

        let result = await axios.post(url, arFields)

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return
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

    const List = (arComment) => {
        return arComment.map(function (item, i) {

            let user = item._from_id

            let photo = 'https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg'
            if (user._photo)
                photo = `${global.urlServer}/${user._photo.url}`

            //доступ
            let access = false
            //коммент мой
            if (props.myUser._id === item.from_id)
                access = true
            //большой доступ
            if (props.access)
                access = true

            return (<div className="comment" key={i}>

                {(access) ? <button type="button" className="btn-close" aria-label="Close" style={{float: "right"}} onClick={() => {Delete(item._id)}}></button> : null}
                <div className="header">
                    <div className="img">
                        <img src={photo}/>
                    </div>
                    <p className="name">
                        {user.first_name} {user.last_name} {(access) ? <button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>OnChecked(item)}><i className="fas fa-edit"></i></button> : null}
                    </p>
                </div>
                {(item.checked) ?
                    <div>
                        <RichEditor content={item.text} id={item._id} onResult={OnResult} btnPosition={{top: true, right: true, bottom: true}} onSave={OnSaveButton}/>
                        <button type="button" className="btn btn-primary btn-sm" onClick={()=>OnSave(item._id)}>Сохранить</button>
                    </div>
                    : <div dangerouslySetInnerHTML={{__html: item.text}}></div>}
                <div className="row">
                    {item._file_ids ? ListFiles(item._file_ids) : null}
                </div>

            </div>)
        })}

    const Add = () => {
        return <div className="block add">
            {<CommentAdd module={props.module} object_id={props.object_id}/>}
        </div>
    }

    return <div className="">
        <br/>
        {(response.items.length) ? List(response.items) : null}

        {(response.items.length < response.count) ? <div className="d-grid gap-2"><button type="button" style={{marginTop: '10px'}} className="btn btn-outline-secondary btn-sm" onClick={()=>Get()}>еще ...</button></div> : null}

        {(true) ? Add() : null}

    </div>
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(Comment);

