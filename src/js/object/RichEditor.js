import React, {useEffect, useRef, useState} from 'react'
import axios from "axios"
import {reCaptchaExecute} from "recaptcha-v3-react-function-async"
import {Link} from "react-router-dom"
import VideoPostModalAdd from "../element/video/VideoPostModalAdd";
import AddVideo from "./AddVideo";

function RichEditor (props) {
    let [buttonVisible, setButtonVisible] = useState({
        top: false,
        left: false,
        right: false,
        bottom: false
    })

    //при любом изменении входящего контента
    useEffect (async ()=>{
    }, [buttonVisible])

    const refRichEditor = useRef(null)
    let [content, setContent] = useState('')

    let [formLoad, setFormLoad] = useState({
        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0
    })

    //при любом изменении входящего контента
    useEffect (async ()=>{
        if (props.content === '')
            refRichEditor.current.innerHTML = ''

    }, [props.content])

    //при инициализации
    useEffect (async ()=>{
        //onResult(refRichEditor.current.innerHTML)
        setContent(props.content)
    }, [])

    const Get = async (str) => {
        //разбор строки / достаем id
        let id = str.substr(str.length-24, 24)

        //запрос
        let result = await axios.get(`/api/video/getById?ids=${id}`, {})
        result = result.data

        //ответ со всеми значениями
        if ((!result) || (result.err !== 0)) return false

        if ((!result.response) || (!result.response[0])) return false

        return result.response[0]
    }
    const GetById = async (id) => {
        //запрос
        let result = await axios.get(`/api/video/getById?ids=${id}`, {})
        result = result.data

        //ответ со всеми значениями
        if ((!result) || (result.err !== 0)) return false

        if ((!result.response) || (!result.response[0])) return false

        return result.response[0]
    }
    const GetYouTube = (str) => {

        //разбор строки / достаем id
        let id = str.substr(str.length-11, 11)

        let video = `<br/><div class="ratio ratio-16x9">
                <iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" allowfullscreen></iframe>
            </div><br/><br/>`

        return video
    }

    /*
    //Выводим результат
    const onResult = (content) => {
        props.onResult(content)
        //console.log(content)
    }*/

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
        props.onResult(refRichEditor.current.innerHTML, props.id)
    }
    //Изменение текста в редакторе
    const OnKeyDown = (e) => {
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
            'http://localhost:3030',
            'http://test.voenset.ru'
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
            document.execCommand('createLink', false, content)
            return true
        }

        //
