import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {Link} from "react-router-dom"
import axios from "axios"
import VideoAddModal from "./VideoAddModal";
import ElementFile from "../../object/ElementFile";

function Group (props) {
    //запрос
    let [response, setResponse] = useState({
        step: 2,
        count: 0,
        items: [],
    })

    let urlOwner = useRef('user')
    let urlOwnerId = useRef(props.user_id)
    if (props.group_id) {
        urlOwner.current = 'group'
        urlOwnerId.current = props.group_id
    }
    let urlLink = useRef(`/${urlOwner.current}/${urlOwnerId.current}/video`)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
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

        if ((props.group_id) && (!props.user_id)) arFields.params.group_id = props.group_id
        if ((!props.group_id) && (props.user_id)) arFields.params.user_id = props.user_id

        const url = `/api/video/get`

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
        return arr.map(function (video, i, arGroup) {
            return ( <div className="group" key={i}>
                <ElementFile file={video} attributes={{controls: true}}/>

                {/* <video controls style={{width: '100%'}} preload="none" poster={`${global.urlServer}/${video.file_id.url}`}>
                                    <source src={`${global.urlServer}/${video.url}`} type={video.type}/>
                                </video> */}

                <p className="card-text">
                    <Link to={`/video/${video._id}`} >{video.title}</Link>
                </p>

            </div>)
        })
    }

    const NoList = () => {
        return <p className="no">Видео нет</p>
    }

    return (
        <div className="social block widget white">

            <div className="header">
                <h3><Link to={urlLink.current}>Видео</Link></h3>
                <p className="count">{response.count}</p>
                {props.access ? <a type="button" href="#" className="add" data-bs-toggle="modal" data-bs-target="#modalVideoAdd">Добавить</a> : null}
                <VideoAddModal user_id={props.user_id} group_id={props.group_id}/>
            </div>

            <div className="row content">
                {(response.items.length) ? List(response.items) : NoList()}
            </div>

            <div className="d-grid gap-2">
                <Link to={urlLink.current} className="btn btn-outline-secondary btn-sm" style={{margin: '5px'}}>Все плейлисты и видео</Link>
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