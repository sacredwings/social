import React, {Component} from 'react';
import {connect} from "react-redux";
import {BrowserRouter as Router, Route, Redirect, Switch, Link} from 'react-router-dom';
import { loadReCaptcha }  from 'recaptcha-v3-react-function-async';

import 'bootstrap'; // подключаем бутстрап
import "bootstrap/dist/css/bootstrap.min.css";

import '../sass/style.sass';
//import 'video-react/dist/video-react.css';

//import Processes from "./system/Processes";
import TopMenu from "./elements/TopMenu";
import Footer from "./elements/Footer";
import LeftMenu from "./elements/LeftMenu";

//элементы
import Auth from "./elements/Auth";
import Reg from "./elements/Reg";
import Video from "./pages/Video";
import Article from "./pages/Article";

//страницы
import Landing from "./pages/Landing";
import User from "./pages/User";
import Group from "./pages/Group";
import Settings from "./pages/Settings";
import NoPage from "./pages/NoPage";
import MessagesUserId from "./pages/MessagesUserId";
import Messages from "./pages/Messages";
import GroupSettings from "./pages/GroupSettings";
import RegActivate from "./pages/RegActivate";
import TopicId from "./pages/TopicId";
import Post from "./pages/Post";
import VideoId from "./pages/VideoId";
import ArticleId from "./pages/ArticleId";
import Search from "./pages/Search";

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
            {path: '/settings', component: Settings},
            {path: '/messages/id:id', component: MessagesUserId},
            {path: '/messages', component: Messages},
            {path: '/group/settings_id:id', component: GroupSettings},
        ];
        //формирование
        pages = pages.map(function (page, i) {
            return <Route exact key={i} path={page.path} component={page.component} />
        });
        //вывод
        return pages
    }
    //страницы без авторизации
    pageNoAuth () {
        //массив
        let pages = [
            {path: '/auth', component: Auth},
            {path: '/reg', component: Reg},
            {path: '/reg-activate/:code', component: RegActivate},

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
            return <Route key={i} path={page.path} component={page.component} />
        });
        //вывод
        return pages
    }
/*
                        <Route path="/topic/id:id" component={Topic} />
                        <Route path="/post/id:id" component={Post} />
                        <Route path="/video/id:id" component={Video} />
 */
    render() {
        let auth = this.props.myUser.auth;
        return (
            <Router>
                <TopMenu/>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-2">
                            <LeftMenu />
                        </div>
                        <div className="col-lg-10">
                            <Switch>
                                <Route exact path="/" component={Landing} />

                                <Route exact path="/user/id:id" component={User} />
                                <Route exact path="/group/id:id" component={Group} />

                                <Route exact path="/topic/id:id" component={TopicId} />
                                <Route exact path="/video/id:id" component={VideoId} />
                                <Route exact path="/article/id:id" component={ArticleId} />

                                <Route exact path="/:owner/id:id/video" component={Video} />
                                <Route exact path="/:owner/id:id/video/album_id:album_id" component={Video} />

                                <Route exact path="/:owner/id:id/article" component={Article} />
                                <Route exact path="/:owner/id:id/article/album_id:album_id" component={Article} />

                                <Route exact path="/search/" component={Search} />

                                {(auth) ? this.pageAuth() : this.pageNoAuth()}

                                <Route component={NoPage} />
                            </ Switch >
                        </div>

                    </div>
                </div>

            <Footer/>
            </Router>
        )};
}

export default connect (
    state => ({
        myUser: state.myUser,
    })
)(App);
