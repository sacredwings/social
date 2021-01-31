import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import SearchUser from "../elements/SearchUser";
import axios from "axios";
import {Link} from "react-router-dom";
import ElementMessageAdd from "../elements/MessageAdd";

function Messages () {
    //настройки запроса
    const count = 20 //количество элементов в запросе

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
        const url = `/api/message/get`;

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
                {arMessages.map(function (message, i) {

                    //получить пользователя
                    message.user = SearchUser(message.user_id)
                    return <div key={i} className="list-group">
                        <Link to={`/messages/id${message.user.id}`} className="list-group-item list-group-item-action">
                            <div className="row">
                                <div className="col-12">
                                    <div style={{
                                        maxHeight: '100px',
                                        maxWidth: '100px',
                                        float: 'left'
                                    }}>
                                        <img style={{maxHeight: '100px', maxWidth: '100px'}} src="https://www.freelancejob.ru/upload/663/32785854535177.jpg" alt="..."/>
                                    </div>
                                    <div style={{marginLeft: '75px'}}>
                                        <div>
                                            <b>{message.user.first_name}</b>
                                            <button style={{float: 'right'}} type="button" className="close" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div>
                                            {MessageInRead(message)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                })}
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

