import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import TopicAdd from "../element/TopicAdd";
import ElementFile from "../object/ElementFile";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";

function Topic (props) {
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

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [props])

    const Get = async (start) => {

        let url = `/api/topic/get?owner_id=${ownerId.current}&offset=${(start) ? 0 : response.offset}&count=${response.count}`;

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

    const ListTopic = (arTopic) => {
        return (
            <div className="row">
                { arTopic.map(function (topic, i, arTopic) {
                    return ( <div className="list-group" key={i}>
                        <Link to={`/topic/${topic.id}`} className="list-group-item list-group-item-action">{topic.title}</Link>
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
                        {/*(props.link) ? <Link to={linkUrl.current}>Все видео</Link> : 'Стена'*/}
                        Обсуждения
                    </p>

                    {(props.access && formViewer)  ? <TopicAdd owner_id={props.owner_id}/> : null}&#160;

                    {(response.items.length) ? ListTopic(response.items) : <p>Обсуждений нет</p>}

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
)(Topic);

