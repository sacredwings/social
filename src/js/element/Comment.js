import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import CommentAdd from "./CommentAdd";
import axios from "axios";
import ElementFile from "../object/ElementFile";

function Comments (props) {
    //настройки запроса
    const count = 20 //количество элементов в запросе

    //запрос
    let [response, setResponse] = useState({
        offset: 0, //смещение для запроса
        count: 0, //количество записей в результате запроса
        items: [],
        arUsers: []
    })

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [])

    async function Get (start) {
        let module = props.module;
        let object_id = props.object_id;

        //запрос
        const url = `/api/comment/get?module=${module}&object_id=${object_id}&offset=${(start) ? 0 : response.offset}&count=${count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        setResponse(prev => ({
            offset: (start) ? count : prev.offset + count,
            count: result.response.count,
            items: (start) ? result.response.items : [...prev.items, ...result.response.items],
            arUsers: [...prev.arUsers, ...result.response.users],
        }))
    }

    const SearchUser = (id) => {
        for (let user of response.arUsers) {
            if (id === user.id) return user
        }

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

    const List = (comments) => {
        return (
            <>
                { comments.map(function (comment, i) {
                    comment.user = SearchUser(comment.from_id)
                    return ( <div className="row" key={i}>
                        <div className="col-lg-12" >
                            <ul className="list-unstyled">
                                <li className="media">
                                    <img src={comment.user.photo ? `${global.urlServer}/${comment.user.photo.url}` : "https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg"} className="mr-3" alt="..." style={{maxWidth: '64px', maxHeight: '64px', float: 'left'}}/>
                                    <div className="media-body" >
                                        <h5 className="mt-0 mb-1">{comment.user.first_name}</h5>
                                        <p> {comment.text}</p>
                                        <div className="row">
                                            {comment.file_ids ? ElementFiles(comment.file_ids) : null}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>)
                })}

                <div className="col-lg-12">
                    {(comments.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={() => {Get()}}>еще ...</button> : null}
                </div>
            </>
        )
    }

    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <hr/>
                    {List(response.items)}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <hr/>
                    {props.myUser.auth ? <CommentAdd module={props.module} object_id={props.object_id}/> : null}
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
)(Comments);

