import React, {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom'
import {connect} from "react-redux";
import axios from "axios";

import MessageAddModal from "../../element/message/MessageAddModal";
import ElementVideo from "../../element/video/VideoBlock";
//import ElementTopic from "../element/topic/TopicBlock";
import ElementGroup from "../../element/group/GroupBlock";
import ElementPost from "../../element/post/PostBlock";
import ElementArticle from "../../element/article/ArticleBlock";
import {DateFormat, DateFormatUser} from '../../util/time'
//import FriendButton from "../element/friend/FriendButton";

import ElementFile from "../../object/ElementFile";
//import '../../sass/social.sass';

//props.match.params
function User (props) {
    let [user, setUser] = useState(null)
    const { id } = useParams()

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(id);
    }, [id])

    async function Get (userId) {

        //запрос
        let result = await axios.get(`/api/user/getById?ids=${userId}`, {});
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

        //userId = Number (userId);
        /*if (!user_id)
            user_id = props.myUser._id;*/

        let access = false
        if (userId === props.myUser._id) access = true

        let attributes = {
            autoplay: 'autoplay',
            muted: 'muted',
            loop: 'loop'
        }
        return (
            <div className="row user"> {/* главнай класс */}
                <div className="col-lg-4">

                    {/* аватарка блок */}
                    <div className="social block" style={{padding: 0}}>

                        <div className="shadow">
                            <img  className="user-photo" src={user._photo ? `${global.urlServer}/${user._photo.url}` : "https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg" }/>
                        </div>

                    </div>

                    {/* кнопки блок */}
                    <div className="social block" style={{padding: 0}}>
                        {access ? null :
                            <>

                                <div className="d-grid gap-2">
                                    <MessageAddModal user_id={userId}/>
                                    <button type="button" className="btn btn-primary btn-sm btn-block" data-bs-toggle="modal" data-bs-target="#modalMessageAdd">Написать сообщение</button>
                                    {/*<FriendButton user_id={userId}/>*/}
                                </div>

                            </>
                        }
                        {/*<ElementMessageAddModal user_id={userId}/>*/}

                    </div>

                    <ElementGroup user_id={userId} access={access}/>
                    <ElementVideo user_id={userId} access={access}/>
                    <ElementArticle user_id={userId} access={access}/>
                    {/*<ElementTopic user_id={userId} access={access}/>*/}

                </div>

                {/* правый блок */}
                <div className="col-lg-8">

                    <div className="social block white social_block_info">
                        <div className="row">

                            <div className="col-lg-12">
                                {<ElementFile file={user._photo_big} attributes={attributes}/>}
                            </div>

                            <div className="col-lg-12 block-white">
                                <p className="online">{DateFormatUser(user.last_action_date)}</p>
                                <h1 className="user-name">{user.first_name} {user.last_name}</h1>
                            </div>
                        </div>
                    </div>

                    <ElementPost user_id={userId} access={access}/>

                </div>
            </div>

        )
    }

    return (
        <>
            {(user ? User(id) : null)}
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