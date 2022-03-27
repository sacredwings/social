import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";


function InfoBlock (props) {

    const LikeAdd = async (id, paramDislike) => {
        props.objectEdit(id, paramDislike)

        let dislike = 0
        if (paramDislike)
            dislike = 1

        let arFields = {
            object_id: id,
            dislike: dislike,

            gtoken: await reCaptchaExecute(global.gappkey, 'like')
        }
        const url = `/api/like/add`

        let result = await axios.post(url, arFields)

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return
    }

    const Block = (object) => {
        let like = `light`
        let dislike = `light`
        if (object.like.my)
            like = `success`
        if (object.dislike.my)
            dislike = `warning`

        return <div className="alert alert-light" role="alert">
            <button type="button" className="btn btn-light" onClick={()=>LikeAdd(object._id, false)}>
                <i className="far fa-thumbs-up"></i>&nbsp;
                <span className={`badge bg-${like} text-dark`} >{object.like.count}</span>
            </button>&nbsp;
            <button type="button" className="btn btn-light" onClick={()=>LikeAdd(object._id, true)}>
                <i className="far fa-thumbs-down"></i>&nbsp;
                <span className={`badge bg-${dislike} text-dark`} >{object.dislike.count}</span>
            </button>
        </div>
    }

    return Block(props.object)
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(InfoBlock);

