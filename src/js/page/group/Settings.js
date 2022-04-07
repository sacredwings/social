import React, {useState, useEffect, useReducer} from 'react';
import axios from "axios";
import {connect} from 'react-redux';
import {reCaptchaExecute} from "recaptcha-v3-react-function-async";
import {useParams, Link} from 'react-router-dom'


function GroupSettings (props) {
    const { id } = useParams()
    let formDefault = {
        title: '',
        info: '',
        password: '',
        password_replay: '',
        err: null,
        errText: '',
        price: 0,

        inputFilePhoto: null,
        inputFileBigPhoto: null,
        inputFileBigVideo: null,

        processBarLoaded: 0,
        processBarTotal: 0,
        processBar: 0,

        processBarLoadedBig: 0,
        processBarTotalBig: 0,
        processBarBig: 0
    }
    let [form, setForm] = useState(formDefault)

    //отслеживаем изменение props
    useEffect(async () => {
        await GetGroup(id)
    }, [])

    async function GetGroup (groupId) {

        //запрос
        let result = await axios.get(`/api/group/getById?ids=${groupId}`, {});
        result = result.data.response;

        if ((result) && (result.length))
        {
            if (!result[0].price)
                result[0].price = 0

            setForm(prevState => ({
                ...prevState,
                price: result[0].price,
                _id: result[0]._id,
                title: result[0].title,
                info: result[0].info,
            }))
        }


    }

    const onChangeFile = (e) => {
        let name = e.target.id;

        setForm(prev => ({
            ...prev, [name]:e.target.files[0]
        }))
    }

    const onChange = (event) => {
        if (event.target.value.length <= 30) {
            const name = event.target.name;
            setForm(prevState => ({
                ...prevState,
                [name]: event.target.value
            }))
        }
    }

    const onSavePhoto = async (e) => {
        e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'setting')

        const url = `/api/group/setPhoto`;
        const formData = new FormData();

        formData.append('file', form.inputFilePhoto)
        formData.append('group_id', id)
        formData.append('gtoken', gtoken)

        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function (progressEvent) {
                console.log(progressEvent)
                if (progressEvent.lengthComputable) {
                    let percentage = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
                    console.log(progressEvent.loaded + ' ' + progressEvent.total + ' ' + percentage);

                    setForm(prevState => ({
                        ...prevState,
                        ...{processBar: percentage, processBarLoaded: progressEvent.loaded, processBarTotal: progressEvent.total}
                    }))
                }
                // Do whatever you want with the native progress event
            },
        })
    }

    const onSavePhotoBig = async (e) => {
        e.preventDefault() // Stop form submit

        let gtoken = await reCaptchaExecute(global.gappkey, 'setting')

        const url = `/api/group/setPhotoBig`;
        const formData = new FormData();

        formData.append('file_img', form.inputFileBigPhoto)
        formData.append('file_video', form.inputFileBigVideo)
        formData.append('group_id', id)
        formData.append('gtoken', gtoken)

        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function (progressEvent) {
                console.log(progressEvent)
                if (progressEvent.lengthComputable) {
                    let percentage = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
                    console.log(progressEvent.loaded + ' ' + progressEvent.total + ' ' + percentage);

                    setForm(prevState => ({
                        ...prevState,
                        ...{processBarBig: percentage, processBarLoadedBig: progressEvent.loaded, processBarTotalBig: progressEvent.total}
                    }))
                }
                // Do whatever you want with the native progress event
            },
        })
    }

    const onSavePrice = async (e) => {
        e.preventDefault();
        let gtoken = await reCaptchaExecute(global.gappkey, 'setting')

        //запрос
        let result = await axios.post(`/api/group/setPrice`, {
            price: form.price,
            group_id: form._id,

            gtoken: gtoken
        });
        result = result.data;
    }

    const onSaveName = async (e) => {
        e.preventDefault();
        let gtoken = await reCaptchaExecute(global.gappkey, 'setting')

        //запрос
        let result = await axios.post(`/api/group/setName`, {
            title: form.title,
            info: form.info,
            group_id: form._id,

            gtoken: gtoken
        });
        result = result.data;


    }

    return (
        <div className="container my-3">
            <div className="row">
                <div className="col">
                    <h2 className="mb-3">Настройки группы</h2>

                    <div className="card mt-3">
                        <div className="card-header">
                            Название и описание
                        </div>
                        <div className="card-body">
                            <form onSubmit={onSaveName}>
                                <div className="mb-3">
                                    <input type="text" className="form-control" placeholder="Название" name="title" id="title" value={form.title} onChange={onChange}/>
                                </div>
                                <div className="mb-3">
                                    <textarea className="form-control" name="info" id="info" value={form.info} onChange={onChange} rows="3" placeholder="Описание"></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Сохранить</button>
                            </form>
                        </div>
                    </div>


                    <div className="card mt-3">
                        <div className="card-header">
                            Фото
                        </div>
                        <div className="card-body">
                            <form onSubmit={onSavePhoto}>

                                <div className="mb-3">
                                    <input className="form-control form-control-sm" id="inputFilePhoto" type="file" onChange={onChangeFile}/>
                                </div>

                                {((form.processBar >0) && (form.processBar <100)) ? <div className="mb-3"><p className="text-primary">Загружаю</p></div>:null}
                                {(form.processBar === 100) ? <div className="mb-3"><p className="text-success">Загружено</p></div>:null}
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${form.processBar}%`}} aria-valuenow={form.processBar} aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <br/>
                                <button type="submit" className="btn btn-primary">Сохранить</button>
                            </form>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                            Большое фото/видео
                        </div>
                        <div className="card-body">
                            <form onSubmit={onSavePhotoBig}>

                                <div className="mb-3">
                                    <input className="form-control form-control-sm" id="inputFileBigPhoto" type="file" onChange={onChangeFile}/>
                                </div>

                                <div className="mb-3">
                                    <input className="form-control form-control-sm" id="inputFileBigVideo" type="file" onChange={onChangeFile}/>
                                </div>

                                {((form.processBarBig >0) && (form.processBarBig <100)) ? <div className="mb-3"><p className="text-primary">Загружаю</p></div>:null}
                                {(form.processBarBig === 100) ? <div className="mb-3"><p className="text-success">Загружено</p></div>:null}
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${form.processBarBig}%`}} aria-valuenow={form.processBarBig} aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <br/>
                                <button type="submit" className="btn btn-primary">Сохранить</button>
                            </form>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                            Платный доступ к группе
                        </div>
                        <div className="card-body">
                            <form onSubmit={onSavePrice}>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Цена</label>
                                    <input type="text" className="form-control" placeholder="Цена" name="price" id="price" value={form.price} onChange={onChange}/>
                                </div>
                                <button type="submit" className="btn btn-primary">Сохранить</button>
                            </form>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}
