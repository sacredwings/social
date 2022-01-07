import React, {useState, useEffect} from 'react';

export default function ({albums, func}) {
    let [checked, setChecked] = useState(albums)

    //отслеживаем изменение props
    useEffect (()=>{

        //нет свойства checked в props
        albums = albums.map((item, i)=>{
            item.checked = false
            return item
        })

        //сохраняем в state для контроля checked
        setChecked(albums)
    }, [albums])

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