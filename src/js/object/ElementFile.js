import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";

export default (props) => {

    let [imgNot] = useState('https://elk21.ru/assets/images/34534535.jpg')
    const urlVideo = `/video`

    useEffect (()=>{
    }, [])

    const Video = (file) => {
        let url = `https://elk21.ru/assets/images/34534535.jpg`
        let style = {
            width: '100%',
            height: 'auto',
            maxHeight: '100%'
        }

        if (file._file_id)
            url = `${global.urlServer}/${file._file_id.url}`

        let attributes = {
            controls: false,
            autoplay: false,
            muted: false,
            loop: false
        }

        if ((props.attributes) && (props.attributes.controls)) attributes.controls = props.attributes.controls
        if ((props.attributes) && (props.attributes.autoplay)) attributes.autoplay = props.attributes.autoplay
        if ((props.attributes) && (props.attributes.muted)) attributes.muted = props.attributes.muted
        if ((props.attributes) && (props.attributes.loop)) attributes.loop = props.attributes.loop

        return <>
            <video controls={attributes.controls} style={style} preload="none" poster={url} autoPlay={attributes.autoplay} muted={attributes.muted} loop={attributes.loop}>
                <source src={`${global.urlServer}/${file.url}`} type={file.type}/>
            </video>
            {
                (props.link) ?
                <small>
                        <Link to={`${urlVideo}/${file._id}`}>{file.title}</Link>
                </small> : null
            }
        </>
    }

    const Image = (file) => {
        let url = `https://elk21.ru/assets/images/34534535.jpg`
        let style = {
            width: '100%',
            height: 'auto',
            maxHeight: '100%'
        }

        if (file)
            url = `${global.urlServer}/${file.url}`

        if (props.link)
            return <Link to={props.link}><img src={url} style={style} /></Link>

        return <img src={url} style={style}/>
    }

    const Logic = (file) => {

        //файла нет - выход
        if (!file) return null

        if ((file.type === 'video/mp4') || (file.type === 'video/avi'))
            return Video(file)

        //картинка
        if ((file.type === 'image/gif') || (file.type === 'image/png') || (file.type === 'image/jpeg'))
            return Image(file)
    }

    return (
        <>
            {Logic(props.file)}
        </>
    )
}

/*
    const ImageVideo = (file, video) => {

        console.log('картинка из видео')

        var loadedData = function (e) {
            console.log('loadedData работает')

            var canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;

            var context = canvas.getContext('2d');
            context.drawImage(this, 0, 0, 300, 200); // this в данном случае это мой video

            var dataURL = canvas.toDataURL();

            console.log(dataURL)

            setAutoPhoto(dataURL)
        }
        //Создаю элементы по получаемым данным

        var element = document.createElement("video");
        element.currentTime = 150;
        element.src = `${global.urlServer}/${file.url}`
        element.setAttribute('crossOrigin', 'anonymous');

        element.addEventListener("loadeddata", loadedData);
        //element.addEventListener("timeupdate", loadedData);
        //element.addEventListener("ended", timeEnded);

        file = file.file_id
        let url = autoPhoto
        let style = {width: '100%'}

        if (file)
            url = `${global.urlServer}/${file.url}`

        if (video)
            style = {cursor: 'pointer', width: '100%'}

        return <img src={url} style={style} onClick={() => {setPreview(false)}}/>
    }
*/