import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import {ReCaptcha} from "recaptcha-v3-react";

class CommentsAdd extends Component {
    constructor () {
        super();

        this.state = {
            files: null,
            inputText: '',
            processBarLoaded: 0,
            processBarTotal: 0,
            processBar: 0
        }

        this.onFormSubmitFile = this.onFormSubmitFile.bind(this)
        this.onChangeFiles = this.onChangeFiles.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
    }

    async componentDidMount () {

    }

    onChangeFiles(e) {
        this.setState({files:e.target.files})
        console.log(e.target.files)
    }

    onChangeText(e) {
        let name = e.target.id;
        let value = e.target.value;

        this.setState({[name]:value})
    }

    onFormSubmitFile (e) {
        this.recaptcha.execute() /* сброс reCaptcha */

        let module = this.props.module;
        let object_id = this.props.object_id;

        let _this = this

        const url = '/api/comment/add';
        const formData = new FormData();

        if ((this.state.files) && (this.state.files.length))
            for (let i=0; i < this.state.files.length; i++)
                formData.append(`files[${i}]`, this.state.files[i])

        formData.append('module', module)
        formData.append('object_id', object_id)
        formData.append('text', this.state.inputText)
        formData.append('gtoken', this.state.gtoken)

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
            <>
                <div className="row">

                    <ReCaptcha
                        ref={ref => this.recaptcha = ref}
                        action='settings'
                        sitekey={global.gappkey}
                        verifyCallback={token => this.setState({gtoken: token})}
                    />

                    <div className="col-lg-12">
                        <form onSubmit={this.onFormSubmitFile}>

                            <div className="mb-3">
                                <label htmlFor="inputText" className="form-label">Новый комментарий</label>
                                <textarea className="form-control" id="inputText" rows="5" onChange={this.onChangeText} value={this.state.inputText}></textarea>
                            </div>
                            <p>Прикрепить файлы</p>
                            <div className="mb-3 form-file">
                                <input type="file" className="form-file-input" id="inputFile" onChange={this.onChangeFiles} multiple={true}/>
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
                            <button type="submit" className="btn btn-primary" disabled={(this.state.processBar !== 0) ? true : false}>Добавить комментарий</button>

                        </form>
                    </div>
                </div>

            </>
        )
    }
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(CommentsAdd);

