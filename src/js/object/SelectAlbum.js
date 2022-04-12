import React, {useState, useEffect} from 'react';
import axios from "axios";

export default function ({albums, module, user_id, group_id, func}) {
    let [old, setOld] = useState(albums)
    let [download, setDownload] = useState([])
    let [checked, setChecked] = useState(albums)

    //уже которые выбраны запоминаем
    useEffect (async ()=>{
        setOld(albums)
        await Get()
    }, [])

    //загрузка альбомов произошла
    useEffect (()=>{
        //альбомы для отображения
        let rsAlbums = download.map((item, i)=>{
            for (let itemOld of old) {
                if (itemOld._id === item._id)
                    item.checked = true
            }
            return item
        })

        //сохраняем в state для контроля checked
        setChecked(rsAlbums)

        console.log(rsAlbums)
    }, [download])

    //загрузка альбомов
    const Get = async () => {
        const url = `/api/album/get`

        let arFields = {
            params: {
                module: module,
                user_id: user_id,
                count: 200
            }
        }

        if (user_id)
            arFields.params.user_id = user_id
        if (group_id)
            arFields.params.group_id = group_id

        let result = await axios.get(url, arFields)

        result = result.data
        if (result.err) return //ошибка, не продолжаем обработку
        if ((!result.response) || (!result.response.items)) return


        setDownload(result.response.items)
    }

    //меняем свойство checked у элемента в state
    function onChangeChecked (id) {
        //поиск нужного элемента в массиве
        let newChecked = checked.map((item, i)=>{
            if (item._id === id) item.checked = !item.checked
            return item
        })

        //оставляем только нужные элементы из массива
        let newResult = newChecked.filter((item, i)=>{
            if (item.checked === true) return item._id
        })
        //достаем их id
        newResult = newResult.map((item, i)=>{
            if (item.checked === true) return item._id
        })

        //сохраняем изменения в state для контроля checked
        setChecked(newChecked)

        //выводим результат
        func(newResult)
    }

    return (
        <>
            {checked.map((item, i)=>{
                return <div className="form-check" key={i}>
                    <input className="form-check-input" type="checkbox" checked={item.checked} onChange={() => onChangeChecked(item._id)}/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        {item.title}
                    </label>
                </div>
            })}
        </>
    );
}