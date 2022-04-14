import React, {useState, useEffect, useRef} from 'react'

function Spoiler (props) {
    //запрос
    let [styleBlock1, setStyleBlock1] = useState({
        maxHeight: '400px',
        overflow: 'hidden'
    })
    let [styleBlock2, setStyleBlock2] = useState({

    })

    let element = useRef()

    let [visible, setVisible] = useState(false)
    let [buttonStyle, setButtonStyle] = useState({
        margin: '10px'
    })

    useEffect (async (e)=>{
        if ((element.current) && (element.current.offsetHeight > 400))
            setVisible(true)
    }, [element])


    //return props.children
    const OnClick = async (e) => {
        if (e)
            e.preventDefault() // Stop form submit

        if (visible) {
            setStyleBlock1(prev => ({...prev, maxHeight: '100%'}))
        } else {
            setStyleBlock1(prev => ({...prev, maxHeight: '400px'}))
        }

        setVisible(prev => (prev = !prev))
    }
    return <>
        <div id="blok1" style={styleBlock1}>
            <div id="blok2" ref={element} style={styleBlock2}>
                {props.children}
            </div>

        </div>
        {visible ? <a href={''} onClick={OnClick} style={buttonStyle}>Показать полностью...</a> : null}
    </>

}

export default Spoiler