import React, {Component, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import cookie from '../util/cookie';
import axios from "axios";
import {useParams, Link} from 'react-router-dom'

function Charity  (props) {
    const { id } = useParams()
    let [count, setCount] = useState({
        video: 0,
        user: 0
    })

    return (
        <div className="charity">
            <iframe
                src="https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=%D0%9D%D0%B0%20%D1%80%D0%B0%D0%B7%D0%B2%D0%B8%D1%82%D0%B8%D0%B5%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0&targets-hint=&default-sum=100&button-text=11&hint=&successURL=http%3A%2F%2Furpravovoen.ru%2Fnavigation%2F&quickpay=shop&account=4100110634652084"
                width="100%" height="223" frameBorder="0" allowtransparency="true" scrolling="no">
            </iframe>
        </div>
    )
}

export default connect (

)(Charity);

