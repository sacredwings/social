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
        return <>
            {arr.map(function (video, i, arGroup) {
                return ( <div className="" key={i}>
                    <div className="list-group">
                        <button type="button" className="list-group-item list-group-item-action" aria-current="true"
                                onClick={()=>{props.SelectVideoId(video.id)}}>
                            <div className="row">
                                <div className="col-md-4">
                                    <ElementFile file={video}/>
                                </div>
                                <div className="col-md-8">
                                    <p className="card-text">
                                        <Link to={`/video/id${video.id}`} >{video.title}</Link>
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>)
            })}
            {(response.items.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={() => Get()}>... загрузить еще ...</button> : null}
        </>
    }

    const NoList = () => {
        return <p className="no">Видео нет</p>
    }

    return (
        <div className="">

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