import React, {Component, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import cookie from '../util/cookie';
import axios from "axios";

function Landing  (props) {
    let [count, setCount] = useState({
        video: 0,
        user: 0
    })

    //отслеживаем изменение props
    useEffect (async ()=>{
        await GetCount()
    }, [props.myUser.id])

    const GetCount = async () => {
        let id = props.match.params.id;

        const url = `/api/statistic/count`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку
        console.log(result.response)

        setCount(result.response)
    }

    return (
        <div className="landing">
            <div id="height">
                <div className="container">
                    <br/>
                    <br/>
                    <div className="row text-center">
                        <div className="col-lg-12">
                            <img src={`/logo_big.png`} style={{maxWidth: '100px'}}/>
                            <br/>
                            {/*<button type="button" className="btn btn-light">💵 ..поддержи проэкт.. 💵</button>*/}


                        </div>
                    </div>

                    <br/>
                    <hr/>
                    <br/>

                    <div className="row text-center">
                        <div className="col-lg-12">
                            <h1 className="">Социальная сеть для военнослужащих</h1>
                            <br/>
                            <p>Исключительно для военных</p>
                            <p>Создавайте и учавствуйте в обсуждениях</p>
                            <p>Бесплатно</p>
                            <p>Анонимно</p>
                        </div>

                    </div>

                    <br/>
                    <hr/>
                    <br/>

                    <div className="row text-center">
                        <div className="col-lg-12">
                            <h2 className="">Статистика по сайту</h2>
                            <h5>Пользователи <span className="badge bg-warning text-dark"> {count.user}</span></h5>
                            <h5>Группы <span className="badge bg-warning text-dark"> {count.group}</span></h5>
                            <h5>Видео <span className="badge bg-warning text-dark"> {count.video}</span></h5>
                            <h5>Статьи <span className="badge bg-warning text-dark"> {count.article}</span></h5>
                            <h5>Посты <span className="badge bg-warning text-dark"> {count.post}</span></h5>
                            <h5>Обсуждения <span className="badge bg-warning text-dark"> {count.topic}</span></h5>
                        </div>

                    </div>

                    <br/>
                    <hr/>
                    <br/>

                    <div className="row text-center">
                        <div className="col-lg-12">
                            <h2 className="">Страница разработчика</h2>
                            <p>Возник вопрос ?</p>
                            <a className="btn btn-primary" href="https://voenset.ru/user/id7" role="button">Перейти на страницу</a>
                        </div>

                    </div>

                    <br/>
                    <hr/>
                    <br/>

                    <div className="row text-center">
                        <div className="col-lg-12">
                            <img src={'https://avatars.mds.yandex.net/get-zen_doc/1583807/pub_5e58cf33baedf81f7d511363_5e58e391f8544a5bec015ab8/scale_1200'} style={{height: 150}}/>
                            <h2 className="">Новости сайта в телеграмм канале</h2>
                            <br/>
                            <a className="btn btn-primary" href="https://t.me/voenset" role="button">Перейти на канал</a>
                        </div>

                    </div>

                    <br/>
                    <hr/>
                    <br/>

                    <div className="row" style={{width: 'max-content'}}>
                        <iframe
                            src="https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=%D0%9D%D0%B0%20%D1%80%D0%B0%D0%B7%D0%B2%D0%B8%D1%82%D0%B8%D0%B5%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0&targets-hint=&default-sum=100&button-text=11&hint=&successURL=http%3A%2F%2Furpravovoen.ru%2Fnavigation%2F&quickpay=shop&account=4100110634652084"
                            width="422" height="223" frameBorder="0" allowTransparency="true" scrolling="no">
                        </iframe>
                    </div>
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
        Store_myUser: (login, tokenId, tokenKey, remember) => {
            dispatch({type: 'AUTH', login: login, tokenId: tokenId, tokenKey: tokenKey, remember: remember});
        }
    })
)(Landing);

