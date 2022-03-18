import React, {Component, useEffect, useState} from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { loadReCaptcha }  from 'recaptcha-v3-react-function-async';

import 'bootstrap'; // подключаем бутстрап
import "bootstrap/dist/css/bootstrap.min.css";

import '../sass/index.sass';
//import 'video-react/dist/video-react.css';

//import Processes from "./system/Processes";
import MenuTop from "./element/menu/Top";
import MenuLeft from "./element/menu/Left";
import Footer from "./element/Footer";

//элементы
import Auth from "./element/auth/Auth";
import Reg from "./element/auth/Reg";
import Video from "./page/video/Video";
import Article from "./page/article/Article";

//страницы
import Landing from "./page/Landing";
import Charity from "./page/Charity";
import User from "./page/user/User";
import Group from "./page/group/Group";
import Settings from "./page/user/Settings";
import NoPage from "./page/NoPage";
import MessagesUser from "./page/message/MessagesUser";
import Messages from "./page/message/Messages";
import GroupSettings from "./page/group/Settings";
//import GroupPay from "./page/group/Pay";
import RegActivate from "./page/RegActivate";
//import TopicId from "./page/TopicId";
//import Post from "./page/Post";
import VideoId from "./page/video/VideoId";
import ArticleId from "./page/article/ArticleId";
import Search from "./page/search/Search";
//import Friend from "./page/friend/friend";
//import VideoAll from "./page/video/Video";
import Embed from "./page/Embed"
import axios from "axios";

/*
import Reg from "./pages/Reg";
import Reset from "./pages/Reset";
import RegActive from "./pages/RegActive";
import ResetActive from "./pages/ResetActive";
import OAuthVK from "./pages/OAuthVK.js";
*/

window.$ = window.jQuery = require('jquery');

function App (props) {

    //для левого меню
    let [menuLeft, setMenuLeft] = useState({
        message: 0
    })

    useEffect(async () => {
        loadReCaptcha(
            global.gappkey,
        )
            .then(() => {
                console.log('ReCaptcha loaded')
            })
            .catch((e) => {
                console.error('Error when load ReCaptcha', e)
            })

        await getUser()
    }, [])

    const getUser = async () => {
        if (props.myUser.auth) return;

        try {
            let result = await axios.get(`/api/account/get`);

            if (result.data && result.data.response) {
                let response = result.data.response;
                props.login(response._id, response.login);

                setMenuLeft({
                    message: response.message
                })
            }

        } catch (err) {
        }
    }

    //страницы с авторизацией
    function pageAuth () {
        //массив
        let pages = [
            {path: '/settings', element: <Settings/>},
            {path: '/messages/:id', element: <MessagesUser/>},
            {path: '/messages', element: <Messages/>},
            {path: '/group/:id/settings', element: <GroupSettings/>},
            //{path: '/group/:id/settings/pay', element: <GroupPay/>},
            //{path: '/friends', element: <Friend/>},

        ];
        //формирование
        pages = pages.map(function (page, i) {
            return <Route exact key={i} path={page.path} element={page.element} />
        });
        //вывод
        return pages
    }
    //страницы без авторизации
    function pageNoAuth () {
        //массив
        let pages = [
            {path: '/auth', element: <Auth />},
            {path: '/reg', element: <Reg />},
            {path: '/reg-activate/:code', element: <RegActivate/>},

            /*
            {path: '/reg', component: Reg},
            {path: '/reg-active/:code', component: RegActive},
            {path: '/reset', component: Reset},
            {path: '/reset-active/:code', component: ResetActive},
            {path: '/ref/:ref', component: Landing},
            {path: '/oauth-vk', component: OAuthVK},

             */
        ];
        //формирование
        pages = pages.map(function (page, i) {
            return <Route key={i} path={page.path} element={page.element} />
        });
        //вывод
        return pages
    }

    function Social () {
        return <>
            <MenuTop/>

            {/* сайт */}
            <div className="container main" style={{maxWidth: '992px'}}>
                <div className="row">

                    {/* левое меню */}
                    <div className="col-lg-2">
                        <MenuLeft data={menuLeft}/>
                    </div>

                    {/* контент социальной сети */}
                    <div className="col-lg-10">
                        <Routes>
                            <Route path="/" element={<Landing />} />

                            <Route path="/user/:id" element={<User />} />
                            <Route path="/group/:id" element={<Group />} />

                            {/*<Route exact path="/topic/:id" element={<TopicId />} />*/}
                            <Route path="/article/:id" element={<ArticleId />} />

                            {<Route path="/video/:id" element={<VideoId />} />}
                            {/*<Route exact path="/video" element={<VideoAll />} />*/}

                            <Route path="/:owner/:id/video" element={<Video />} />
                            <Route path="/:owner/:id/video/:album_id" element={<Video />} />

                            <Route path="/:owner/:id/article" element={<Article />} />
                            <Route path="/:owner/:id/article/:album_id" element={<Article />} />

                            <Route path="/charity" element={<Charity />} />

                            <Route path="/search/" element={<Search />} />

                            {(props.myUser.auth) ? pageAuth() : pageNoAuth()}

                            <Route element={<NoPage />} />
                        </Routes>
                    </div>

                </div>
            </div>

            <Footer/>
        </>
    }

    function SocialNo () {
        return <>
            Нету
        </>
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Social />} />
                <Route path="/embed/video/:id" element={<Embed />} />
            </Routes>
        </BrowserRouter>
    )
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({
        login: (_id, login) => {
            dispatch({type: 'USER_LOGIN', _id: _id, login: login});
        },
        logout: () => {
            dispatch({type: 'USER_LOGOUT'});
        }
    })
)(App);
