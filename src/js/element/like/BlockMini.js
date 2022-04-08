import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import Comment from '../comment/Get'

function InfoBlock (props) {
    const Block = (object) => {

        let like = `light`
        let dislike = `light`
        if (object.like.my)
            like = `success`
        if (object.dislike.my)
            dislike = `warning`

        return <div className="alert alert-light" role="alert">
            <i className="far fa-thumbs-up"></i>&nbsp;
            <span className={`badge bg-${like} text-dark`} >{object.like.count}</span>&nbsp;
            <i className="far fa-thumbs-down"></i>&nbsp;
            <span className={`badge bg-${dislike} text-dark`} >{object.dislike.count}</span>&nbsp;
            <i className="far fa-comment"></i>&nbsp;
            <span className={`badge bg-light text-dark`} >{object.comment.count}</span>&nbsp;
            <i className="far fa-eye"></i>&nbsp;
            <span className={`badge bg-light text-dark`} >{object.view.count}</span>
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

