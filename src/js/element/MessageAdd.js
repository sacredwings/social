import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import AddFile from "../object/AddFile";

function MessageAdd (props) {
    let [message, setMessage] = useState('')
    let [fileIds, setFileIds] = useState('')

    const ArFileIds = (arIds) => {
        setFileIds(arIds)
    }

    const onChangeText = (e) => {
        setMessage(e.target.value)
    }

    const onFormSubmit = async (e) => {
        e.preventDefault() // Stop form submit

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
            id: result.response.id,
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
                    <textarea className="form-control" id="message" rows="5" onChange={onChangeText} value={message}></textarea>
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

