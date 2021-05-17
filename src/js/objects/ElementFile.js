import React, {useEffect, useState} from 'react';

export default (props) => {

    let [preview, setPreview] = useState(true)

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
        console.log(file)
        file = file.file_id
        let url = `https://elk21.ru/assets/images/34534535.jpg`
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

