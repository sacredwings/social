import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";

function RichEditor (props) {

    const refRichEditor = useRef(null);

    useEffect (async ()=>{
        onResult(refRichEditor.current.innerHTML)
    }, [])

    const Get = async (str) => {
        //разбор строки / достаем id
        let id = str.substr(str.length-24, 24)

        //запрос
        let result = await axios.get(`/api/video/getById?ids=${id}`, {})
        result = result.data

        console.log(result)

        //ответ со всеми значениями
        if ((!result) || (result.err !== 0)) return false

        if ((!result.response) || (!result.response[0])) return false

        return result.response[0]
    }
    const GetYouTube = (str) => {

        //разбор строки / достаем id
        let id = str.substr(str.length-11, 11)

        let video = `<div class="ratio ratio-16x9">
                <iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" allowfullscreen></iframe>
            </div><br/><br/>`

        return video
    }

    //Выводим результат
    const onResult = (content) => {
        props.onResult(content)
    }

    //Нажатие кнопки
    const OnClickButton = (commandId, showUi = false, value = null) => {
        /*
        if (type === 'foreColor') {
            document.execCommand(commandId, showUi, value)
            return true
        }*/
        document.execCommand(commandId, showUi, value)
    }

    //Изменение текста в редакторе
    const OnInput = (e) => {
        console.log(e)
        onResult(refRichEditor.current.innerHTML)
    }
    //Изменение текста в редакторе
    const OnKeyDown = (e) => {
        console.log(e)
        if (e.keyCode === 13) {
            document.execCommand('insertLineBreak')
            e.preventDefault()
        }
    }

    //В редактор встален текст из буфера
    const OnPaste = async (e) => {
        //отменяем автоматическое действие
        e.preventDefault()
        console.log('OnPaste')

        //перехват вставленного HTML
        let content = (e.originalEvent || e).clipboardData.getData('text/plain')

        //проверка на ссылку
        let resUrl = isValidHttpUrl(content)

        //не ссылка - вставляем текст
        if (!resUrl) {
            console.log('просто текст')
            document.execCommand('insertHTML', false, content)
            return true
        }

        //ссылка на соц сеть и ютуб
        let substrYouTube = [
            'https://youtu.be',
            'https://www.youtube.com/'
        ]
        let substrMy = [
            'https://voenset.ru',
            'http://localhost:3030'
        ]

        let resUrlYouTube = includes(content, substrYouTube)
        let resUrlMy = includes(content, substrMy)

        //проверка что ссылка не на ютуб и не на соц сеть
        if ((!resUrlMy) && (!resUrlYouTube)) {
            console.log('просто ссылка')
            document.execCommand('createLink', false, content)
            return true
        }

        if (resUrlYouTube) {
            console.log('Ютуб ссылка')

            let result = GetYouTube(content)
            document.execCommand('insertHTML', false, result)
            return true
        }

        console.log('ищу на сайте')

        let file = await Get(content)
        console.log(file)

        //файла нет
        if (!file) {
            document.execCommand('insertHTML', false, content)
            return true
        }

        //
        let video = `<video controls={true} poster="${global.urlServer}/${file._file_id.url}" >
            <source src="${global.urlServer}/${file.url}" type="${file.type}"/>
        </video><br/><br/>`

        document.execCommand('insertHTML', false, video)

    }



    const Buttons = (format = 'line') => {
        let className = `btn-group`
        let style = {}
        if (format === 'vertical') {
            className = `btn-group-vertical`
            style = {
                position: "fixed",
                top: "20px",
                right: "20px",
                background: "white",
                borderRadius: "5px"
            }
        }

        return <div className="btn-group-line" style={style}>
            <div className={className} role="group" aria-label="Button group with nested dropdown">
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="bold" onClick={()=>{OnClickButton('bold')}}>
                    <i className="fa fa-bold"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="italic" onClick={()=>{OnClickButton('italic')}}>
                    <i className="fa fa-italic"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="underline" onClick={()=>{OnClickButton('underline')}}>
                    <i className="fa fa-underline"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="insertUnorderedList" onClick={()=>{OnClickButton('insertUnorderedList')}}>
                    <i className="fa fa-list-ul"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="insertOrderedList" onClick={()=>{OnClickButton('insertOrderedList')}}>
                    <i className="fa fa-list-ol"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="createLink" onClick={()=>{OnClickButton('createLink')}}>
                    <i className="fa fa-link"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="justifyLeft" onClick={()=>{OnClickButton('justifyLeft')}}>
                    <i className="fa fa-align-left"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="justifyCenter" onClick={()=>{OnClickButton('justifyCenter')}}>
                    <i className="fa fa-align-center"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="justifyRight" onClick={()=>{OnClickButton('justifyRight')}}>
                    <i className="fa fa-align-right"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="justifyFull" onClick={()=>{OnClickButton('justifyFull')}}>
                    <i className="fa fa-align-justify"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="insertImage" onClick={()=>{OnClickButton('insertImage')}}>
                    <i className="fa fa-image"></i>
                </button>

                <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-outline-secondary btn-sm dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-heading"></i>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('formatBlock', false, "H1")}}>H1</button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('formatBlock', false, "H2")}}>H2</button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('formatBlock', false, "H3")}}>H3</button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('formatBlock', false, "H4")}}>H4</button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('formatBlock', false, "H5")}}>H5</button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('formatBlock', false, "H6")}}>H6</button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('formatBlock', false, "p")}}>P</button></li>
                    </ul>
                </div>

                <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-outline-secondary btn-sm dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-vial"></i> Цвет
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(0, 0, 0,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(0, 0, 0,1)'}}></i> Черный
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(128, 128, 128,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(128, 128, 128,1)'}}></i> Серый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(192, 192, 192,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(192, 192, 192,1)'}}></i> Серебро
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(255, 255, 255,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(255, 255, 255,1)'}}></i> Белый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(255, 0, 255,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(255, 0, 255,1)'}}></i> Фуксия
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(128, 0, 128,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(128, 0, 128,1)'}}></i> Фиолетовый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(255, 0, 0,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(255, 0, 0,1)'}}></i> Красный
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(128, 0, 0,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(128, 0, 0,1)'}}></i> Бордовый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(255, 255, 0,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(255, 255, 0,1)'}}></i> Желтый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(128, 128, 0,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(128, 128, 0,1)'}}></i> Олива
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(0, 255, 0,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(0, 255, 0,1)'}}></i> Лайм
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(0, 128, 0,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(0, 128, 0,1)'}}></i> Зеленый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(0, 255, 255,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(0, 255, 255,1)'}}></i> Аква
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(0, 128, 128,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(0, 128, 128,1)'}}></i> Бирюзовый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(0, 0, 255,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(0, 0, 255,1)'}}></i> Синий
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('foreColor', false, "rgba(0, 0, 128,1)")}}>
                            <i className="fas fa-vial" style={{color: 'rgba(0, 0, 128,1)'}}></i> Флот
                        </button></li>
                    </ul>
                </div>
                <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-outline-secondary btn-sm dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-fire-extinguisher"></i> Цвет фона
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(0, 0, 0,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(0, 0, 0,1)'}}></i> Черный
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(128, 128, 128,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(128, 128, 128,1)'}}></i> Серый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(192, 192, 192,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(192, 192, 192,1)'}}></i> Серебро
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(255, 255, 255,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(255, 255, 255,1)'}}></i> Белый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(255, 0, 255,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(255, 0, 255,1)'}}></i> Фуксия
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(128, 0, 128,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(128, 0, 128,1)'}}></i> Фиолетовый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(255, 0, 0,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(255, 0, 0,1)'}}></i> Красный
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(128, 0, 0,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(128, 0, 0,1)'}}></i> Бордовый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(255, 255, 0,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(255, 255, 0,1)'}}></i> Желтый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(128, 128, 0,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(128, 128, 0,1)'}}></i> Олива
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(0, 255, 0,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(0, 255, 0,1)'}}></i> Лайм
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(0, 128, 0,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(0, 128, 0,1)'}}></i> Зеленый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(0, 255, 255,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(0, 255, 255,1)'}}></i> Аква
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(0, 128, 128,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(0, 128, 128,1)'}}></i> Бирюзовый
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(0, 0, 255,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(0, 0, 255,1)'}}></i> Синий
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('backColor', false, "rgba(0, 0, 128,1)")}}>
                            <i className="fas fa-fire-extinguisher" style={{color: 'rgba(0, 0, 128,1)'}}></i> Флот
                        </button></li>
                    </ul>
                </div>
            </div>
        </div>
    }



    return (
        <div className="rich-edit">
            <Buttons/>
            {Buttons('vertical')}
            <div className="content-editable" contentEditable={true} suppressContentEditableWarning={true} ref={refRichEditor} onPaste={OnPaste} onInput={OnInput} onKeyDown={OnKeyDown} dangerouslySetInnerHTML={{ __html: props.content }}></div>
            <Buttons/>
        </div>
    )
}

export default RichEditor;

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}
function includes(content, substr) {
    let res = false

    if (typeof substr === 'string') {
        res = content.includes(substr)
        return res
    }

    for (let str of substr) {
        res = content.includes(str)
        if (res === true) return true
    }

    return false
}
