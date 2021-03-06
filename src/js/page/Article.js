import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import AlbumArticle from "../element/AlbumArticle";
import ElementArticle from "../element/Article";

const Access = async (props) => {

    if (props.match.params.owner === 'user')
        if (props.myUser.id === Number (props.match.params.id))
            return true
        else
            return false

    if (props.myUser.id === await AccessGroup(props.match.params.id))
        return true
    else
        return false

}

const AccessGroup = async (id) => {

    //запрос
    let result = await axios.get(`/api/group/getById?ids=${id}`, {});
    result = result.data;

    //ответ со всеми значениями
    if ((!result) || (result.err !== 0))
        return 0

    if (!result.response.length)
        return 0

    return result.response[0].create_id
}

function Article  (props) {

    //запрос
    let [response, setResponse] = useState({
        offset: 0, //смещение для запроса
        count: 20, //количество элементов в запросе
        itemsCount: 0, //количество записей в результате запроса
        items: [],
        arUsers: []
    })

    let [access, setAccess] = useState(false)

    let ownerId = useRef((props.match.params.owner === 'group') ? -props.match.params.id : props.match.params.id)

    //отслеживаем изменение props
    useEffect (async ()=>{
        setAccess(await Access(props))

        console.log('props.match.params.album_id')
        console.log(props.match.params.album_id)
    }, [props.myUser.id])

    return (
        <>
            <div className="row">
                <div className="col-lg-12 block-white">
                    <AlbumArticle access={access} owner_id={ownerId.current} album_id={props.match.params.album_id}/>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12 block-white">
                    <ElementArticle owner={props.match.params.owner} owner_id={ownerId.current} album_id={props.match.params.album_id} access={access}/>
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

