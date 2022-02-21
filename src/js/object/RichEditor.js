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
    const OnClickButton = (type) => {
        document.execCommand(type, false, null)
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
        console.log(resUrl)
        //не ссылка - вставляем текст
        if (!resUrl) {
            console.log('просто текст')
            document.execCommand('insertHTML', false, content)
            return true
        }

        //ссылка на соц сеть и ютуб
        let substrYouTube = 'https://youtu.be'
        let substr = 'https://voenset.ru'
        let substrLocalhost = 'http://localhost:3030'

        let resUrlYouTube = content.includes(substrYouTube)
        let resUrlMy = content.includes(substr)
        let resUrlMyLocalhost = content.includes(substrLocalhost)

        //проверка что ссылка не на ютуб и не на соц сеть
        if ((!resUrlMy) && (!resUrlMyLocalhost) && (!resUrlYouTube)) {
            console.log('просто ссылка')
            document.execCommand('createLink', false, content)
            return true
        }

        if (resUrlYouTube) {
            console.log('Ютуб ссылка')

            let resulttt = GetYouTube(content)

            console.log(resulttt)
            document.execCommand('insertHTML', false, resulttt)
            return true
        }
        //https://youtu.be/ft_WS9VPSV0

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



    const Buttons = () => {
        return <div>
            <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
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
            </div>
        </div>
    }



    return (
        <div className="rich-edit">
            <Buttons/>
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