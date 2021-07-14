import React, {useState, useEffect} from 'react';
import axios from "axios";

export default function (props) {
    let [list, setList] = useState([])
    let [request, setRequest] = useState({
        response: [],
        offset: 0,
        count: 200
    })

    useEffect (async () => {
        await GetAlbums()
    }, [])

    const GetAlbums = async (start) => {
        const url = `/api/album/get?module=video&owner_id=${props.owner_id}&offset=${request.offset}&count=${request.count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setList(prev => (
                (start) ? result.response.items : [...prev, ...result.response.items]
            ))
        setRequest(prev => ({...prev, ...{
                offset: (start) ? 0 : prev.offset + prev.count,
                count: result.response.count,
                response: result.response,
            }}))
    }

    //меняем свойство checked у элемента в state
    function onChangeChecked (id) {

        //поиск нужного элемента в массиве
        let newChecked = list.map((item, i)=>{
            if (item.id === id)
                item.checked = true
            else
                item.checked = false

            return item
        })

        //обновляем объекты
        setList(newChecked)

        props.func(id)
    }

    return (
        <>
            {list.map((item, i)=>{
                return <div className="form-check" key={i}>
                    <input className="form-check-input" type="radio" checked={item.checked} onChange={() => onChangeChecked(item.id)}
                           name="flexRadio" id="flexRadio" />
                        <label className="form-check-label" htmlFor="flexRadio">
                            {item.title}
                        </label>
                </div>
            })}
        </>
    );
}