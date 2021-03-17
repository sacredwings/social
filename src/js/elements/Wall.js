import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import TopicAddModal from "../elements/TopicAddModal";
import ElementVideo from '../objects/Video';
import WallAddModal from "./WallAddModal";
import {ReCaptcha} from "react-top-recaptcha-v3";

function Wall (props) {
    let [recaptcha, setRecaptcha] = useState('')
    let [gtoken, setGtoken] = useState('')
    //запрос
    let [response, setResponse] = useState({
        offset: 0, //смещение для запроса
        count: 20, //количество элементов в запросе
        itemsCount: 0, //количество записей в результате запроса
        items: [],
        arUsers: []
    })

    //let [access, setAccess] = useState(false)
    let ownerId = useRef(Number (props.owner_id))
    let linkUrl = useRef(`/${props.owner}/id${(ownerId.current > 0) ? ownerId.current : -ownerId.current}/video`)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [props])

    const Get = async (start) => {

        let url = `/api/wall/get?owner_id=${ownerId.current}&offset=${(start) ? 0 : response.offset}&count=${response.count}`;

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
        await recaptcha.execute() /* сброс reCaptcha */

        let url = `/api/wall/delete`;

        let result = await axios.post(url, {id: id, gtoken: gtoken});

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

    }

    const ElementFiles = (files) => {
        return <>
            { files.map((file, i) => {

                //видео
                if (file.type === 'video/mp4')
                    return ( <div className="col-md-4" key={i}>
                        <video controls style={{width: '100%'}}>
                            <source src={`${global.urlServer}/${file.url}`} type={file.type} />
                        </video>
                    </div>)

                //картинка
                if ((file.type === 'image/gif') || (file.type === 'image/png') || (file.type === 'image/jpeg'))
                    return ( <div className="col-md-4" key={i}>
                        <img src={`${global.urlServer}/${file.url}`} style={{width: '100%'}}/>
                    </div>)

            })}
        </>
    }

    const ListVideo = (arVideo) => {
        return (
            <div className="row">
                { arVideo.map(function (item, i) {
                    return (<div className="card" key={i}>
                        <div className="card-body">
                            <button type="button" className="btn-close" aria-label="Close" style={{float: "right"}} onClick={() => {Delete(item.id)}}></button>
                            <p> {item.text}</p>
                            <div className="row">
                                {item.files ? ElementFiles(item.files) : null}
                            </div>
                        </div>
                    </div>)
                })}
            </div>
        )
    }

    return (
        <>
            <WallAddModal owner_id={props.owner_id}/>

            <ReCaptcha
                ref={ref => setRecaptcha(ref)}
                action='settings'
                sitekey={global.gappkey}
                verifyCallback={token => setGtoken(token)}
            />

            <div className="row">
                <div className="col-lg-12 block-white">
                    <p className="h3">
                        {props.access ? <button type="button" className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#modalWallAdd">+</button> : null}&#160;
                        {(props.link) ? <Link to={linkUrl.current}>Все видео</Link> : 'Стена'}
                    </p>

                    {(response.items.length) ? ListVideo(response.items) : <p>Стена пустая</p>}

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
)(Wall);

