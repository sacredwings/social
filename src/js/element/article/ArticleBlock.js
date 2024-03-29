import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {Link} from "react-router-dom"
import axios from "axios"

import ElementFile from "../../object/ElementFile";

function Group (props) {
    //запрос
    let [response, setResponse] = useState({
        step: 6,
        count: 0,
        items: [],
    })

    let urlOwner = useRef('user')
    let urlOwnerId = useRef(props.user_id)
    if (props.group_id) {
        urlOwner.current = 'group'
        urlOwnerId.current = props.group_id
    }
    let urlLink = useRef(`/${urlOwner.current}/${urlOwnerId.current}/article`)

    //отслеживаем изменение props
    useEffect (async ()=>{
        //await Get(true) //с обнулением
        await GetAlbum(true) //с обнулением

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

        if ((!props.group_id) && (!props.user_id)) { /* из url */
            if (props.group_id) arFields.params.group_id = props.match.params.id
            if (props.user_id) arFields.params.user_id = props.match.params.id
        } else {
            if (props.group_id) arFields.params.group_id = props.group_id
            if (props.user_id) arFields.params.user_id = props.user_id
        }

        let url = `/api/article/get`;
        //let url = `/api/article/get?owner_id=${owner_id}&offset=${offset}&count=${response.step}`;

        let result = await axios.get(url, arFields);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setResponse(prev => ({...prev, ...{
                count: result.response.count,
                items: (start) ? result.response.items : [...prev.items, ...result.response.items],
                //users: [...prev.arUsers, ...result.response.users],
            }}))
    }

    const List = (arr) => {
        let attributes = {
            controls: false,
            autoplay: 'autoplay',
            muted: 'muted',
            loop: 'loop'
        }

        return <div className="list-group" style={{paddingLeft: '10px'}}>
            {arr.map(function (article, i, arGroup) {
                return <Link to={`/${urlOwner.current}/${urlOwnerId.current}/article/${article._id}`} className="list-group-item list-group-item-action" key={i}>
                    <ElementFile file={article._image_id} attributes={attributes}/>
                    {article.title}
                </Link>})}
        </div>
    }

    const GetAlbum = async (start) => {
        let offset = 0
        if (!start)
            offset = response.items.length

        let arFields = {
            params: {
                module: 'article',
                offset: offset,
                count: response.step
            }
        }

        if ((props.group_id) && (!props.user_id)) arFields.params.group_id = props.group_id
        if ((!props.group_id) && (props.user_id)) arFields.params.user_id = props.user_id

        let url = `/api/album/get`
        //let url = `/api/article/get?owner_id=${owner_id}&offset=${offset}&count=${response.step}`;

        let result = await axios.get(url, arFields);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setResponse(prev => ({...prev, ...{
                count: result.response.count,
                items: (start) ? result.response.items : [...prev.items, ...result.response.items],
                //users: [...prev.arUsers, ...result.response.users],
            }}))
    }

    const NoList = () => {
        return <p className="no">Разделов нет</p>
    }

    return (
        <div className="social block widget white">

            <div className="header">
                <h3><Link to={urlLink.current}>Разделы сайта</Link></h3>
                <p className="count">{response.count}</p>
                {props.access ? <a type="button" href="#" className="add" >Добавить</a> : null}
                {/*<VideoAddModal />*/}
            </div>


            <div className="row content">
                {(response.items.length) ? List(response.items) : NoList()}
            </div>

            <div className="d-grid gap-2">
                <Link to={urlLink.current} className="btn btn-outline-secondary btn-sm" style={{margin: '5px'}}>Все разделы и статьи</Link>
            </div>
        </div>

    )
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(Group);