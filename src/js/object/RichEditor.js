import React, {useEffect, useRef, useState} from 'react';

function RichEditor (props) {

    const refRichEditor = useRef(null);

    useEffect (async ()=>{
        onResult(refRichEditor.current.innerHTML)
    }, [])

    //Выводим результат
    const onResult = (content) => {
        props.onResult(content)
    }

    //Нажатие кнопки
    const OnClickButton = (type) => {
        document.execCommand(type, false, null)
    }

    //Изменение текста в редакторе
    const OnInput = () => {
        onResult(refRichEditor.current.innerHTML)
    }

    //В редактор встален текст из буфера
    const OnPaste = (e) => {
        //отменяем автоматическое действие
        e.preventDefault()

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

        //ссылка на соц сеть
        let substr = 'https://voenset.ru'
        let substrLocalhost = 'http://localhost:3030'

        let resUrlMy = content.includes(substr)
        let resUrlMyLocalhost = content.includes(substrLocalhost)

        if ((!resUrlMy) && (!resUrlMyLocalhost)) {
            console.log('просто ссылка')
            document.execCommand('createLink', false, content)
            return true
        }

        console.log('ищу на сайте')


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
            <div className="content-editable" contentEditable={true} suppressContentEditableWarning={true} ref={refRichEditor} onPaste={OnPaste} onInput={OnInput}>{props.content}</div>
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