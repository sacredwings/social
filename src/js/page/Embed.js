import React, {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom'
import {connect} from "react-redux";
import axios from "axios";

import ElementFile from "../object/ElementFile";
//import '../../sass/social.sass';

//props.match.params
function User (props) {
    let [file, setFile] = useState(null)
    const { id } = useParams()

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(id);
    }, [id])

    async function Get (id) {

        //запрос
        let result = await axios.get(`/api/video/getById?ids=${id}`, {});
        result = result.data;

        //ответ со всеми значениями
        if ((result) && (result.err === 0)) {

            if ((result.response) && (result.response[0]))
                setFile(result.response[0]);
            else
                setFile(false);

        }

    }

    function File () {
        let style = {
            maxHeight: '360px',
            maxWidth: '640px'
        }
        return (
            <div className="file">
                <video controls={true} style={style} preload="none" poster={`${global.urlServer}/${file._file_id.url}`} >
                    <source src={`${global.urlServer}/${file.url}`} type={file.type}/>
                </video>
            </div>
        )
    }

    return (
        <>
            {(file ? File() : null)}
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