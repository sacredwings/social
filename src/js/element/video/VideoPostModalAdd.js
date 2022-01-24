import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {Link} from "react-router-dom"
import axios from "axios"
import VideoAddModal from "../../element/video/VideoAddModal";
import ElementFile from "../../object/ElementFile";

function Group (props) {
    //запрос
    let [response, setResponse] = useState({
        step: 10,
        count: 0,
        items: [],
    })

    let urlOwner = useRef('user')
    let urlOwnerId = useRef(props.user_id)
    if (props.group_id) {
        urlOwner.current = 'group'
        urlOwnerId.current = props.group_id
    }
    let linkUrl = useRef(`/${urlOwner}/id${urlOwnerId}/video`)

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

        let result = await axios.get(url, arFields)

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
            {arr.map(function (video, i) {
                return ( <div className="" key={i}>
                    <div className="list-group">
                        <button type="button" className="list-group-item list-group-item-action" aria-current="true"
                                onClick={()=>{props.SelectVideoId(video._id)}}>
                            <div className="row">
                                <div className="col-md-4">
                                    <ElementFile file={video} attributes={{controls: true}}/>
                                </div>
                                <div className="col-md-8">
                                    <p className="card-text">
                                        {/*<Link to={`/video/id${video._id}`} >{video.title}</Link>*/}
                                        {video.title}
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