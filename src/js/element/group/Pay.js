import React, {useState, useEffect, useReducer} from 'react';
import axios from "axios";
import {connect} from 'react-redux';
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import {useParams, Link} from 'react-router-dom'


function Pay (props) {

    //отслеживаем изменение props
    useEffect(async () => {
        //await Pay(id)
    }, [])

    async function Pay () {
        let gtoken = await reCaptchaExecute(global.gappkey, 'pay')

        let arFields = {
            group_id: props.group_id,

            gtoken: gtoken
        }

        //запрос
        let result = await axios.post(`/api/group/pay`, arFields)
        result = result.data

        if (result.response)
            window.location.assign(result.response);

    }

    return props.myUser.auth ?
        <div className="alert alert-success" role=" alert">
            Полный доступ к группе 200 руб./месяц
            <br/>
            <button type="button" className="btn btn-primary" onClick={Pay}>Оплатить</button>
        </div>
        :
        <div className="alert alert-warning" role=" alert">
            Авторизуйтесь для доступа к группе
            <br/>
            <Link to={`/auth`} className="btn btn-primary">Авторизация</Link>
        </div>
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(Pay);