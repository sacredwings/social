import React, {useEffect, useState} from 'react';

export default (props) => {

    let [preview, setPreview] = useState(true)
    let [autoPhoto, setAutoPhoto] = useState('https://elk21.ru/assets/images/34534535.jpg')

    useEffect (()=>{
        console.log(props.file)
    }, [])

    const Video = (file) => {
        return (
            <video controls style={{width: '100%'}}>
                <source src={`${global.urlServer}/${file.url}`} type={file.type} />
            </video>
        )
    }

    const Image = (file, video) => {
        console.log(file)

        let url = `https://elk21.ru/assets/images/34534535.jpg`
        let style = {width: '100%'}

        if (file)
            url = `${global.urlServer}/${file.url}`

        if (video)
            style = {cursor: 'pointer', width: '100%'}

        return <img src={url} style={style} onClick={() => {setPreview(false)}}/>
    }

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
        element.src = `http://localhost:3031/`+file.url
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



    const Logic = (file) => {

        //файла нет - выход
        if (!file) return null

        //видео
        if (file.type === 'video/mp4')
            if (preview)
                return ImageVideo(file, true)
            else
                return Video(file)
        if (file.type === 'video/avi')
            if (preview)
                return Image(file.file_id, true)
            else
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

