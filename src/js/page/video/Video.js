import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {useParams, Link} from 'react-router-dom'
import axios from "axios";
import ElementVideo from '../../element/video/Video';
import AlbumVideo from "../../element/video/VideoAlbum";
import AlbumArticle from "../../element/article/ArticleAlbum";
import ElementArticle from "../../element/article/Article";
import ElementPay from "../../element/group/Pay";

/*
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
}*/

function Video  (props) {
    const params = useParams()
    let [owner, setOwner] = useState(null)

    //запрос
    let [response, setResponse] = useState({
        offset: 0, //смещение для запроса
        count: 20, //количество элементов в запросе
        itemsCount: 0, //количество записей в результате запроса
        items: [],
        arUsers: []
    })

    //let [access, setAccess] = useState(false)

    let userId = useRef((params.owner === 'user') ? params.id : null)
    let groupId = useRef((params.owner === 'group') ? params.id : null)

    //отслеживаем изменение props
    useEffect (async ()=>{
        if (params.owner === 'group') await Get(params.id)
    }, [params.id])

    async function Get (groupId) {

        //запрос
        let result = await axios.get(`/api/group/getById?ids=${groupId}`, {});
        result = result.data;

        //ответ со всеми значениями
        if ((result) && (result.err === 0)) {

            if ((result.response) && (result.response[0]))
                setOwner(result.response[0]);
            else
                setOwner(false);

        }

    }

    function Data () {
        return <>
            <div className="row">
                <div className="col-lg-12 block-white">
                    <AlbumVideo access={owner.status.access} user_id={userId.current} group_id={groupId.current} album_id={params.album_id}/>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12 block-white">
                    <ElementVideo access={owner.status.access} user_id={userId.current} group_id={groupId.current} album_id={params.album_id}/>
                </div>
            </div>
        </>
    }

    function Result () {
        let access = false
        let pay = false

        if (params.owner === 'group') {
            if (owner.status.access) access = true //создатель это я
            if ((owner.status.pay) || (owner.status.access)) pay = true //оплачено
        }

        return (pay) ? Data() : <ElementPay/>
    }

    return (owner) ? Result() : null
}

export default Video

