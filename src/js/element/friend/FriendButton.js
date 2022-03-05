import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import {ServerUrl} from '../../util/proxy'

function FriendButton (props) {
    let [status, setStatus] = useState('none')

    //отслеживаем изменение props
    useEffect (async ()=>{
        await FriendStatus(props.user_id);
    }, [props.user_id])

    const logic = () => {
        switch (status) {
            case 'friend':
                return <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-primary btn-sm dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        Друг
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <li><a className="dropdown-item" href="#" onClick={()=>{FriendDelete(props.user_id)}}>Удалить из друзей</a></li>
                    </ul>
                </div>
            case 'in':
                return <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-primary btn-sm dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        Входящая заявка в друзья
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <li><a className="dropdown-item" href="#" onClick={()=>{FriendAdd(props.user_id)}}>Принять</a></li>
                        <li><a className="dropdown-item" href="#" onClick={()=>{FriendDelete(props.user_id)}}>Отклонить</a></li>
                    </ul>
                </div>
            case 'viewed':
                return <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-primary btn-sm dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        Вы отклонили заявку в друзья
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <li><a className="dropdown-item" href="#" onClick={()=>{FriendAdd(props.user_id)}}>Принять</a></li>
                    </ul>
                </div>
            case 'out':
                return <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-primary btn-sm dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        Исходящая заявка в друзья
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <li><a className="dropdown-item" href="#" onClick={()=>{FriendDelete(props.user_id)}}>Отменить</a></li>
                    </ul>
                </div>
            default:
                return <button type="submit" className="btn btn-primary btn-sm btn-block" onClick={()=>{FriendAdd(props.user_id)}}>Добавить в друзья</button>
        }
    }

    /* добавить в друзья */
    const FriendAdd = async (user_id) => {

        let gtoken = await reCaptchaExecute(global.gappkey, 'friend')

        let arFields = {
            user_id: props.user_id,

            gtoken: gtoken
        }

        const url = `${ServerUrl()}/api/friend/add`;

        let result = await axios.post(url, arFields);

        result = result.data;

        if (result.err) return; //ошибка, не продолжаем обработку

        setStatus(result.response)
    }

    /* удалить из друзей */
    const FriendDelete = async (user_id) => {

        let gtoken = await reCaptchaExecute(global.gappkey, 'friend')

        let arFields = {
            user_id: props.user_id,

            gtoken: gtoken
        }

        const url = `${ServerUrl()}/api/friend/delete`;

        let result = await axios.post(url, arFields);

        result = result.data;

        if (result.err) return; //ошибка, не продолжаем обработку

        setStatus(result.response)
    }

    const FriendStatus = async (user_id) => {

        let arFields = {
            params: {
                user_id: user_id
            }
        }

        const url = `${ServerUrl()}/api/friend/status`;

        let result = await axios.get(url, arFields);

        result = result.data;

        if (result.err) return; //ошибка, не продолжаем обработку

        setStatus(result.response)

    }

    return (
        logic()
    )
}


export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(FriendButton);

