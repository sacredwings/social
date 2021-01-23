import React, {useState, useEffect, useReducer} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import ElementMessageAdd from "../elements/MessageAddModal";
import ElementVideo from "../elements/Video";
import ElementTopic from "../elements/Topic";
import ElementGroup from "../elements/Group";
import {connect} from "react-redux";

function User (props) {
    let [state, dispatch] = useReducer(null)
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

        let user_id = Number (userId);
        if (!user_id)
            user_id = this.props.myUser.id;

        let access = false
        if (user_id === props.myUser.id) access = true

        return (

            <div className="row">
                <div className="col-lg-3">

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="block-white">
                                <img  className="" style={{maxWidth: "100%", borderRadius: '10px'}} src={user.personal_photo ? `${global.urlServer}/${user.personal_photo.url}` : "https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg" }/>
                            </div>
                        </div>
                    </div>

                    {access ? null :
                        <div className="d-grid gap-2">
                            <button type="button" className="btn btn-primary btn-sm btn-block" data-bs-toggle="modal" data-bs-target="#modalMessageAdd">Написать сообщение</button>
                        </div>
                    }
                    <ElementMessageAdd user_id={userId}/>


                </div>
                <div className="col-lg-9">

                    <div className="row">
                        <div className="col-lg-12 block-white">
                            <h1 className="display-6">{user.first_name} {user.last_name}</h1>

                        </div>
                    </div>

                    <ElementVideo owner={'user'} owner_id={Number (props.match.params.id)} access={access}/>
                    <ElementTopic owner_id={Number (props.match.params.id)} access={access}/>
                    <ElementGroup owner_id={Number (props.match.params.id)} access={access}/>


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