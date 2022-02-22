import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {Link} from "react-router-dom"
import axios from "axios"

function Friend (props) {
    //запрос
    let [response, setResponse] = useState({
        step: 20,
        count: 0,
        items: [],
        //users: []
    })

    //let [access, setAccess] = useState(false)
    //let ownerId = useRef(Number (props.owner_id))
    //let linkUrl = useRef(`/${props.owner}/${(ownerId.current > 0) ? ownerId.current : -ownerId.current}/video`)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [props])

    const Get = async (start) => {
        let offset = 0
        if (!start)
            offset = response.items.length

        let url = `/api/friend/get?offset=${offset}&count=${response.step}`

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
            {/* список */}
            <div className="list-group">
                { arr.map(function (item, i) {
                    return <a href="#" key={i} className="list-group-item list-group-item-action">
                        <div className="row">
                            <div className="col-sm-2">
                                <img src={(item.photo) ? `${global.urlServer}/${item.photo.url}` : "https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg"} style={{maxHeight: '100px', maxWidth: '100px'}}/>
                            </div>
                            <div className="col-sm-10">
                                <p>{item.first_name}</p>
                            </div>
                        </div>
                    </a>
                })}
            </div>

            {/* загрузить еще */}
            {(arr.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={()=>{Get()}}>еще...</button>: null}
        </>
    }

    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <h3>Друзья</h3>
                    {(response.items.length) ? List(response.items) : <p>Друзей нет</p>}

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
)(Friend);