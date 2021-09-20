import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {Link} from "react-router-dom"
import axios from "axios"
import GroupAddModal from "../../element/GroupAddModal";

function Group (props) {
    //запрос
    let [response, setResponse] = useState({
        step: 6,
        count: 0,
        items: [],
    })

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

        const url = `/api/group/get?owner_id=${owner_id}&offset=${offset}&count=${response.step}`;

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
        return arr.map(function (group, i, arGroup) {
            return ( <div className="group" key={i}>
                <Link to={`/group/id${group.id}`}>
                    <div className="img">
                        <img src={group.photo ? `${global.urlServer}/${group.photo.url}` : "https://svgsilh.com/svg/479631.svg" } className="card-img-top" alt="..."/>
                    </div>
                </Link>

                <Link to={`/group/id${group.id}`}>{group.title}</Link>

            </div>)
        })
    }

    const NoList = () => {
        return <p className="no">Групп нет</p>
    }

    return (
        <div className="social block widget white">

            <div className="header">
                <h3>Группы</h3>
                <p className="count">{response.count}</p>
                {props.access ? <a type="button" href="#" className="add" data-bs-toggle="modal" data-bs-target="#modalGroupAdd">Создать</a> : null}
                <GroupAddModal />
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