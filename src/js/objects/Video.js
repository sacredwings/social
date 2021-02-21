import React, {useState, useRef} from 'react';

export default function ({object}) {
    let [click, setClick] = useState(false)

    console.log(object)
    const Img = () => {

        let url = `https://elk21.ru/assets/images/34534535.jpg`
        if (object.file_preview)
            url = `${global.urlServer}/${object.file_preview.url}`


        return <img src={url} style={{width: '100%', cursor: 'pointer'}} onClick={() => {setClick(true)}}/>
    }

    const Video = () => {
        return (
            <video controls style={{width: '100%', cursor: 'pointer'}}>
                <source src={`${global.urlServer}/${object.file.url}`} type={object.file.type} />
            </video>
        )
    }

    return (<>
        {click ? Video() : Img()}
    </>)
}

/*
                                <video controls style={{width: '100%'}}>
                                    <source src={`${global.urlServer}/${video.file.url}`} type={video.file.type} />
                                </video>
 */