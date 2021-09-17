import React, {useState, useEffect, useReducer} from 'react';
import axios from "axios";
import ElementMessageAddModal from "../element/MessageAddModal";
import ElementVideo from "../element/Video";
import ElementTopic from "../element/Topic";
import ElementGroup from "../element/group/GroupBlock";
import ElementPost from "../element/Post";
import ElementArticle from "../element/Article";
import FriendButton from "../element/friend/FriendButton";
import {connect} from "react-redux";
import '../../sass/social.sass';

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
            <div className="row"> {/* главнай класс */}
                <div className="col-lg-4">

                    {/* аватарка блок */}
                    <div className="social block" style={{padding: 0}}>

                        <div className="shadow">
                            <img  className="social_personal_photo" src={user.photo ? `${global.urlServer}/${user.photo.url}` : "https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg" }/>
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

                </div>

                {/* правый блок */}
                <div className="col-lg-8">

                    <div className="social block white social_block_info">
                        <div className="row">
                            <div className="col-lg-12 block-white">
                                <h1 className="social_name">{user.first_name} {user.last_name}</h1>

                            </div>
                        </div>
                    </div>


                    <div className="social block white">
                        <ElementVideo mini={true} owner={'user'} owner_id={userId} access={access}/>
                    </div>
                    <div className="social block white">
                        <ElementArticle mini={true} owner={'user'}  owner_id={userId} access={access}/>
                    </div>
                    <div className="social block white">
                        <ElementTopic mini={true} owner={'user'} owner_id={userId} access={access}/>
                    </div>
                    <div className="social block white">
                        <ElementPost mini={true} owner={'user'} owner_id={userId} access={access}/>
                    </div>



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