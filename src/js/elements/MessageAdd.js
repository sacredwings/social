import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import {ReCaptcha} from 'recaptcha-v3-react';

class MessageAdd extends Component {
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

        if (result.err) return; //ошибка, не продолжаем обработку

    }

    onFormClose() {
        //сброс формы
        this.setState({
            message: '',
        })
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit}>

                <ReCaptcha
                    ref={ref => this.recaptcha = ref}
                    action='settings'
                    sitekey={global.gappkey}
                    verifyCallback={token => this.setState({gtoken: token})}
                />

                <div className="row">
                    <div className="col-12">
                        <label htmlFor="message" className="form-label">Новое сообщение</label>
                        <textarea className="form-control" id="message" rows="5" onChange={this.onChangeText}></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Отправить</button>
                    </div>
                </div>
            </form>

        )
    }

}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(MessageAdd);

