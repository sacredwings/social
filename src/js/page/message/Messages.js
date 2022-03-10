import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {Link} from "react-router-dom";


function Messages (props) {
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
        const url = `/api/message/getChat?offset=${(start) ? 0 : response.offset + count}&count=${count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        setResponse(prev => ({
            offset: (start) ? 0 : prev.offset + count,
            count: result.response.count,
            items: (start) ? result.response.items : [...prev.items, ...result.response.items],
        }))
    }

    const DeleteAll = async (user_id) => {

        let arFields = {
            user_id: user_id,
        }

        //запрос
        const url = `/api/message/deleteAll`;

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

    const result = (arChat) => {
        return (
            <div className="row">
                <div className="col-lg-12">
                    {arChat.map(function (chat, i) {

                        //достаем пользователя который не я
                        let user = chat._user_ids[0]
                        if (props.myUser._id === chat._user_ids[0]._id)
                            user = chat._user_ids[1]

                        return <div key={i} className="list-group">
                            <Link to={`/messages/${user._id}`} className="list-group-item list-group-item-action">

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
                                                <button style={{float: 'right'}} type="button" className="btn-close" aria-label="Close" onClick={()=>{DeleteAll(user._id)}}></button>
                                                <p><b>{user.first_name}</b></p>
                                                <p>{chat._message_id.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </Link>
                        </div>

                    })}
                </div>
                <div className="col-lg-12">
                    {(arChat.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={() => {Get()}}>еще ...</button> : null}
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