/*
        let video = `<br/>
<div class="voenset-video">
    <div class="ratio ratio-16x9">
        <video controls={true} poster="${global.urlServer}/${file._file_id.url}" >
            <source src="${global.urlServer}/${file.url}" type="${file.type}"/>
        </video>
    </div>
    <small>
        <a href="${global.urlServer}/video/${file._id}">${file.title}</a>
    </small>
</div>
<br/>`
*/
/*
        let video = `<br/><div class="ratio ratio-16x9">
                <iframe  src="${global.urlServer}/embed/${file._id}" title="VoenSet video" allowfullscreen></iframe>
            </div><br/>`*/

        let video = `<br/>
<div class="voenset-video">
    <div class="ratio ratio-16x9">
        <iframe  src="${global.urlServer}/embed/${file._id}" title="VoenSet video" allowfullscreen></iframe>
    </div>
    <small>
        <a href="${global.urlServer}/video/${file._id}">${file.title}</a>
    </small>
<div>
<br/>`

        document.execCommand('insertHTML', false, video)

    }

    const OnChangeImg = async (e) => {
        //нет выбранных файлов
        if ((!e.target.files) || (!e.target.files.length)) return false

        let arFilesId = await SendFile(e.target.files)
        let arFiles = await GetFile(arFilesId)

        let html = await Promise.all(arFiles.map(async (item, i)=>{
            if (item.type === 'image/jpeg')
                return `<br/><div class="voenset-img"><img  key={i} src="${global.urlServer}/${item.url}" className="img-fluid" alt=${item.title}></div><br/><br/>`

            if (item.type === 'video/mp4') {
                let poster = ''
                if (item._file_id)
                    poster = `${global.urlServer}/${item._file_id.url}`

                return `<br/>
<div class="voenset-video">
    <div class="ratio ratio-16x9">
        <iframe  src="${global.urlServer}/embed/${item._id}" title="VoenSet video" allowfullscreen></iframe>
    </div>
    <small>
        <a href="${global.urlServer}/video/${item._id}">${item.title}</a>
    </small>
<div>
<br/>`
            }

        }))

        //фокус на лементе перед вставкой
        refRichEditor.current.focus()

        document.execCommand('insertHTML', false, html)
    }

    const GetFile = async (arIds) => {
        //разбор строки / достаем id
        arIds = arIds.join(',')

        //запрос
        let result = await axios.get(`/api/file/getById?ids=${arIds}`, {})
        result = result.data

        //ответ со всеми значениями
        if ((!result) || (result.err !== 0)) return false

        if ((!result.response) || (!result.response.length)) return false

        return result.response
    }

    const SendFile = async (files) => {
        //закрытие модульного окна

        //загрузка файлов
        let gtoken = await reCaptchaExecute(global.gappkey, 'fileAdd')

        const url = `/api/file/add`;
        const formData = new FormData();

        if ((files) && (files.length))
            for (let i=0; i < files.length; i++)
                formData.append(`files[${i}]`, files[i])

        formData.append('gtoken', gtoken)

        //если это группа, то отправляем ее id
        if (props.group_id)
            formData.append('group_id', props.group_id)

        let result = await axios.post(url, formData, {

            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function (progressEvent) {
                if (progressEvent.lengthComputable) {
                    let percentage = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
                    console.log(progressEvent.loaded + ' ' + progressEvent.total + ' ' + percentage);

                    setFormLoad(prev => ({...prev, ...{
                            processBarLoaded: progressEvent.loaded,
                            processBarTotal: progressEvent.total,
                            processBar: percentage
                        }}))

                }
                // Do whatever you want with the native progress event
            },

        })

        if ((!result.data) || (result.data.err)) return


        return result.data.response
    }

    const SelectVideoId = async (ids) => {
        let file = await GetById(ids)

            let html = `<br/>
<div class="voenset-video">
    <div class="ratio ratio-16x9">
        <iframe  src="${global.urlServer}/embed/${file._id}" title="VoenSet video" allowfullscreen></iframe>
    </div>
    <small>
        <a href="${global.urlServer}/video/${file._id}">${file.title}</a>
    </small>
<div>
<br/>`
        document.execCommand('insertHTML', false, html)
        //console.log(ids)
        //передача id файлов родителю
        //props.ArFileIds(ids)
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

        return <div className="d-grid gap-2">
        <div className="btn-group-line" style={style}>
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

                <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-outline-secondary btn-sm dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa fa-image"></i>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <div className="mb-3">
                            <input style={{width: "max-content"}} className="form-control form-control-sm" type="file" onChange={OnChangeImg}/>
                        </div>
                        <VideoPostModalAdd user_id={props.user_id} group_id={props.group_id} SelectVideoId={SelectVideoId}/>
                    </ul>
                </div>


                <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-outline-secondary btn-sm dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-text-height"></i>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('fontSize', false, 1)}}>
                            1
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('fontSize', false, 2)}}>
                            2
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('fontSize', false, 3)}}>
                            3
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('fontSize', false, 4)}}>
                            4
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('fontSize', false, 5)}}>
                            5
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('fontSize', false, 6)}}>
                            6
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('fontSize', false, 7)}}>
                            7
                        </button></li>
                    </ul>
                </div>

                <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-outline-secondary btn-sm dropdown-toggle"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa fa-align-justify"></i>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('justifyLeft')}}>
                            <i className="fa fa-align-left"></i>
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('justifyCenter')}}>
                            <i className="fa fa-align-center"></i>
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('justifyRight')}}>
                            <i className="fa fa-align-right"></i>
                        </button></li>
                        <li><button type="button" className="dropdown-item" onClick={()=>{OnClickButton('justifyFull')}}>
                            <i className="fa fa-align-justify"></i>
                        </button></li>
                    </ul>
                </div>

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
                        <i className="fas fa-vial"></i>
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
                        <i className="fas fa-fire-extinguisher"></i>
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
        </div>
    }

    function DangerouslySetInnerHTML() {
        return {__html: content}
    }

    const ButtonVisible = (position) => {
        let newButtonVisible = buttonVisible

        if (position === 'left')
            setButtonVisible(prev => ({...prev, left: !prev.left}))

        if (position === 'top')
            setButtonVisible(prev => ({...prev, top: !prev.top}))

        if (position === 'bottom')
            setButtonVisible(prev => ({...prev, bottom: !prev.bottom}))

        if (position === 'right')
            setButtonVisible(prev => ({...prev, right: !prev.right}))

    }

    return (
        <div className="rich-edit">

            {(buttonVisible.right) ? Buttons('vertical') : null}
            {(buttonVisible.top) ? <Buttons/> : null}

            {<div className="d-grid gap-2">
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>{ButtonVisible('top')}}>верх</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>{ButtonVisible('bottom')}}>низ</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={()=>{ButtonVisible('right')}}>право</button>
                </div>

            </div>}
            <div className="content-editable" contentEditable={true} suppressContentEditableWarning={true} ref={refRichEditor} onPaste={OnPaste} onInput={OnInput} onKeyDown={OnKeyDown} dangerouslySetInnerHTML={{__html: content}}></div>

            {(buttonVisible.bottom) ? <Buttons/> : null}
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
