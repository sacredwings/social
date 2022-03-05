import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {Link} from "react-router-dom";
import {ServerUrl} from '../util/proxy'

function Messages () {
    //настройки запроса
    const count = 1000 //количество элементов в запросе

    //запрос
    let [response, setResponse] = useState({
        offset: 0, //смещение для запроса
        count: 0, //количество записей в результате запроса
        items: [],
        arUsers: []
    })

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [])

    const Get = async (start) => {

        //запрос
        const url = `${ServerUrl()}/api/message/get?offset=${(start) ? 0 : response.offset + count}&count=${count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        setResponse(prev => ({
            offset: (start) ? 0 : prev.offset + count,
            count: result.response.count,
            items: (start) ? result.response.items : [...prev.items, ...result.response.items],
            arUsers: [...prev.arUsers, ...result.response.users],
        }))
    }

    const DeleteAll = async (user_id) => {

        let arFields = {
            user_id: user_id,
        }

        //запрос
        const url = `${ServerUrl()}/api/message/deleteAll`;

        let result = await axios.post(url, arFields);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку
    }

    const SearchUser = (id) => {
        for (let user of response.arUsers) {
            if (id === user.id) return user
        }
    }

    //подготовка текста сообщения
    const MessageInRead = (message) => {
        //входящие
        let result = <p>Вы: &crarr; {message.message}</p>

        if (message.in)
            result = <p>{message.message}</p>

        //чтение
        if (message.read)
            return result

        return <div className="alert alert-secondary" role="alert">
            {result}
        </div>

    }

    const result = (arMessages) => {
        return (
            <div className="row">
                <div className="col-lg-12">
                    {arMessages.map(function (message, i) {

                        //получить пользователя
                        message.user = SearchUser(message.user_id)
                        return <div key={i} className="list-group">
                            <div  className="list-group-item list-group-item-action" aria-current="true">

                                <div className="row">
                                    <div className="col-12">
                                        <div style={{
                                            maxHeight: '100px',
                                            maxWidth: '100px',
                                            float: 'left'
                                        }}>
                                            <img style={{maxHeight: '75px', maxWidth: '75px'}} src="https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg" alt="..."/>
                                        </div>
                                        <div style={{marginLeft: '100px'}}>
                                            <div>
                                                <b>{message.user.first_name}</b>
                                                <button style={{float: 'right'}} type="button" className="btn-close" aria-label="Close" onClick={()=>{DeleteAll(message.user.id)}}></button>
                                            </div>
                                            <Link to={`/messages/${message.user.id}`}>
                                                {MessageInRead(message)}
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    })}
                </div>
                <div className="col-lg-12">
                    {(arMessages.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={() => {Get()}}>еще ...</button> : null}
                </div>
            </div>

        )
    }

    return (
        <div className='row'>
            <div className='col-lg-12'>
                {result(response.items)}
            </div>
        </div>
    );
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(Messages);

