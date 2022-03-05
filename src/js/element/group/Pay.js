import React, {useState, useEffect, useReducer} from 'react';
import axios from "axios";
import {connect} from 'react-redux';
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import {useParams, Link} from 'react-router-dom'
import {ServerUrl} from '../../util/proxy'

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
        let result = await axios.post(`${ServerUrl()}/api/group/pay`, arFields)
        result = result.data

        if (result.response)
            window.location.assign(result.response);

    }

    return(
        <div className="alert alert-success" role=" alert">
            Доступ к группе 200 руб.
            <br/>

            <button type="button" className="btn btn-primary" onClick={Pay}>Оплатить</button>
        </div>
    )
}

export default connect (
)(Pay);