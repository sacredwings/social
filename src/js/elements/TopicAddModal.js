import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {ReCaptcha} from 'recaptcha-v3-react';

class TopicAddModal extends Component {
    constructor () {
        super();
        this.state = {
            files: null,
            inputTitle: '',
            inputText: '',
            processBarLoaded: 0,
            processBarTotal: 0,
            processBar: 0
        }

        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChangeFiles = this.onChangeFiles.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
        this.onFormClose = this.onFormClose.bind(this)

    }

    async componentDidMount () {

    }

    onChangeFiles(e) {
        this.setState({files:e.target.files})
    }

    onChangeText(e) {
        let name = e.target.id;
        let value = e.target.value;

        this.setState({[name]:value})
    }

    onFormClose(e) {

        this.setState({
            files: null,
            inputTitle: '',
            inputText: '',
            processBarLoaded: 0,
            processBarTotal: 0,
            processBar: 0
        })
    }

    onFormSubmit (e) {
        e.preventDefault() // Stop form submit

        this.recaptcha.execute() /* сброс reCaptcha */
        let _this = this

        const url = '/api/topic/add';
        const formData = new FormData();

        if ((this.state.files) && (this.state.files.length))
            for (let i=0; i < this.state.files.length; i++)
                formData.append(`files[${i}]`, this.state.files[i])

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
    }

    render() {
        return (

            <div className="modal fade" id="modalTopicAdd" tabIndex="-1" aria-labelledby="modalTopicAdd"
                 aria-hidden="true">

                <ReCaptcha
                    ref={ref => this.recaptcha = ref}
                    action='settings'
                    sitekey={global.gappkey}
                    verifyCallback={token => this.setState({gtoken: token})}
                />
                <form onSubmit={this.onFormSubmit}>

                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Новое обсуждение</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <div className="mb-3">
                                    <label htmlFor="inputTitle" className="form-label">Название</label>
                                    <input type="text" className="form-control" id="inputTitle" onChange={this.onChangeText} value={this.state.inputTitle}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="inputText" className="form-label">Описание</label>
                                    <textarea className="form-control" id="inputText" rows="5" onChange={this.onChangeText} value={this.state.inputText}></textarea>
                                </div>

                                <div className="mb-3 form-file">
                                    <input type="file" className="form-file-input" id="inputFile" onChange={this.onChangeFiles} multiple={true}/>
                                    <label className="form-file-label" htmlFor="inputFile">
                                        <span className="form-file-text">Выберите файлы...</span>
                                        <span className="form-file-button">Обзор</span>
                                    </label>
                                </div>

                                {((this.state.processBar >0) && (this.state.processBar <100)) ? <div className="mb-3"><p className="text-primary">Загружаю</p></div>:null}
                                {(this.state.processBar === 100) ? <div className="mb-3"><p className="text-success">Загружено</p></div>:null}
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${this.state.processBar}%`}} aria-valuenow={this.state.processBar} aria-valuemin="0" aria-valuemax="100"></div>
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
)(TopicAddModal);

