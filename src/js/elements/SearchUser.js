import React, {useState, useEffect} from 'react';
import SearchUser from "../elements/SearchUser";
import axios from "axios";
import {Link} from "react-router-dom";

export default function ({q}) {
    //настройки запроса
    const count = 2 //количество элементов в запросе

    //запрос
    let [response, setResponse] = useState({
        offset: 0, //смещение для запроса
        count: 0, //количество записей в результате запроса
        items: []
    })

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get()
    }, [q])

    async function Get () {
        //запрос
        const url = `/api/user/search?q=${q}&offset=${response.offset}&count=${count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        setResponse(prev => ({
            offset: prev.offset + count,
            count: result.response.count,
            items: [...prev.items, ...result.response.items]
        }))
    }

    function Result (result) {
        return <div className="row">

            <div className="col-lg-12">
                Найдено по запросу {response.count}
                { result.map(function (item, i) {
                    return ( <div className="list-group" key={i}>
                        <Link to={`/user/id${item.id}`} className="list-group-item list-group-item-action">
                            <img style={{maxHeight: '100px', maxWidth: '100px'}} src={(item.photo) ? item.photo : "https://www.freelancejob.ru/upload/663/32785854535177.jpg"} />
                            {item.first_name}
                        </Link>
                    </div>)
                })}
            </div>

            <div className="col-lg-12">
                {(result.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={Get}>еще ...</button> : null}
            </div>

        </div>
    }

    return (
        <>
            {(response.items.length) ? Result(response.items) : <p>Пользователи не найдены</p>}
        </>
    );
}