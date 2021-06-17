import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import AddPhoto from '../object/AddPhoto';

function AddFile (props) {
    let [form, setForm] = useState({
        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0
    })

    //отслеживаем изменение props
    useEffect(async () => {
        //await GetAlbums()
    }, [])

    const onChangeFiles = (e) => {
        //setForm(prev => ({...prev, files: e.target.files}))
        console.log(e.target.files)
    }

    const SendFile = async (files) => {
        //закрытие модульного окна

        //загрузка файлов
        let gtoken = await reCaptchaExecute(global.gappkey, 'message')

        const url = '/api/file/add';
        const formData = new FormData();

        if ((files) && (files.length))
            for (let i=0; i < files.length; i++)
                formData.append(`files[${i}]`, files[i])

        formData.append('gtoken', gtoken)

        //если это группа, то отправляем ее id
        if ((props.owner_id) && (props.owner_id<0))
            formData.append('group_id', -props.owner_id)

        let result = await axios.post(url, formData, {

            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function (progressEvent) {
                console.log(progressEvent)
                if (progressEvent.lengthComputable) {
                    let percentage = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
                    console.log(progressEvent.loaded + ' ' + progressEvent.total + ' ' + percentage);

                    setForm(prev => ({...prev, ...{
                            processBarLoaded: progressEvent.loaded,
                            processBarTotal: progressEvent.total,
                            processBar: percentage
                        }}))

                }
                // Do whatever you want with the native progress event
            },

        })

        if ((!result.data) || (result.data.err)) return

        //передача id файлов родителю
        props.ArFileIds(result.data.response)
    }

    const SendId = (e) => {
        //передача id файлов родителю
    }

    return (
        <div>

            <AddPhoto SendFile={SendFile} SendId={SendId} />

            <br />
            {((form.processBar >0) && (form.processBar <100)) ? <div className="mb-3"><p className="text-primary">Загружаю</p></div>:null}
            {(form.processBar === 100) ? <div className="mb-3"><p className="text-success">Загружено</p></div>:null}
            <div className="progress">
                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${form.processBar}%`}} aria-valuenow={form.processBar} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </div>
    )
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(AddFile);

