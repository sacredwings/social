import React, {Component, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import cookie from '../util/cookie';
import axios from "axios";
import {useParams, Link} from 'react-router-dom'


let style = {
    width: '100%'
}
function Landing  (props) {
    const { id } = useParams()
    let [count, setCount] = useState({
        //video: 0,
        //user: 0
    })

    //отслеживаем изменение props
    useEffect (async ()=>{
        await GetCount()
    }, [props.myUser._id])

    const GetCount = async () => {
        //let id = id;

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
                            <h1 className="">Социальная сеть для военнослужащих</h1>
                            <br/>
                            <p>Исключительно для военных</p>
                            <p>Анонимно</p>

                            <Link className="btn btn-warning" to="/charity" role="button"><i className="far fa-money-bill-alt"></i> Пожертвовать на развитие</Link>
                        </div>

                    </div>

                    <br/>
                    <hr/>
                    <br/>

                    <div className="row text-center">
                        <div className="col-lg-12">
                            <h2 className="">Как зарегистрироваться</h2>

                            <video controls={true} preload="preload" style={{width: '100%'}}>
                                <source src="https://voenset.ru/files/fc/8f/fc8fe2cdfabb4871fe5e5160ea27f4ba.mp4"
                                        type="video/mp4"/>
                            </video>

                            <Link className="btn btn-primary" to="/reg" role="button">Регистрация</Link>&nbsp;
                            <Link className="btn btn-primary" to="/auth" role="button">Вход</Link>

                        </div>

                    </div>

                    <br/>
                    <hr/>
                    <br/>

                    <div className="row text-center">
                        <div className="col-lg-12">
                            <h2 className="">Группа: Помощь военных юристов</h2>

                            <video preload="preload" autoPlay="autoplay" muted="muted" loop="loop" style={{width: '100%'}}>
                                <source src="http:\\urpravovoen.ru\wp-content\uploads\landing\обложка.mp4"
                                        type="video/mp4"/>
                            </video>

                            <Link className="btn btn-primary" to="/group/61a9fdb494f73f29366ecdde" role="button">Сайт</Link>&nbsp;
                            <Link className="btn btn-primary" to="/group/61a9fdb494f73f29366ecddf" role="button">Открытая группа</Link>

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
                            {/*<h5>Обсуждения <span className="badge bg-warning text-dark"> {count.topic}</span></h5>*/}
                        </div>

                    </div>

                    <br/>
                    <hr/>
                    <br/>

                    <div className="row text-center">
                        <div className="col-lg-12">
                            <h2 className="">Страница Военного юриста</h2>
                            <Link className="btn btn-primary" to="/user/61a9fdb194f73f29366e9c22" role="button">Страница в ВоенСети</Link>
                            <br/>
                            <br/>
                            <a className="btn btn-primary" href="https://vk.com/id271765283" role="button">Страница в ВК</a>
                        </div>
                    </div>

                    <br/>
                    <hr/>
                    <br/>

                    <div className="row text-center">
                        <div className="col-lg-12">
                            <h2 className="">Страница разработчика</h2>
                            <Link className="btn btn-primary" to="/user/61a9fdb194f73f29366e9c9d" role="button">Страница в ВоенСети</Link>
                            <br/>
                            <br/>
                            <a className="btn btn-primary" href="https://vk.com/sacredwings" role="button">Страница в ВК</a>
                        </div>

                    </div>

                    <br/>
                    <hr/>
                    <br/>

                    <div className="row" style={{width: 'max-content'}}>
                        <iframe
                            src="https://money.yandex.ru/quickpay/shop-widget?writer=seller&targets=%D0%9D%D0%B0%20%D1%80%D0%B0%D0%B7%D0%B2%D0%B8%D1%82%D0%B8%D0%B5%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0&targets-hint=&default-sum=100&button-text=11&hint=&successURL=http%3A%2F%2Furpravovoen.ru%2Fnavigation%2F&quickpay=shop&account=4100110634652084"
                            width="422" height="223" frameBorder="0" allowtransparency="true" scrolling="no">
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

