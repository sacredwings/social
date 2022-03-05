import React, {useState, useEffect} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import {ServerUrl} from '../../util/proxy'

export default function (props) {
    //настройки запроса
    const count = 20 //количество элементов в запросе

    let [q, setQ] = useState('')

    //запрос
    let [response, setResponse] = useState({
        step: 0, //смещение для запроса
        count: 0, //количество записей в результате запроса
        items: []
    })

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [props])

    async function Get (start) {
        let offset = 0
        if (!start)
            offset = response.items.length

        let arFields = {
            params: {
                q: q,
                offset: offset,
                count: response.step
            }
        }

        //запрос
        const url = `${ServerUrl()}/api/user/get`

        let result = await axios.get(url, arFields);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        setResponse(prev => ({
            count: result.response.count,
            items: (start) ? result.response.items : [...prev.items, ...result.response.items],
            //users: [...prev.arUsers, ...result.response.users],
        }))
    }

    function Result (result) {
        return <div className="row">

            <div className="col-lg-12">
                Пользователей найдено: <strong>{response.count}</strong>
                { result.map(function (item, i) {
                    return ( <div className="list-group" key={i}>
                        <Link to={`/user/${item.id}`} className="list-group-item list-group-item-action">
                            <img style={{maxHeight: '100px', maxWidth: '100px'}} src={(item.photo) ? `${global.urlServer}/${item.photo.url}` : "https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg"} />
                            {item.first_name}
                        </Link>
                    </div>)
                })}
            </div>

            <div className="col-lg-12">
                {(result.length < response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={() => {Get()}}>еще ...</button> : null}
            </div>

        </div>
    }

    return (
        <>
            {(response.items.length) ? Result(response.items) : <p>Пользователи не найдены</p>}
        </>
    );
}