import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import ElementMessageAdd from "../elements/MessageAdd";
import ElementFile from "../objects/ElementFile";

function Messages (props) {
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
    }, [props.match.params.id])

    const Delete = async (id) => {

        //удаляет из массива
        await ElementDelete(id)

        let arFields = {
            ids: id,
        }

        //запрос
        const url = `/api/message/delete`;

        let result = await axios.post(url, arFields);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку
    }

    const Get = async (start) => {

        //запрос
        let result = await axios.get(`/api/message/getByUserId?to_id=${props.match.params.id}&offset=${(start) ? 0 : response.offset}&count=${count}`);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        setResponse(prev => ({
            offset: (start) ? count : prev.offset + count,
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

    //удаляет из массива
    const ElementDelete = async (id) => {
        let items = response.items.filter((item, i)=>{
            if (id === item.id) return false
            return true
        })

        //обновляем
        setResponse(prev => ({... prev, items}))
    }

    //добавляет в массив
    const ElementAdd = async (arr) => {
        let arFields = {
            create_date: "",
            delete_from: null,
            delete_to: null,
            files: null,
            from_id: props.myUser.id,
            to_id: props.match.params.id,
            id: arr.id,
            important: null,
            in:false,
            message: arr.message,
            message_type: "P",
            read: null,
            user_id: props.myUser.id
        }

        //обновляем
        //обновляем
        setResponse(prev => ({
            ... prev,
            items: [
                ...prev.items,
                arFields
            ]
        }))
    }

    //подготовка текста сообщения
    const MessageInRead = (message) => {
        //входящие
        /*
        let result = <p>Вы: &crarr; {message.message}</p>

        if (message.in)
            result = <p>{message.message}</p>
        */

        let result = <p>{message.message}</p>

        //чтение
        if (message.read)
            return result

        return <div className="alert alert-secondary" role="alert">
            {result}
        </div>

    }

    //сортировка массива
    function compareNumericMessages(a, b) {
        if (a.id > b.id) return 1;
        if (a.id === b.id) return 0;
        if (a.id < b.id) return -1;
    }

    const ElementFiles = (files) => {

        if (!files) return null

        return <>
            { files.map((file, i) => {
                return <div key={i} className="col-md-4">
                    <ElementFile  file={file}/>
                </div>
            })}
        </>
    }

    const result = (arMessages) => {

        arMessages = arMessages.sort(compareNumericMessages);

        return (
            <div className="row">
                <div className="col-lg-12">
                    {(arMessages.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={() => {Get()}}>еще ...</button> : null}
                </div>
                <div className="col-lg-12">
                    {arMessages.map(function (message, i) {

                        //получить пользователя
                        message.user = SearchUser(message.from_id)

                        return <div key={i} className="list-group">
                            <div className="list-group-item list-group-item-action">
                                <div className="row">
                                    <div className="col-12">
                                        <div style={{
                                            maxHeight: '100px',
                                            maxWidth: '100px',
                                            float: 'left'
                                        }}>
                                            <img style={{maxHeight: '75px', maxWidth: '75px'}} src={message.user.photo ? `${global.urlServer}/${message.user.photo.url}` : "https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg"} alt="..."/>
                                        </div>
                                        <div style={{marginLeft: '100px'}}>
                                            <div>
                                                <b>{message.user.first_name}</b>
                                                {message.create_date}
                                                <button style={{float: 'right'}} type="button" className="btn-close" aria-label="Close" onClick={()=>{Delete(message.id)}}></button>
                                            </div>
                                            <div>
                                                {MessageInRead(message)}
                                            </div>
                                            <div className="row">
                                                {ElementFiles(message.file_ids)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>

        )
    }

    return (
        <>
            {console.log(response)}
            <div className='row'>
                <div className='col-lg-12'>
                    Сообщения пользователю id: {props.match.params.id}
                    {result(response.items)}
                </div>
            </div>
            <hr/>
            <div className='row'>
                <div className='col-lg-12'>
                    <ElementMessageAdd add={ElementAdd} user_id={props.match.params.id}/>
                </div>
            </div>
        </>
    );
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(Messages);

