import {ReCaptcha} from 'recaptcha-v3-react';
import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";

function MessageAdd (props) {
    let [message, setMessage] = useState('')
    let [gtoken, setGtoken] = useState('')

    let recaptcha;

    const onChangeText = (e) => {
        setMessage(e.target.value)
    }

    const onFormSubmit = async (e) => {
        recaptcha.execute() /* сброс reCaptcha */
        e.preventDefault() // Stop form submit

        let user_id = props.user_id

        let arFields = {
            to_id: props.user_id,
            message: message,

            gtoken: gtoken
        }

        const url = `/api/message/add`;

        let result = await axios.post(url, arFields);

        result = result.data;

        if (result.err) return; //ошибка, не продолжаем обработку

        //добавление сообщения в список
        props.add({
            id: result.response.id,
            message: message
        })

        //очистка формы
        setMessage('')
    }

    return (
        <form onSubmit={onFormSubmit}>

            <ReCaptcha
                ref={ref => recaptcha = ref}
                action='settings'
                sitekey={global.gappkey}
                verifyCallback={token => setGtoken(token)}
            />

            <div className="row">
                <div className="col-12">
                    <label htmlFor="message" className="form-label">Новое сообщение</label>
                    <textarea className="form-control" id="message" rows="5" onChange={onChangeText} value={message}></textarea>
                </div>
            </div>
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

