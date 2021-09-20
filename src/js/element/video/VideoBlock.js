import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {Link} from "react-router-dom"
import axios from "axios"
import VideoAddModal from "../../element/VideoAddModal";
import ElementFile from "../../object/ElementFile";

function Group (props) {
    //запрос
    let [response, setResponse] = useState({
        step: 2,
        count: 0,
        items: [],
    })

    let ownerId = useRef(Number (props.owner_id))
    let linkUrl = useRef(`/${props.owner}/id${(ownerId.current > 0) ? ownerId.current : -ownerId.current}/video`)

    //let [access, setAccess] = useState(false)
    //let ownerId = useRef(Number (props.owner_id))
    //let linkUrl = useRef(`/${props.owner}/id${(ownerId.current > 0) ? ownerId.current : -ownerId.current}/video`)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [props])

    const Get = async (start) => {
        let offset = 0
        if (!start)
            offset = response.items.length

        let owner_id = props.owner_id;

        const url = `/api/video/get?owner_id=${owner_id}&offset=${offset}&count=${response.step}`;

        let result = await axios.get(url);

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
                <ElementFile file={video}/>

                {/* <video controls style={{width: '100%'}} preload="none" poster={`${global.urlServer}/${video.file_id.url}`}>
                                    <source src={`${global.urlServer}/${video.url}`} type={video.type}/>
                                </video> */}

                <p className="card-text">
                    <Link to={`/video/id${video.id}`} >{video.title}</Link>
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
                <h3><Link to={linkUrl.current}>Видео</Link></h3>
                <p className="count">{response.count}</p>
                {props.access ? <a type="button" href="#" className="add" data-bs-toggle="modal" data-bs-target="#modalVideoAdd">Добавить</a> : null}
                <VideoAddModal />
            </div>


            <div className="row content">
                {(response.items.length) ? List(response.items) : NoList()}
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