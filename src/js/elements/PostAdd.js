import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
//import AddFile from "../objects/AddFile";
import AddFile from "../objects/AddFile";

function PostAddModal (props) {
    let [form, setForm] = useState({
        files: null,
        inputText: '',
        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0
    })
    let [fileIds, setFileIds] = useState('')
    const ArFileIds = (arIds) => {
        setFileIds(arIds)
    }

    //отслеживаем изменение props
    useEffect(async () => {
        //await GetAlbums()
    }, [])

    const onChangeFiles = (e) => {
        setForm(prev => ({...prev, files: e.target.files}))
    }

    const onChangeText = (e) => {
        let name = e.target.id;
        let value = e.target.value;

        setForm(prev => ({
            ...prev, [name]: value
        }))
    }

    const onFormClose = (e) => {
        setForm(prev => ({
            files: null,
            inputText: '',
            processBarLoaded: 0,
            processBarTotal: 0,
            processBar: 0
        }))
    }

    const onFormSubmit = async (e) => {
        e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'post')

        const url = '/api/post/add';

        let arFields = {
            text: form.inputText,
            file_ids: fileIds,

            gtoken: gtoken
        }

        let result = await axios.post(url, arFields);

        result = result.data;

        if (result.err) return; //ошибка, не продолжаем обработку
    }

    return (
        <form onSubmit={onFormSubmit}>

            <div className="mb-3">
                <label htmlFor="inputText" className="form-label">Текст</label>
                <textarea className="form-control" id="inputText" rows="5" onChange={onChangeText} value={form.inputText}></textarea>
            </div>

            <br/>
            <div className="row">
                <div className="col-12">
                    <AddFile ArFileIds={ArFileIds}/>
                </div>
            </div>
            <br/>

            <button type="submit" className="btn btn-primary">Добавить</button>

        </form>

    )
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(PostAddModal);

