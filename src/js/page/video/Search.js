import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import ElementFile from "../../object/ElementFile";

function Video (props) {
    //запрос
    let [response, setResponse] = useState({
        step: 30,
        count: 0,
        items: [],
        users: [],
        groups: []
    })

    let [search, setSearch] = useState('')

    //let [access, setAccess] = useState(false)
    let ownerId = useRef(Number (props.owner_id))
    let linkUrl = useRef(`/${props.owner}/${(ownerId.current > 0) ? ownerId.current : -ownerId.current}/video`)

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [props])

    const Get = async (start) => {
        let offset = 0
        if (!start)
            offset = response.items.length

        let owner_id = props.owner_id;
        const url = `/api/video/search?q=${search}&offset=${offset}&count=${response.step}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setResponse(prev => ({...prev, ...{
                count: result.response.count,
                items: (start) ? result.response.items : [...prev.items, ...result.response.items],
                users: [...prev.users, ...result.response.users],
                groups: [...prev.groups, ...result.response.groups],
            }}))
    }

    function onChangeSearchText(e) {
        let name = e.target.id;
        let value = e.target.value;

        setSearch(value)
    }

    async function onSearchSubmit (e) {
        e.preventDefault() // Stop form submit

        await Get(true)
    }

    const SearchOwner = (id) => {
        if (Number(id) > 0) {
            let user = SearchUser (id)
            return {
                type: 'user',
                img: user.photo ? `${global.urlServer}/${user.photo.url}` : "https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg",
                name: user.first_name,
                id: user.id
            }
        } else {
            let group = SearchGroup (id)
            return {
                type: 'group',
                img: group.photo ? `${global.urlServer}/${group.photo.url}` : "https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg",
                name: group.title,
                id: group.id
            }
        }
    }

    const SearchUser = (id) => {
        for (let user of response.users) {
            if (Number(id) === Number(user.id)) return user
        }
    }
    const SearchGroup = (id) => {
        for (let group of response.groups) {
            if (Number(id) === -Number(group.id)) return group
        }
    }

    const ListVideo = () => {
        return response.items.map(function (video, i, arVideo) {
            let owner = SearchOwner(video.owner_id)
            return ( <div className="col-lg-4" key={i}>
                <ElementFile file={video}/>

                <div className="footer">
                    <div className="owner">
                        <img src={owner.img}/>
                    </div>
                    <div className="name">
                        <p className="name-video">
                            <Link to={`/video/${video.id}`} >{video.title}</Link>
                        </p>
                        <p className="name-owner">
                            <Link to={`/${owner.type}/${owner.id}`} >{owner.name}</Link>
                        </p>
                    </div>
                </div>


            </div>)
        })

    }

    return (
        <div className="video">
            <div className="row search">
                <div className="col-lg-12">
                    <form className="row g-3" onSubmit={onSearchSubmit}>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Поиск" aria-label="Поиск" aria-describedby="button-addon2" value={search} onChange={onChangeSearchText}/>
                            <button className="btn btn-outline-secondary" type="submit" id="button-addon2">Найти
                            </button>
                    </div>
                    </form>

                </div>
            </div>
            <div className="row main">

                    {ListVideo()}

            </div>
        </div>
    )
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(Video);