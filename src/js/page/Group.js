import React, {useState, useEffect, useReducer} from 'react';
import axios from "axios";
import ElementMessageAddModal from "../element/MessageAddModal";
import ElementVideo from "../element/video/VideoBlock";
import ElementTopic from "../element/topic/TopicBlock";
import ElementPost from "../element/post/PostBlock";
import ElementArticle from "../element/article/ArticleBlock";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import FriendButton from "../element/friend/FriendButton";
import ElementFile from "../object/ElementFile";

function User (props) {
    let [user, setUser] = useState(null)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(props.match.params.id);
    }, [props.match.params.id])

    async function Get (userId) {

        //запрос
        let result = await axios.get(`/api/group/getById?ids=${userId}`, {});
        console.log(result)
        result = result.data;

        //ответ со всеми значениями
        if ((result) && (result.err === 0)) {

            if ((result.response) && (result.response[0]))
                setUser(result.response[0]);
            else
                setUser(false);

        }

    }

    function User(group) {

        let access = false
        if (Number (group.create_id) === Number (props.myUser.id)) access = true //создатель это я

        return (

            <div className="row user">
                <div className="col-lg-8">

                    <div className="social block white social_block_info">
                        <div className="row">
                            <div className="col-lg-12">
                                <ElementFile file={group.photo_big}/>
                            </div>

                            <div className="col-lg-12 block-white">
                                <h1 className="user-name">{group.title}</h1>

                            </div>
                        </div>
                    </div>

                    <ElementPost owner={'group'} owner_id={-group.id} access={access}/>

                </div>
                <div className="col-lg-4">

                    {/* аватарка блок */}
                    <div className="social block" style={{padding: 0}}>

                        <div className="shadow">
                            <img  className="user-photo" src={user.photo ? `${global.urlServer}/${group.photo.url}` : "https://svgsilh.com/svg/479631.svg" }/>
                        </div>

                    </div>

                    {/* кнопки блок */}
                    <div className="social block" style={{padding: 0}}>
                        <div className="d-grid gap-2">
                            {(access ? <Link to={`/group/settings_id${group.id}`} type="button" className="btn btn-primary btn-sm btn-block">Настройки</Link> : null)}
                        </div>
                    </div>

                    <ElementVideo owner_id={-group.id} access={access} owner={'group'}/>
                    <ElementArticle owner_id={-group.id} access={access} owner={'group'}/>
                    <ElementTopic owner_id={-group.id} access={access} owner={'group'}/>

                </div>

            </div>

        )
    }

    return (
        <>
            {(user ? User(user) : null)}
        </>
    );
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
)(User);