/*



class GroupSettings extends Component {
    constructor () {
        super();
        this.state = {
            password: '',
            password_replay: '',
            err: null,
            errText: '',

            file: null,

            processBarLoaded: 0,
            processBarTotal: 0,
            processBar: 0
        };

        this.onChange = this.onChange.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this)

        this.onSavePhoto = this.onSavePhoto.bind(this)

    }

    onChange (event) {
        if (event.target.value.length <= 30) {
            const name = event.target.name;
            this.setState({[name]: event.target.value});
        }
    }

    //АВА
    const onChangeFile = (e) => {
        let name = e.target.id;

        setForm(prev => ({
            ...prev, [name]:e.target.files[0]
        }))
    }


    onSavePhoto(e){
        let _this = this
        console.log(this.state.file);

        const url = '/api/group/setPhoto';
        const formData = new FormData();
        console.log(this.state.file)

        formData.append('file', this.state.file)
        formData.append('group_id', this.props.match.params.id)

        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function (progressEvent) {
                console.log(progressEvent)
                if (progressEvent.lengthComputable) {
                    let percentage = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
                    console.log(progressEvent.loaded + ' ' + progressEvent.total + ' ' + percentage);
                    _this.setState({processBar: percentage, processBarLoaded: progressEvent.loaded, processBarTotal: progressEvent.total})

                }
                // Do whatever you want with the native progress event
            },
        })

        e.preventDefault() // Stop form submit
    }


    render() {
        return (
            <div className="container my-3">
                <div className="row">
                    <div className="col">
                        <h2 className="mb-3">Настройки группы</h2>

                        <div className="card mt-3">
                            <div className="card-header">
                                Изменить аватар
                            </div>
                            <div className="card-body">
                                <form onSubmit={this.onSavePhoto}>
                                    <div className="mb-3 form-file">
                                        <input type="file" className="form-file-input" id="inputFile" onChange={this.onChangeFile}/>
                                        <label className="form-file-label" htmlFor="inputFile">
                                            <span className="form-file-text">Выберите файл...</span>
                                            <span className="form-file-button">Обзор</span>
                                        </label>
                                    </div>
                                    {((this.state.processBar >0) && (this.state.processBar <100)) ? <div className="mb-3"><p className="text-primary">Загружаю</p></div>:null}
                                    {(this.state.processBar === 100) ? <div className="mb-3"><p className="text-success">Загружено</p></div>:null}
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${this.state.processBar}%`}} aria-valuenow={this.state.processBar} aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <br/>
                                    <button type="submit" className="btn btn-primary">Сохранить</button>
                                </form>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        )
    }

}
*/
export default connect (
    state => ({

    }),
    dispatch => ({
        set_phone: (has_phone) => {
            dispatch({type: 'SET_PHONE', has_phone: has_phone});
        }
    })
)(GroupSettings);

