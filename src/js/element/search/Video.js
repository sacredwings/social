import React, {useState, useEffect} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import ElementFile from "../../object/ElementFile";


export default function ({q}) {
    //настройки запроса
    const count = 4 //количество элементов в запросе

    //запрос
    let [response, setResponse] = useState({
        offset: 0, //смещение для запроса
        count: 0, //количество записей в результате запроса
        items: []
    })

    //отслеживаем изменение props
    useEffect (async ()=>{
        await Get(true) //с обнулением
    }, [q])

    async function Get (start) {
        //запрос
        const url = `/api/video/get?q=${q}&offset=${(start) ? 0 : response.offset}&count=${count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        setResponse(prev => ({
            offset: (start) ? count : prev.offset + count,
            count: result.response.count,
            items: (start) ? result.response.items : [...prev.items, ...result.response.items]
        }))
    }
//<img style={{maxHeight: '100px', maxWidth: '100px'}} src={(item.photo) ? `${global.urlServer}/${item.photo.url}` : "https://www.freelancejob.ru/upload/663/32785854535177.jpg"} />
    function Result (result) {
        return <div className="row">

            <div className="col-lg-12">
                Видео найдено: <strong>{response.count}</strong>
                { result.map(function (item, i) {
                    return ( <div className="list-group" key={i}>
                        <Link to={`/video/${item._id}`} className="list-group-item list-group-item-action">
                            <div className="row">
                                <div className="col-lg-4">
                                    <ElementFile file={item}/>
                                </div>
                                <div className="col-lg-4">
                                    {item.title}
                                </div>
                            </div>


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
            {(response.items.length) ? Result(response.items) : <p>Видео не найдены</p>}
        </>
    );
}