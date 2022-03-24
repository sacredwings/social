import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import ElementFile from "../../object/ElementFile";
import PostAdd from "./PostAdd";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import RichEditor from '../../object/RichEditor'
import Comment from '../comment/Get'

function Post (props) {
    //запрос
    let [response, setResponse] = useState({
        step: 20,
        count: 0,
        items: [],
        users: []
    })

    //показ формы ввода
    //let [formViewer, setFormViewer] = useState(false)
    //let [newContent, setNewContent] = useState('')
    //let [listChecked, setListChecked] = useState([])

    let urlOwner = useRef('user')
    let urlOwnerId = useRef(props.user_id)
    if (props.group_id) {
        urlOwner.current = 'group'
        urlOwnerId.current = props.group_id
    }
    let urlLink = useRef(`/${urlOwner.current}/${urlOwnerId.current}/post`)

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
                count: response.step
            }
        }

        if ((props.group_id) && (!props.user_id)) arFields.params.group_id = props.group_id
        if ((!props.group_id) && (props.user_id)) arFields.params.user_id = props.user_id

        const url = `/api/post/get`;

        let result = await axios.get(url, arFields);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setResponse(prev => ({...prev, ...{
                count: result.response.count,
                items: (start) ? result.response.items : [...prev.items, ...result.response.items],
            }}))
    }

    const Delete = async (id) => {
        let gtoken = await reCaptchaExecute(global.gappkey, 'post')

        let url = `/api/post/delete`

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

    const SearchUser = (id) => {
        for (let user of response.users) {
            if (Number(id) === Number(user.id)) return user
        }

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
        const url = `/api/post/edit`

        let result = await axios.post(url, arFields)

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return
    }



    const List = (arVideo) => {
        return arVideo.map(function (item, i) {

            let user = item._from_id

            let photo = 'https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg'
            if (user._photo)
                photo = `${global.urlServer}/${user._photo.url}`

            return (<div className="block white" key={i}>

                <div className="row post">


                    <div className="header">
                        {(props.access) ? <button type="button" className="btn-close" aria-label="Close" style={{float: "right"}} onClick={() => {Delete(item._id)}}></button> : null}
                        <div className="img">
                            <img src={photo}/>
                        </div>
                        <p className="name">
                            {user.first_name} {user.last_name} {(props.access) ? <button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>OnChecked(item)}><i className="fas fa-edit"></i></button> : null}
                        </p>

                    </div>
                    {(item.checked) ?
                        <div>
                            <RichEditor content={item.text} id={item._id} onResult={OnResult} btnPosition={{top: true, right: true, bottom: true}}/>
                            <button type="button" className="btn btn-primary btn-sm" onClick={()=>OnSave(item._id)}>Сохранить</button>
                        </div>
                        : <div dangerouslySetInnerHTML={{__html: item.text}}></div>}
                    <div className="row">
                        {item._file_ids ? ListFiles(item._file_ids) : null}
                    </div>

                </div>

                <div className="row">
                    <Comment module={'post'} object_id={item._id} access={props.access}/>
                </div>

            </div>)
        })}

    const Add = () => {
        return <div className="block white add">
            <PostAdd user_id={props.user_id} group_id={props.group_id}/>
        </div>
    }

    return <div className="wall">
        {(props.access) ? Add() : null}

        {(response.items.length) ? List(response.items) : null}

        {/*(response.items.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={()=>Get()}>еще ...</button> : null*/}
        {(response.items.length < response.count) ? <div className="d-grid gap-2"><button type="button" style={{marginTop: '10px'}} className="btn btn-secondary btn-sm" onClick={()=>Get()}>еще ...</button></div> : null}
    </div>
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(Post);

