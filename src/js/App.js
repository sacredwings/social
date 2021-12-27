import React, {Component} from 'react';
import {connect} from "react-redux";
import { BrowserRouter, Routes, Route} from 'react-router-dom';
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
import Auth from "./element/Auth";
import Reg from "./element/Reg";
import Video from "./page/Video";
import Article from "./page/Article";

//страницы
import Landing from "./page/Landing";
import User from "./page/User";
import Group from "./page/Group";
import Settings from "./page/Settings";
import NoPage from "./page/NoPage";
import MessagesUserId from "./page/MessagesUserId";
import Messages from "./page/Messages";
import GroupSettings from "./page/GroupSettings";
import GroupPay from "./page/group/pay";
import RegActivate from "./page/RegActivate";
import TopicId from "./page/TopicId";
import Post from "./page/Post";
import VideoId from "./page/VideoId";
import ArticleId from "./page/ArticleId";
import Search from "./page/Search";
import Friend from "./page/friend/friend";
import VideoAll from "./page/video/Video";

/*
import Reg from "./pages/Reg";
import Reset from "./pages/Reset";
import RegActive from "./pages/RegActive";
import ResetActive from "./pages/ResetActive";
import OAuthVK from "./pages/OAuthVK.js";
*/

window.$ = window.jQuery = require('jquery');

class App extends Component {
    constructor () {
        super();
    }

    componentDidMount() {
        loadReCaptcha(
            global.gappkey,
        )
            .then(() => {
                console.log('ReCaptcha loaded')
            })
            .catch((e) => {
                console.error('Error when load ReCaptcha', e)
            })
    }

    //страницы с авторизацией
    pageAuth () {
        //массив
        let pages = [
            {path: '/settings', element: Settings},
            {path: '/messages/id:id', element: MessagesUserId},
            {path: '/messages', element: Messages},
            {path: '/group/id:id/settings', element: GroupSettings},
            {path: '/group/id:id/settings/pay', element: GroupPay},
            {path: '/friends', element: Friend},

        ];
        //формирование
        pages = pages.map(function (page, i) {
            return <Route exact key={i} path={page.path} element={page.element} />
        });
        //вывод
        return pages
    }
    //страницы без авторизации
    pageNoAuth () {
        //массив
        let pages = [
            {path: '/auth', element: Auth},
            {path: '/reg', element: Reg},
            {path: '/reg-activate/:code', element: RegActivate},

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

    render() {
        let auth = this.props.myUser.auth;
        return (
            <BrowserRouter>
                <MenuTop/>

                {/* сайт */}
                <div className="container main" style={{maxWidth: '992px'}}>
                    <div className="row">

                        {/* левое меню */}
                        <div className="col-lg-2">
                            <MenuLeft />
                        </div>

                        {/* контент социальной сети */}
                        <div className="col-lg-10">
                            <Routes>
                                <Route exact path="/" element={<Landing />} />

                                <Route exact path="/user/id:id" element={<User />} />
                                <Route exact path="/group/id:id" element={<Group />} />

                                <Route exact path="/topic/id:id" element={<TopicId />} />
                                <Route exact path="/video/id:id" element={<VideoId />} />
                                <Route exact path="/video" element={<VideoAll />} />

                                <Route exact path="/article/id:id" element={<ArticleId />} />

                                <Route exact path="/:owner/id:id/video" element={<Video />} />
                                <Route exact path="/:owner/id:id/video/album_id:album_id" element={<Video />} />

                                <Route exact path="/:owner/id:id/article" element={<Article />} />
                                <Route exact path="/:owner/id:id/article/album_id:album_id" element={<Article />} />


                                <Route exact path="/search/" element={<Search />} />

                                {(auth) ? this.pageAuth() : this.pageNoAuth()}

                                <Route element={<NoPage />} />
                            </ Routes >
                        </div>

                    </div>
                </div>

            <Footer/>
            </BrowserRouter>
        )};
}

export default connect (
    state => ({
        myUser: state.myUser,
    })
)(App);
