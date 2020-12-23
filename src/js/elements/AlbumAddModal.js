import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import {ReCaptcha} from 'recaptcha-v3-react';

class AlbumAddModal extends Component {
    constructor () {
        super();
        this.state = {
            file: null,
            inputTitle: '',
            inputText: '',
            processBarLoaded: 0,
            processBarTotal: 0,
            processBar: 0
        }

        this.onFormSubmitFile = this.onFormSubmitFile.bind(this)
        this.onChangeFile = this.onChangeFile.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.onFormClose = this.onFormClose.bind(this)

    }

    async componentDidMount () {

    }

    onChangeFile(e) {
        this.setState({file:e.target.files[0]})
        console.log(this.state.file)
    }

    onChangeText(e) {
        let name = e.target.id;
        let value = e.target.value;

        this.setState({[name]:value})
    }

    onFormClose(e) {

        this.setState({
            file: null,
            inputTitle: '',
            inputText: '',
            processBarLoaded: 0,
            processBarTotal: 0,
            processBar: 0
        })
    }

    onFormSubmitFile (e) {
        let _this = this
        console.log(this.state.file);


        const url = '/api/video/addAlbum';
        const formData = new FormData();

        console.log(this.state)

        formData.append('file', this.state.file)
        formData.append('title', this.state.inputTitle)
        formData.append('text', this.state.inputText)
        formData.append('gtoken', this.state.gtoken)

        //если это группа, то отправляем ее id
        if ((this.props.owner_id) && (this.props.owner_id<0))
            formData.append('group_id', -this.props.owner_id)

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
            <div className="modal fade" id="modalAlbumAdd" tabIndex="-1" aria-labelledby="modalAlbumAdd"
                 aria-hidden="true">

                <ReCaptcha
                    ref={ref => this.recaptcha = ref}
                    action='settings'
                    sitekey={global.gappkey}
                    verifyCallback={token => this.setState({gtoken: token})}
                />
                <form onSubmit={this.onFormSubmitFile}>

                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Новый альбом</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <p>Выберите видео файл на своем устройстве</p>
                                <div className="mb-3 form-file">
                                    <input type="file" className="form-file-input" id="inputFile"
                                           onChange={this.onChangeFile}/>
                                    <label className="form-file-label" htmlFor="inputFile">
                                        <span className="form-file-text">Выберите файл...</span>
                                        <span className="form-file-button">Обзор</span>
                                    </label>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="inputTitle" className="form-label">Название</label>
                                    <input type="text" className="form-control" id="inputTitle"
                                           onChange={this.onChangeText} value={this.state.inputTitle}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="inputText" className="form-label">Описание</label>
                                    <textarea className="form-control" id="inputText" rows="5"
                                              onChange={this.onChangeText} value={this.state.inputText}></textarea>
                                </div>

                                {((this.state.processBar > 0) && (this.state.processBar < 100)) ?
                                    <div className="mb-3"><p className="text-primary">Загружаю</p></div> : null}
                                {(this.state.processBar === 100) ?
                                    <div className="mb-3"><p className="text-success">Загружено</p></div> : null}
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped progress-bar-animated"
                                         role="progressbar" style={{width: `${this.state.processBar}%`}}
                                         aria-valuenow={this.state.processBar} aria-valuemin="0"
                                         aria-valuemax="100"></div>
                                </div>


                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                        onClick={this.onFormClose}>Закрыть
                                </button>
                                <button type="submit" className="btn btn-primary"
                                        disabled={(this.state.processBar !== 0) ? true : false}>Добавить
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        )
    }

}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(AlbumAddModal);

