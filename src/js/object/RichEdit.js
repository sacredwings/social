import React, {useEffect, useRef, useState} from 'react';
import './fontawesome-free.css'
import './style.css'

function RichEdit () {
    const [result, setResult] = useState('')
    const editor = useRef(null);

    useEffect (async ()=>{
        setResult(editor.current.innerHTML)
    }, [])

    function OnClick(type) {
        console.log(type)
        document.execCommand(type, false, null)
    }

    function OnPaste(e) {
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
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="bold" onClick={()=>{OnClick('bold')}}>
                    <i className="fa fa-bold"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="italic" onClick={()=>{OnClick('italic')}}>
                    <i className="fa fa-italic"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="underline" onClick={()=>{OnClick('underline')}}>
                    <i className="fa fa-underline"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="insertUnorderedList" onClick={()=>{OnClick('insertUnorderedList')}}>
                    <i className="fa fa-list-ul"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="insertOrderedList" onClick={()=>{OnClick('insertOrderedList')}}>
                    <i className="fa fa-list-ol"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="createLink" onClick={()=>{OnClick('createLink')}}>
                    <i className="fa fa-link"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="justifyLeft" onClick={()=>{OnClick('justifyLeft')}}>
                    <i className="fa fa-align-left"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="justifyCenter" onClick={()=>{OnClick('justifyCenter')}}>
                    <i className="fa fa-align-center"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="justifyRight" onClick={()=>{OnClick('justifyRight')}}>
                    <i className="fa fa-align-right"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="justifyFull" onClick={()=>{OnClick('justifyFull')}}>
                    <i className="fa fa-align-justify"></i>
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" data-element="insertImage" onClick={()=>{OnClick('insertImage')}}>
                    <i className="fa fa-image"></i>
                </button>
            </div>
        </div>
    }

    function OnInput() {
        setResult(editor.current.innerHTML)
    }

    return (
        <div className="App">
            <Buttons/>
            <div contentEditable={true} suppressContentEditableWarning={true} ref={editor} onPaste={OnPaste} onInput={OnInput}></div>
            <hr/>
            <Buttons/>
            <hr/>
            <h3>Результат</h3>
            <div dangerouslySetInnerHTML={{ __html: result }}></div>

        </div>
    )
}

export default RichEdit;

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}