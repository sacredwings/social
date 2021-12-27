import React, {useState, useEffect, useReducer} from 'react';
import axios from "axios";
import ElementMessageAddModal from "../element/MessageAddModal";
import ElementVideo from "../element/video/VideoBlock";
import ElementTopic from "../element/topic/TopicBlock";
import ElementPost from "../element/post/PostBlock";
import ElementArticle from "../element/article/ArticleBlock";
import {connect} from "react-redux";
import {useParams, Link} from 'react-router-dom'
import FriendButton from "../element/friend/FriendButton";
import ElementFile from "../object/ElementFile";

function User (props) {
    const { id } = useParams()
    let [user, setUser] = useState(null)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(id);
    }, [id])

    async function Get (groupId) {

        //запрос
        let result = await axios.get(`/api/group/getById?ids=${groupId}`, {});
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
        if (group.create_id === props.myUser.id) access = true //создатель это я

        let attributes = {
            autoplay: 'autoplay',
            muted: 'muted'
        }
        return (

            <div className="row user">
                <div className="col-lg-8">

                    <div className="social block white social_block_info">
                        <div className="row">
                            <div className="col-lg-12">
                                <ElementFile file={group._photo_big} attributes={attributes}/>
                            </div>

                            <div className="col-lg-12 block-white">
                                <h1 className="user-name">{group.title}</h1>

                            </div>
                        </div>
                    </div>

                    <ElementPost group_id={group._id} access={access}/>

                </div>
                <div className="col-lg-4">

                    {/* аватарка блок */}
                    <div className="social block" style={{padding: 0}}>

                        <div className="shadow">
                            <img  className="user-photo" src={user._photo ? `${global.urlServer}/${group._photo.url}` : "https://svgsilh.com/svg/479631.svg" }/>
                        </div>

                    </div>

                    {/* кнопки блок */}
                    <div className="social block" style={{padding: 0}}>
                        <div className="d-grid gap-2">
                            {(access ? <Link to={`/group/id${group._id}/settings`} type="button" className="btn btn-primary btn-sm btn-block">Настройки</Link> : null)}
                        </div>
                    </div>

                    <ElementVideo group_id={group._id} access={access}/>
                    <ElementArticle group_id={group._id} access={access}/>
                    <ElementTopic group_id={group._id} access={access}/>

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