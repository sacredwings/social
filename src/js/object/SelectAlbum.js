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
        //поиск по большему количеству альбомов - всем загруженым
        let rsAlbums = download.map((item, i)=>{
            //обнуляем чек по умолчанию
            item.checked = false
            //ищем в среди установленных
            old.forEach((olbItem, oldI)=>{
                if (olbItem._id === item._id)
                    item.checked = true
            })

            item._album_id = item._album_id.map((subItem, subI)=>{
                subItem.checked = false
                old.forEach((olbItem, oldI)=>{
                    if (olbItem._id === subItem._id)
                        subItem.checked = true
                })
                return subItem
            })

            return item
        })

        //сохраняем в state для контроля checked
        setChecked(rsAlbums)
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
        //перед поиском обнуляем
        let arId = []

        //поиск нужного элемента в массиве
        let newChecked = checked.map((item, i)=>{
            //ищем в 1 уровне
            if (item._id === id) item.checked = !item.checked

            item._album_id = item._album_id.map((subItem, subI)=>{
                //ищем в 2 уровне
                if (subItem._id === id) subItem.checked = !subItem.checked

                if (subItem.checked) arId.push(subItem._id)
                return subItem
            })

            if (item.checked) arId.push(item._id)
            return item
        })

        //сохраняем изменения в state для контроля checked
        setChecked(newChecked)

        //выводим результат
        func(arId)
    }

    const Level2 = (items) => {
        return items.map((item, i)=>{
            return <>
                <div className={`form-check`} key={i}>
                    <input className="form-check-input" type="checkbox" checked={item.checked} onChange={() => onChangeChecked(item._id)}/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        --- {item.title}
                    </label>
                </div>
            </>
        })
    }

    return (
        <>
            {checked.map((item, i)=>{
                return <>
                    <div className="form-check" key={i}>
                        <input className="form-check-input" type="checkbox" checked={item.checked} onChange={() => onChangeChecked(item._id)}/>
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            {item.title}
                        </label>
                    </div>
                    {(item._album_id) ? Level2(item._album_id) : null}
                </>
            })}
        </>
    );
}