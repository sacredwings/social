import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import ElementFile from "../object/ElementFile";
import PostAdd from "./post/PostAdd";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";

function Post (props) {
    //запрос
    let [response, setResponse] = useState({
        offset: 0, //смещение для запроса
        count: 20, //количество элементов в запросе
        itemsCount: 0, //количество записей в результате запроса
        items: [],
        arUsers: []
    })
    //показ формы ввода
    let [formViewer, setFormViewer] = useState(false)

    let ownerId = useRef(Number (props.owner_id))
    let linkUrl = useRef(`/${props.owner}/${(ownerId.current > 0) ? ownerId.current : -ownerId.current}/video`)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [props])

    const Get = async (start) => {

        let url = `/api/post/get?owner_id=${ownerId.current}&offset=${(start) ? 0 : response.offset}&count=${response.count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setResponse(prev => ({...prev, ...{
                offset: (start) ? response.count : prev.offset + response.count,
                itemsCount: result.response.count,
                items: (start) ? result.response.items : [...prev.items, ...result.response.items],
                arUsers: [...prev.arUsers, ...result.response.users],
            }}))
    }

    const Delete = async (id) => {
        let gtoken = await reCaptchaExecute(global.gappkey, 'topic')

        let url = `/api/post/delete`;

        let result = await axios.post(url, {id: id, gtoken: gtoken});

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

    }

    const ElementFiles = (files) => {

        if (!files) return null

        return <>
            { files.map((file, i) => {
                return <div key={i} className="col-md-4">
                    <ElementFile  file={file}/>
                </div>
            })}
        </>
    }

    const ListPost = (arVideo) => {
        return (
            <div className="row">
                { arVideo.map(function (item, i) {
                    return (<div className="card" key={i}>
                        <div className="card-body">
                            <button type="button" className="btn-close" aria-label="Close" style={{float: "right"}} onClick={() => {Delete(item.id)}}></button>
                            <p> {item.text}</p>
                            <div className="row">
                                {item.file_ids ? ElementFiles(item.file_ids) : null}
                            </div>
                        </div>
                    </div>)
                })}
            </div>
        )
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
                        {(props.link) ? <Link to={linkUrl.current}>Все видео</Link> : 'Стена'}
                    </p>

                    {(props.access && formViewer)  ? <PostAdd owner_id={props.owner_id}/> : null}&#160;

                    {(response.items.length) ? ListPost(response.items) : <p>Стена пустая</p>}

                    {(response.items.length < response.itemsCount) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={() => Get()}>еще ...</button> : null}

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
)(Post);

