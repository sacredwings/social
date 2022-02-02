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

    let [listGroup, setListGroup] = useState([])
    let [ownerId, setOwnerId] = useState({
        user_id: props.myUser.id,
        group_id: null
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
        await GetGroup()
    }, [props])

    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [ownerId])

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

        if ((ownerId.group_id) && (!ownerId.user_id)) arFields.params.group_id = ownerId.group_id
        if ((!ownerId.group_id) && (ownerId.user_id)) arFields.params.user_id = ownerId.user_id

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

    const GetGroup = async () => {
        let arFields = {
            params: {
                user_id: props.user_id
            }
        }

        const url = `/api/group/get`

        let result = await axios.get(url, arFields);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setListGroup(result.response.items)
    }

    const ChangeId = (owner, id) => {
        if (owner === 'user')
            setOwnerId({
                user_id: id,
                group_id: null
            })

        if (owner === 'group')
            setOwnerId({
                user_id: null,
                group_id: id
            })

        console.log(owner)
        console.log(id)
    }
    const UserList = () => {
        return <div className="list-group">
            <button type="button" className="list-group-item list-group-item-action" onClick={()=>{ChangeId('user', props.myUser.id)}}>Мой профиль</button>
        </div>
    }
    const GroupList = () => {
        return <div className="list-group">
            {listGroup.map(function (item, i) {
                return <button key={i} type="button" className="list-group-item list-group-item-action" onClick={()=>{ChangeId('group', item._id)}}>{item.title}</button>
            })}
        </div>
    }

    const List = (arr) => {
        return <>
            <UserList/>
            <GroupList/>
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