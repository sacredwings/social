import React, {useState, useEffect} from 'react';
import axios from "axios";

export default function (albums, func) {
    let [list, setList] = useState(albums)

    useEffect (async () => {
        setList(albums)
        //await GetAlbums()
    }, [albums])

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

        func(id)
    }

    return (
        <>

        </>
    );
}

/*
            {list.map((item, i)=>{
                return <div className="form-check" key={i}>
                    <input className="form-check-input" type="radio" checked={item.checked} onChange={() => onChangeChecked(item._id)}
                           name="flexRadio" id="flexRadio" />
                        <label className="form-check-label" htmlFor="flexRadio">
                            {item.title}
                        </label>
                </div>
            })}
 */