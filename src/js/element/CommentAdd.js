import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import AddFile from "../object/AddFile";

function CommentsAdd (props) {
    let [form, setForm] = useState({
        inputText: '',
        add: false
    })
    let [fileIds, setFileIds] = useState('')

    const ArFileIds = (arIds) => {
        setFileIds(arIds)
    }

    const onChangeText = (e) => {
        setForm(prev => ({...prev, inputText: e.target.value}))
    }

    const FormNull = () => {
        setForm(prev => ({
            inputText: '',
            add: true
        }))
    }

    const onFormSubmitFile = async (e) => {
        e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'comment')

        const url = '/api/comment/add';

        let arFields = {
            module: props.module,
            object_id: props.object_id,
            text: form.inputText,
            file_ids: fileIds,

            gtoken: gtoken
        }

        let result = await axios.post(url, arFields);

        result = result.data;

        if (result.err) return; //ошибка, не продолжаем обработку

        FormNull() //обнуляем форму
    }

    const Form = () => {
        return (
            <>
                <div className="row">

                    <div className="col-lg-12 m-3">
                        <form onSubmit={onFormSubmitFile}>

                            <div className="mb-3">
                                <label htmlFor="inputText" className="form-label">Новый комментарий</label>
                                <textarea className="form-control" id="inputText" rows="5" onChange={onChangeText} value={form.inputText}></textarea>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-12">
                                    <AddFile ArFileIds={ArFileIds}/>
                                </div>
                            </div>
                            <br/>
                            <button type="submit" className="btn btn-primary" >Добавить комментарий</button>
                        </form>

                    </div>
                </div>

            </>
        )
    }

    const FormGood = () => {
        return <div className="alert alert-success" role="alert">
            Комментарий добавлен
        </div>
    }

    return (
        <>
            {(form.add) ? FormGood() : Form()}

        </>
    )

}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(CommentsAdd);

