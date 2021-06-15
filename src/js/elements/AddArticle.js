import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import SelectAlbum from "../objects/SelectAlbum";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import AddFile from "../objects/AddFile";
import { Editor } from '@tinymce/tinymce-react';

function ArticleAdd (props) {
    let [form, setForm] = useState({
        inputTitle: '',
        inputText: '',
        add: false,
        err: false
    })
    let [fileIds, setFileIds] = useState('')

    const ArFileIds = (arIds) => {
        setFileIds(arIds)
    }

    //отслеживаем изменение props
    useEffect(async () => {
        //await GetAlbums()
    }, [])

    const onChangeText = (e) => {
        let name = e.target.id;
        let value = e.target.value;

        setForm(prev => ({
            ...prev, [name]: value
        }))
    }

    const FormResult = (err) => {
        setForm(prev => ({
            inputTitle: '',
            inputText: '',
            add: true,
            err: err
        }))
    }

    const onFormSubmit = async (e) => {
        e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'topic')

        const url = '/api/topic/add';

        let arFields = {
            title: form.inputTitle,
            text: form.inputText,
            file_ids: fileIds,

            gtoken: gtoken
        }

        //комуто на стену
        if ((props.owner_id) && (props.owner_id < 0))
            arFields.group_id = -props.owner_id

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
        const editorRef = useRef(null);
        const log = () => {
            if (editorRef.current) {
                console.log(editorRef.current.getContent());
            }
        };

        return <form onSubmit={onFormSubmit}>

            <div className="mb-3">
                <label htmlFor="inputTitle" className="form-label">Название</label>
                <input type="text" className="form-control" id="inputTitle" onChange={onChangeText} value={form.inputTitle}/>
            </div>
            <div className="mb-3">
                <label htmlFor="inputText" className="form-label">Описание</label>
                <textarea className="form-control" id="inputText" rows="5" onChange={onChangeText} value={form.inputText}></textarea>
                <Editor
                    apiKey="a96yu4ep2rfw9tmmtypf8b00nme4937b42a30ojk4skqnv8v"
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue="<p>This is the initial content of the editor.</p>"
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
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
    }

    const FormAdd = () => {
        if (form.err)
            return <div className="alert alert-danger" role="alert">
                <b>Ошибка:</b> {form.err}
            </div>

        return <div className="alert alert-success" role="alert">
            Обсуждение добавлено !
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
)(ArticleAdd);

