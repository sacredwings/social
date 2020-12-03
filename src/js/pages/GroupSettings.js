import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

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
    onChangeFile(e) {
        this.setState({file:e.target.files[0]})
        console.log(this.state.file)
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

export default connect (
    state => ({

    }),
    dispatch => ({
        set_phone: (has_phone) => {
            dispatch({type: 'SET_PHONE', has_phone: has_phone});
        }
    })
)(GroupSettings);

