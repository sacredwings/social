import React, {useState, useEffect, useReducer} from 'react';
import axios from "axios";
import ElementMessageAddModal from "../element/MessageAddModal";
import ElementVideo from "../element/video/VideoBlock";
import ElementTopic from "../element/topic/TopicBlock";
import ElementGroup from "../element/group/GroupBlock";
import ElementPost from "../element/post/PostBlock";
import ElementArticle from "../element/article/ArticleBlock";
import FriendButton from "../element/friend/FriendButton";
import {connect} from "react-redux";
import ElementFile from "../object/ElementFile";
//import '../../sass/social.sass';

function User (props) {
    let [user, setUser] = useState(null)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(props.match.params.id);
    }, [props.match.params.id])

    async function Get (userId) {

        //запрос
        let result = await axios.get(`/api/user/getById?ids=${userId}`, {});
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

    function User(userId) {

        userId = Number (userId);
        /*if (!user_id)
            user_id = props.myUser.id;*/

        let access = false
        if (userId === Number (props.myUser.id)) access = true

        return (
            <div className="row user"> {/* главнай класс */}

                <div className="col-lg-4">

                    {/* аватарка блок */}
                    <div className="social block" style={{padding: 0}}>

                        <div className="shadow">
                            <img  className="user-photo" src={user.photo ? `${global.urlServer}/${user.photo.url}` : "https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg" }/>
                        </div>

                    </div>

                    {/* кнопки блок */}
                    <div className="social block" style={{padding: 0}}>
                        {access ? null :
                            <>

                                <div className="d-grid gap-2">
                                    <button type="button" className="btn btn-primary btn-sm btn-block" data-bs-toggle="modal" data-bs-target="#modalMessageAdd">Написать сообщение</button>
                                    <FriendButton user_id={userId}/>
                                </div>

                            </>
                        }
                        <ElementMessageAddModal user_id={userId}/>

                    </div>

                    <ElementGroup owner_id={userId} access={access}/>
                    <ElementVideo owner_id={userId} access={access} owner={'user'}/>
                    <ElementArticle owner_id={userId} access={access} owner={'user'}/>
                    <ElementTopic owner_id={userId} access={access} owner={'user'}/>

                </div>

                {/* правый блок */}
                <div className="col-lg-8">

                    <div className="social block white social_block_info">
                        <div className="row">

                            <div className="col-lg-12">
                                <ElementFile file={user.photo_big}/>
                            </div>

                            <div className="col-lg-12 block-white">
                                <h1 className="user-name">{user.first_name} {user.last_name}</h1>

                            </div>
                        </div>
                    </div>

                    <ElementPost owner={'user'} owner_id={userId} access={access}/>

                </div>
            </div>

        )
    }

    return (
        <>
            {(user ? User(props.match.params.id) : null)}
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