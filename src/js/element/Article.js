import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import ArticleAdd from "../element/AddArticle";
import {ServerUrl} from '../util/proxy'

function Article (props) {
    //запрос
    let [response, setResponse] = useState({
        offset: 0, //смещение для запроса
        count: (props.mini) ? 4 : 20, //количество элементов в запросе
        itemsCount: 0, //количество записей в результате запроса
        items: [],
        arUsers: []
    })

    //показ формы ввода
    let [formViewer, setFormViewer] = useState(false)
    let ownerId = useRef(Number (props.owner_id))
    let linkUrl = useRef(`/${props.owner}/${(ownerId.current > 0) ? ownerId.current : -ownerId.current}/article`)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [props])

    const Get = async (start) => {

        let url = `${ServerUrl()}/api/article/get?owner_id=${ownerId.current}&offset=${(start) ? 0 : response.offset}&count=${response.count}`;

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

    const ListTopic = (arTopic) => {
        return (
            <div className="row">
                { arTopic.map(function (topic, i, arTopic) {
                    return ( <div className="list-group" key={i}>
                        <Link to={`/article/${topic.id}`} className="list-group-item list-group-item-action">{topic.title}</Link>
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
                        <>Последние добавленные статьи</>
                        <br/>
                        {(props.mini) ? <Link to={linkUrl.current}>Открыть все статьи</Link> : 'Статьи'}

                    </p>

                    {(props.access && formViewer)  ? <ArticleAdd owner_id={props.owner_id}/> : null}&#160;

                    {(response.items.length) ? ListTopic(response.items) : <p>Статей нет</p>}

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
)(Article);

