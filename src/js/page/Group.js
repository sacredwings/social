import React, {useState, useEffect, useReducer} from 'react';
import axios from "axios";
import ElementMessageAddModal from "../element/MessageAddModal";
import ElementVideo from "../element/Video";
import ElementTopic from "../element/Topic";
import ElementGroup from "../element/Group";
import ElementPost from "../element/Post";
import ElementArticle from "../element/Article";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

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
        if (group.create_id === props.myUser.id) access = true //создатель это я

        return (

            <div className="row">
                <div className="col-lg-9">
                    <div className="row">
                        <div className="col-lg-12 block-white">
                            <h1 className="display-6">{group.title}</h1>

                        </div>
                    </div>

                    <ElementVideo mini={true} owner={'group'} owner_id={-group.id} access={access}/>
                    <ElementArticle mini={true} owner={'group'} owner_id={-group.id} access={access}/>
                    <ElementTopic mini={true} owner={'group'} owner_id={-group.id} access={access}/>
                    <ElementPost mini={true} owner={'group'} owner_id={-group.id} access={access}/>

                </div>
                <div className="col-lg-3">

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="block-white">
                                <img style={{maxWidth: "100%", borderRadius: '10px'}} src={group.photo ? `${global.urlServer}/${group.photo.url}` : "https://svgsilh.com/svg/479631.svg" }/>
                            </div>
                        </div>
                    </div>
                    <div className="d-grid gap-2">
                        {(access ? <Link to={`/group/settings_id${group.id}`} type="button" className="btn btn-primary btn-sm btn-block">Настройки</Link> : null)}
                    </div>


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