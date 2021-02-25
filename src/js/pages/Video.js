import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import VideoAddModal from "../elements/VideoAddModal";
import ElementVideo from '../elements/Video';
import Album from "../elements/Album";

function Video (props) {
    //запрос
    let [response, setResponse] = useState({
        offset: 0, //смещение для запроса
        count: 20, //количество элементов в запросе
        itemsCount: 0, //количество записей в результате запроса
        items: [],
        arUsers: []
    })

    let access = useRef(props.access)
    let ownerId = useRef((props.match.params.owner === 'group') ? -props.match.params.id : props.match.params.id)

    //отслеживаем изменение props
    useEffect (async ()=>{

    }, [])

    return (
        <>
            <div className="row">
                <div className="col-lg-12 block-white">
                    {!props.match.params.album_id ? <Album access={access.current} owner_id={ownerId.current}/> : null}
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12 block-white">
                    <ElementVideo owner={props.match.params.owner} owner_id={ownerId.current} album_id={props.match.params.album_id} access={access.current}/>
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

