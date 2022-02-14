import React, {Component, useEffect} from 'react';
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
//import MessagesUserId from "./page/MessagesUserId";
//import Messages from "./page/Messages";
import GroupSettings from "./page/group/Settings";
//import GroupPay from "./page/group/Pay";
import RegActivate from "./page/RegActivate";
//import TopicId from "./page/TopicId";
//import Post from "./page/Post";
import VideoId from "./page/video/VideoId";
import ArticleId from "./page/article/ArticleId";
import Search from "./page/Search";
//import Friend from "./page/friend/friend";
//import VideoAll from "./page/video/Video";
import Embed from "./page/Embed"

/*
import Reg from "./pages/Reg";
import Reset from "./pages/Reset";
import RegActive from "./pages/RegActive";
import ResetActive from "./pages/ResetActive";
import OAuthVK from "./pages/OAuthVK.js";
*/

window.$ = window.jQuery = require('jquery');

function App (props) {

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
    }, [])

    //страницы с авторизацией
    function pageAuth () {
        //массив
        let pages = [
            {path: '/settings', element: <Settings/>},
            //{path: '/messages/id:id', element: <MessagesUserId/>},
            //{path: '/messages', element: <Messages/>},
            {path: '/group/id:id/settings', element: <GroupSettings/>},
            //{path: '/group/id:id/settings/pay', element: <GroupPay/>},
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

    const All = () => {
        return <>
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
                            <Route path="/" element={<Landing />} />

                            <Route path="/user/id:id" element={<User />} />
                            <Route path="/group/id:id" element={<Group />} />

                            {/*<Route exact path="/topic/id:id" element={<TopicId />} />*/}
                            <Route path="/article/id:id" element={<ArticleId />} />

                            {<Route path="/video/id:id" element={<VideoId />} />}
                            {/*<Route exact path="/video" element={<VideoAll />} />*/}

                            <Route path="/:owner/id:id/video" element={<Video />} />
                            <Route path="/:owner/id:id/video/album_id:album_id" element={<Video />} />

                            <Route path="/:owner/id:id/article" element={<Article />} />
                            <Route path="/:owner/id:id/article/album_id:album_id" element={<Article />} />

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

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/embed/:type/:id" element={<Embed />} />
                <Route path="*" element={<All />} />
            </Routes>

        </BrowserRouter>
    )

/*
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
            {path: '/settings', element: <Settings/>},
            //{path: '/messages/id:id', element: <MessagesUserId/>},
            //{path: '/messages', element: <Messages/>},
            {path: '/group/id:id/settings', element: <GroupSettings/>},
            {path: '/group/id:id/settings/pay', element: <GroupPay/>},
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
    pageNoAuth () {
        //массив
        let pages = [
            {path: '/auth', element: <Auth />},
            {path: '/reg', element: <Reg />},
            {path: '/reg-activate/:code', element: <RegActivate/>},


            //{path: '/reg', component: Reg},
            //{path: '/reg-active/:code', component: RegActive},
            //{path: '/reset', component: Reset},
            //{path: '/reset-active/:code', component: ResetActive},
            //{path: '/ref/:ref', component: Landing},
            //{path: '/oauth-vk', component: OAuthVK},

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


                <div className="container main" style={{maxWidth: '992px'}}>
                    <div className="row">


                        <div className="col-lg-2">
                            <MenuLeft />
                        </div>


                        <div className="col-lg-10">
                            <Routes>
                                <Route exact path="/" element={<Landing />} />

                                <Route exact path="/user/id:id" element={<User />} />
                                <Route exact path="/group/id:id" element={<Group />} />

                                {<Route exact path="/topic/id:id" element={<TopicId />} />}
                                <Route exact path="/article/id:id" element={<ArticleId />} />

                                {<Route exact path="/video/id:id" element={<VideoId />} />}
                                {Route exact path="/video" element={<VideoAll />} />}

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
        )};*/
}

export default connect (
    state => ({
        myUser: state.myUser,
    })
)(App);
