import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from "axios"
import MessageAdd from "../../element/message/MessageAdd"
import ElementFile from "../../object/ElementFile"
//import io from "../../util/websocket"
import {useParams} from "react-router-dom"

function Messages (props) {
    //настройки запроса
    const count = 20 //количество элементов в запросе

    //запрос
    let [response, setResponse] = useState({
        offset: 0, //смещение для запроса
        count: 0, //количество записей в результате запроса
        items: []
    })

    //запрос
    let [userList, setUserList] = useState(null)

    const params = useParams()

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [params.id])

    //отслеживаем изменение props
    useEffect (async ()=>{
    }, [])


    const Delete = async (id) => {

        //удаляет из массива
        await ElementDelete(id)

        let arFields = {
            id: id,
        }

        //запрос
        const url = `/api/message/delete`

        let result = await axios.post(url, arFields)

        result = result.data
        if (result.err) return //ошибка, не продолжаем обработку
    }

    const Get = async (start) => {
        let offset = 0
        if (!start)
            offset = response.items.length

        let arFields = {
            params: {
                to_id: params.id,
                offset: offset,
                count: count
            }
        }

        //запрос
        let result = await axios.get(`/api/message/getByUser`, arFields)

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        setResponse(prev => ({
            offset: (start) ? count : prev.offset + count,
            count: result.response.count,
            items: (start) ? result.response.items : [...prev.items, ...result.response.items],
        }))
    }

    const GetById = async (message) => {
        //запрос
        let result = await axios.get(`/api/message/getById?ids=${message._id}`);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        setResponse(prev => ({
            items: [...prev.items, ...result.response],
        }))
    }

    //удаляет из массива
    const ElementDelete = async (id) => {
        let items = response.items.filter((item, i)=>{
            if (id === item._id) return false
            return true
        })

        setResponse(prev => ({
            items: items
        }))
    }

    //добавляет в массив
    const ElementAdd = async (arr) => {
        console.log(arr)

        //await GetById(arr.id)
        /*
        let arFields = {
            create_date: "",
            delete_from: null,
            delete_to: null,
            files: null,
            from_id: props.myUser._id,
            to_id: props.match.params.id,
            id: arr.id,
            important: null,
            in:false,
            message: arr.message,
            message_type: "P",
            read: null,
            user_id: props.myUser._id
        }

        //обновляем
        //обновляем
        setResponse(prev => ({
            ... prev,
            items: [
                ...prev.items,
                arFields
            ]
        }))*/
    }

    //подготовка текста сообщения
    const StatusInRead = (message) => {
        let result = <div className="message" dangerouslySetInnerHTML={{__html: message.message}}></div>

        //чтение
        if (message.read)
            return result

        return <div className="alert alert-secondary" role="alert">
            {result}
        </div>

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

    const MessageList = (arMessages) => {

        //обратная сортировка сообщений
        arMessages = arMessages.sort((prev, next) => new Date(prev.create_date) - new Date(next.create_date))

        return (
            <div className="row">
                <div className="col-lg-12">
                    {(arMessages.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={() => {Get()}}>еще ...</button> : null}
                </div>
                <div className="col-lg-12">
                    <div className="list-group">
                        {arMessages.map(function (message, i) {

                            //чужое сообщение
                            message.my = false
                            message.user = message._to_id

                            //мое сообщение
                            if (props.myUser._id === message.from_id) {
                                message.my = true
                                message.user = message._from_id
                            }

                            //нет фото
                            let photo = 'https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg'
                            if ((message.user._photo) && (message.user._photo.url)) photo = `/${message.user._photo.url}` //есть фото

                            //формируем список
                            return <div key={i} className="list-group-item list-group-item-action">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="img">
                                            <img src={photo} alt="..."/>
                                        </div>
                                        <button style={{float: 'right'}} type="button" className="btn-close" aria-label="Close" onClick={()=>{Delete(message._id)}}></button>
                                        <p className="name"><b>{message.user.first_name}</b></p>
                                        <p className="date"><small>{message.create_date}</small></p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">

                                        <div className="row">
                                            {StatusInRead(message)}
                                        </div>
                                        <div className="row">
                                            {ElementFiles(message._file_ids)}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>

        )
    }

    return (
        <div className="container message-user">

            <div className="row">
                <div className="col-lg-12 block">
                    {MessageList(response.items)}
                </div>
            </div>

            <div className='row'>
                <div className='col-lg-12 block'>
                    <MessageAdd add={GetById} user_id={params.id}/>
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

