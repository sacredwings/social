import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import ElementFile from "../../object/ElementFile";
import PostAdd from "./PostAdd";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import VideoAddModal from "../VideoAddModal";

function Post (props) {
    //запрос
    let [response, setResponse] = useState({
        step: 10,
        count: 0,
        items: [],
        users: []
    })

    //показ формы ввода
    let [formViewer, setFormViewer] = useState(false)

    let ownerId = useRef(Number (props.owner_id))
    let linkUrl = useRef(`/${props.owner}/id${(ownerId.current > 0) ? ownerId.current : -ownerId.current}/video`)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [props])

    const Get = async (start) => {
        let offset = 0
        if (!start)
            offset = response.items.length

        let owner_id = props.owner_id;

        const url = `/api/post/get?owner_id=${owner_id}&offset=${offset}&count=${response.step}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setResponse(prev => ({...prev, ...{
                count: result.response.count,
                items: (start) ? result.response.items : [...prev.items, ...result.response.items],
                users: [...prev.users, ...result.response.users],
            }}))
    }

    const Delete = async (id) => {
        let gtoken = await reCaptchaExecute(global.gappkey, 'topic')

        let url = `/api/post/delete`;

        let result = await axios.post(url, {id: id, gtoken: gtoken});

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

    }

    const ListFiles = (files) => {

        if (!files) return null

        let classFile = "col-lg-12"

        switch (files.length) {
            case 1:
                classFile = "col-lg-12"
                break;
            case 2:
                classFile = "col-lg-6"
                break;
            case 3:
                classFile = "col-lg-4"
                break;
            case 4:
                classFile = "col-lg-3"
                break;
            default:
                classFile = "col-lg-3"
        }

        return <>
            { files.map((file, i) => {
                return <div key={i} className={classFile}>
                    <ElementFile  file={file}/>
                </div>
            })}
        </>
    }

    const SearchUser = (id) => {
        for (let user of response.users) {
            if (Number(id) === Number(user.id)) return user
        }

    }

    const List = (arVideo) => {
        return arVideo.map(function (item, i) {
            let user = SearchUser(item.from_id)

            let photo = 'https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg'
            if (user.photo)
                photo = `${global.urlServer}/${user.photo.url}`

            return (<div className="social block white">
                <button type="button" className="btn-close" aria-label="Close" style={{float: "right"}} onClick={() => {Delete(item.id)}}></button>
                <div className="header">
                    <div className="img">
                        <img src={photo}/>
                    </div>
                    <p className="name">
                        {user.first_name} {user.last_name}
                    </p>
                </div>

                <p> {item.text}</p>
                <div className="row">
                    {item.file_ids ? ListFiles(item.file_ids) : null}
                </div>

            </div>)
        })}

    const ListAdd = () => {
        return <div className="social block white add">
            <PostAdd owner_id={props.owner_id}/>
        </div>
    }

    return <div className="wall">
        {(props.access) ? ListAdd() : null}

        {(response.items.length) ? List(response.items) : null}
    </div>
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(Post);

