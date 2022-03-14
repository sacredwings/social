import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from "axios"
import {reCaptchaExecute} from "recaptcha-v3-react-function-async"
import AddFile from "../../object/AddFile"
import RichEditor from '../../object/RichEditor'
import { IO } from "../../util/websocket"

function MessageAdd (props) {
    let [message, setMessage] = useState('')
    let [fileIds, setFileIds] = useState('')

    useEffect (async ()=>{
        //console.log(IO.socket.Message.Add('61a9fdb194f73f29366e9bb5',))
    }, [])

    const ArFileIds = (arIds) => {
        setFileIds(arIds)
    }

    const onChangeText = (message) => {
        setMessage(message)
    }

    const onFormSubmit = async (e) => {
        e.preventDefault() // Stop form submit

        //IO.socket.Message()

        let gtoken = await reCaptchaExecute(global.gappkey, 'message')

        let arFields = {
            to_id: props.user_id,
            message: message,
            file_ids: fileIds,

            gtoken: gtoken
        }

        const url = `/api/message/add`;

        let result = await axios.post(url, arFields);

        result = result.data;

        if (result.err) return; //ошибка, не продолжаем обработку

        //добавление сообщения в список (в модульном окне нет этой функции)
        props.add({
            _id: result.response._id,
            message: message
        })

        //очистка формы
        setMessage('')
        setFileIds('')
    }

    return (
        <form onSubmit={onFormSubmit}>

            <div className="row">
                <div className="col-12">
                    <label htmlFor="message" className="form-label">Новое сообщение</label>
                    <RichEditor content={message} onResult={onChangeText} btnPosition={{top: true, right: true, bottom: false}} user_id={props.user_id} group_id={props.group_id}/>
                </div>
            </div>
            <br/>
            <div className="row">
                <div className="col-12">
                    <AddFile ArFileIds={ArFileIds}/>
                </div>
            </div>
            <br/>
            <div className="row">
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Отправить</button>
                </div>
            </div>


        </form>

    )
}


export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(MessageAdd);

