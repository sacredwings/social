import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import VideoAddModal from "./VideoAddModal";
import ElementFile from "../objects/ElementFile";

function Video (props) {
    //запрос
    let [response, setResponse] = useState({
        offset: 0, //смещение для запроса
        count: 20, //количество элементов в запросе
        itemsCount: 0, //количество записей в результате запроса
        items: []
    })

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [props])

    const Get = async (start) => {

        let url = `/api/video/get?q=${props.q}owner_id=${props.ownerId}&offset=${(start) ? 0 : response.offset}&count=${response.count}`;

        //альбом существует
        if (props.album_id)
            url += `&album_id=${props.album_id}`

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

        let url = `/api/video/delete`;

        let result = await axios.post(url, {id: id});

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

    }

    const ListVideo = (arVideo) => {
        return (
            <div className="row">
                { arVideo.map(function (video, i, arVideo) {

                    return ( <div className="col-lg-6" key={i}>
                        <div className="card">
                            <div className="card-body">
                                <ElementFile file={video}/>
                                <p className="card-text">
                                    <Link to={`/video/id${video.id}`} >{video.title}</Link>
                                </p>
                            </div>

                        </div>
                    </div>)
                })}
            </div>
        )
    }

    return (
        <>
            <VideoAddModal owner_id={props.owner_id}/>

            <div className="row">
                <div className="col-lg-12 block-white">
                    <p className="h3">
                        {props.access ? <button type="button" className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#modalVideoAdd">+</button> : null}&#160;
                        {(props.mini) ? <Link to={linkUrl.current}>Все видео</Link> : 'Видео'}
                    </p>

                    {(response.items.length) ? ListVideo(response.items) : <p>Видео еще не загружено</p>}

                    {(response.items.length < response.itemsCount) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={()=>{Get()}}>еще видео ...</button> : null}

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
)(Video);