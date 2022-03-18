import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import axios from "axios"
import {reCaptchaExecute} from "recaptcha-v3-react-function-async"
import RichEditor from '../../object/RichEditor'
import AddFile from "../../object/AddFile"


function PostAdd (props) {
    let [form, setForm] = useState({
        inputText: '',
        add: false,
        err: false
    })
    let [fileIds, setFileIds] = useState([])

    const ArFileIds = (arIds) => {
        setFileIds(prev => ([
            ...prev, ...arIds
        ]))
    }

    //отслеживаем изменение props
    useEffect(async () => {
        //await GetAlbums()
        console.log(form)
    }, [form])

    const onChangeText = (e) => {
        //console.log(content)
        let name = e.target.id;
        let value = e.target.value;

        setForm(prev => ({
            ...prev, ['inputText']: e.target.value
        }))
    }

    const FormResult = (err) => {
        setForm(prev => ({
            inputText: '',
            add: true,
            err: err
        }))
    }

    const onFormSubmit = async (e) => {
        e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'post')

        const url = `/api/comment/add`;

        let arFields = {
            text: form.inputText,
            file_ids: fileIds,

            module: props.module,
            object_id: props.object_id,

            gtoken: gtoken
        }

        let result = await axios.post(url, arFields);

        result = result.data;

        //ошибка, не продолжаем обработку
        if (result.err) {
            FormResult (result.msg)
        } else {
            FormResult (false)
        }
    }

    const Form = () => {
        return <form onSubmit={onFormSubmit} className="">

            <div className="mb-3">
                <textarea className="form-control" id="inputText" rows="1" placeholder="" onChange={onChangeText} value={form.inputText}></textarea>
                {/*<RichEditor content={form.inputText} onResult={onChangeText} btnPosition={{top: true, right: false, bottom: false}} user_id={props.user_id} group_id={props.group_id}/>*/}
            </div>
            <div className="row button-file">
                <div className="col-12">
                    <AddFile ArFileIds={ArFileIds} user_id={props.user_id} group_id={props.group_id}/>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <p>Прикреплено файлов: {fileIds.length}</p>
                </div>
            </div>

            <button type="submit" className="btn btn-primary btn-sm">Добавить</button>

        </form>
    }

    const FormAdd = () => {
        if (form.err)
            return <div className="alert alert-danger" role="alert">
                <b>Ошибка:</b> {form.err}
            </div>

        return <div className="alert alert-success" role="alert">
            Пост добавлен !
        </div>
    }

    return (
        (form.add) ? FormAdd() : Form()
    )
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(PostAdd);

