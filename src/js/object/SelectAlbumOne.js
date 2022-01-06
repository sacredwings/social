import React, {useState, useEffect} from 'react';
import axios from "axios";

export default function (props) {
    let [list, setList] = useState([])
    let [response, setResponse] = useState({
        step: 200,
        count: 0,
        items: [],
    })

    useEffect (async () => {
        await GetAlbums()
    }, [])

    const GetAlbums = async (start) => {
        let offset = 0
        if (!start)
            offset = response.items.length

        let arFields = {
            params: {
                module: 'video',
                offset: offset,
                count: response.step
            }
        }

        if (props.group_id) arFields.params.group_id = props.group_id

        const url = `/api/album/get`

        let result = await axios.get(url, arFields);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        setList(prev => (
                (start) ? result.response.items : [...prev, ...result.response.items]
            ))
        setResponse(prev => ({...prev, ...{
                count: result.response.count,
                items: (start) ? result.response.items : [...prev.items, ...result.response.items],
                //users: [...prev.arUsers, ...result.response.users],
            }}))
    }

    //меняем свойство checked у элемента в state
    function onChangeChecked (id) {

        //поиск нужного элемента в массиве
        let newChecked = list.map((item, i)=>{
            if (item._id === id)
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
                    <input className="form-check-input" type="radio" checked={item.checked} onChange={() => onChangeChecked(item._id)}
                           name="flexRadio" id="flexRadio" />
                        <label className="form-check-label" htmlFor="flexRadio">
                            {item.title}
                        </label>
                </div>
            })}
        </>
    );
}