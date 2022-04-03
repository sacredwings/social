import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {Link} from "react-router-dom";
import MessageAdd from "../../element/message/MessageAdd";
import {DateFormat} from "../../util/time";


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
    const StatusInRead = (chat) => {
        //достаем текст
        let message = chat._message_id.message
        //удаляем теги
        if (message)
            message = message.replace(/<[^>]+>/g,'')
        else
            message = ''

        //message = message.replace(/[^a-zA-Z ]/g, "")

        //обрезаем сообщение
        if (message.length > 50)
            message = `${message.substr(0, 50)} ...`
        else
            message = message.substr(0, 50)

        if (!chat._message_id.read)
            message = <div className="alert alert-secondary" role="alert">{message}</div>

        /*
        //чтение
        if (chat.read)
            return message
*/


        //достаем пользователя который не я
        chat.user = chat._user_ids[0]
        if (props.myUser._id !== chat._user_ids[0]._id)
            chat.user = chat._user_ids[1]

        //нет фото
        let photo = 'https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg'
        if ((chat.user._photo) && (chat.user._photo.url)) photo = `/${chat.user._photo.url}` //есть фото

        //без картинки
        if (chat._message_id.from_id !== props.myUser._id)
            return message

        return <div>
            <div className="img2">
                <img src={photo} alt="..."/>
            </div>
            <div className="message2">
                {message}
            </div>
        </div>

    }

    const ChatList = (arChat) => {
        return (
            <div className="row">
                <div className="col-lg-12">
                    {/*(arChat.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={() => {Get()}}>еще ...</button> : null*/}
                    {(arChat.length < response.count) ? <div className="d-grid gap-2"><button type="button" style={{marginTop: '10px'}} className="btn btn-outline-secondary btn-sm" onClick={()=>Get()}>еще ...</button></div> : null}
                </div>
                <div className="col-lg-12">
                    <div className="list-group">
                        {arChat.map(function (chat, i) {

                            //достаем пользователя который не я
                            chat.user = chat._user_ids[0]
                            if (props.myUser._id === chat._user_ids[0]._id)
                                chat.user = chat._user_ids[1]

                            //нет фото
                            let photo = 'https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg'
                            if ((chat.user._photo) && (chat.user._photo.url)) photo = `/${chat.user._photo.url}` //есть фото

                            return <Link to={`/messages/${chat.user._id}`} className="list-group-item list-group-item-action" key={i}>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="img">
                                            <img src={photo} alt="..."/>
                                        </div>
                                        <button style={{float: 'right'}} type="button" className="btn-close" aria-label="Close" onClick={()=>{DeleteAll(chat._id)}}></button>
                                        <p className="name"><b>{chat.user.first_name}</b> <small>{DateFormat(chat.change_date)}</small></p>

                                        <div className="message">{StatusInRead(chat)}</div>
                                    </div>
                                </div>

                            </Link>


                        })}
                    </div>
                </div>
                <div className="col-lg-12">
                    {(arChat.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={() => {Get()}}>еще ...</button> : null}
                </div>
            </div>

        )
    }

    return (
        <div className="container message">

            <div className="row">
                <div className="col-lg-12 block">
                    {ChatList(response.items)}
                </div>
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
)(Messages);

