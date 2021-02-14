import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
import {ReCaptcha} from 'react-top-recaptcha-v3';

class MessageAddModal extends Component {
    constructor () {
        super();
        this.state = {
            message: ''
        }

        this.onFormClose = this.onFormClose.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChangeText = this.onChangeText.bind(this)
    }

    async componentDidMount () {

    }

    onChangeText(e) {
        let name = e.target.id;
        let value = e.target.value;

        this.setState({[name]:value})
    }

    async onFormSubmit (e) {
        this.recaptcha.execute() /* сброс reCaptcha */
        e.preventDefault() // Stop form submit

        let user_id = this.props.user_id

        let arFields = {
            to_id: this.props.user_id,
            message: this.state.message,
            gtoken: this.state.gtoken
        }

        const url = `/api/message/add`;

        let result = await axios.post(url, arFields);

        result = result.data;
        console.log(result)
        if (result.err) return; //ошибка, не продолжаем обработку


    }

    onFormClose() {

        this.setState({
            message: '',
        })
    }

    render() {
        return (

            <div className="modal fade" id="modalMessageAdd" tabIndex="-1" aria-labelledby="modalMessageAdd" aria-hidden="true">

                <ReCaptcha
                    ref={ref => this.recaptcha = ref}
                    action='settings'
                    sitekey={global.gappkey}
                    verifyCallback={token => this.setState({gtoken: token})}
                />

                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={this.onFormSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Сообщение пользователю</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.onFormClose}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Текст сообщения</label>
                                    <textarea className="form-control" id="message" rows="5" onChange={this.onChangeText}></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                                <button type="submit" className="btn btn-primary">Добавить</button>
                            </div>
                        </form>


                    </div>
                </div>
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
)(MessageAddModal);

