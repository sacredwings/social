import React, {useEffect, useState} from 'react'

export default (props) => {

    let [files, setFiles] = useState([])

    useEffect(() => {
        setFiles(props.files)
    }, [])

    const Delete = (id) => {
        let newList = []
        let newListIds = []
        files.forEach(function(item, i, arr) {
            if (item._id !== id) {
                newList.push(item)
                newListIds.push(item._id)
            }
        })

        setFiles(newList)
        props.result(props.object_id, newList, newListIds)
    }

    const List = (arFiles) => {
        return <ul className="list-group">
            {arFiles.map(function (item, i) {
                return <li className="list-group-item" key={i}>
                    <button type="button" className="btn-close" aria-label="Close" style={{float: "right"}} onClick={() => {Delete(item._id)}}></button>
                    An item
                </li>
            })}
        </ul>
    }

    return (files.length) ? List(files) : null
}