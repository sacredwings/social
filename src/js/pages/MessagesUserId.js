import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import ElementMessageAdd from "../elements/MessageAdd";

class MessagesId extends Component {
    constructor () {
        super();

        this.state = {
            arMessages: []
        }
    }

    async componentDidMount () {
        await this.GetUsers();
    }

    async GetUsers (event) {

        //запрос
        let result = await axios.get(`/api/message/getByUserId?user_id=${this.props.match.params.id}`);
        result = result.data;
        console.log(result)

        //ответ со всеми значениями
        if ((result) && (result.err === 0)) {

            if (result.response)
                this.setState({arMessages: result.response});
            else
                this.setState({arMessages: []});

        }

    }

    //подготовка текста сообщения
    MessageInRead (message) {
        //входящие
        let result = <p>Вы: &crarr; {message.message}</p>

        if (message.in)
            result = <p>{message.message}</p>

        //чтение
        if (message.read)
            return result

        return <div className="alert alert-secondary" role="alert">
            {result}
        </div>

    }
    
    arMessages (arMessages) {
        let _this = this
        console.log(this)
        return (
            <div className="row">
                {arMessages.map(function (message, i) {

                    return <div key={i} className="list-group">
                        <div className="list-group-item list-group-item-action">
                            <div className="row">
                                <div className="col-12">
                                    <div style={{
                                        maxHeight: '100px',
                                        maxWidth: '100px',
                                        float: 'left'
                                    }}>
                                        <img style={{maxHeight: '100px', maxWidth: '100px'}} src="https://www.freelancejob.ru/upload/663/32785854535177.jpg" alt="..."/>
                                    </div>
                                    <div style={{marginLeft: '75px'}}>
                                        <div>
                                            <b>{message.user_name}</b>
                                            <button style={{float: 'right'}} type="button" className="close" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div>
                                            {_this.MessageInRead(message)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </div>

        )
    }

    /*
                            <Link to={`/messages/id${message.user_id}`} className="list-group-item list-group-item-action">
                            <div className="row">
                                <div className="col-12">
                                    <div style={{
                                        maxHeight: '100px',
                                        maxWidth: '100px',
                                        float: 'left'
                                    }}>
                                        <img style={{maxHeight: '100px', maxWidth: '100px'}} src="https://www.freelancejob.ru/upload/663/32785854535177.jpg" alt="..."/>
                                    </div>
                                    <div style={{marginLeft: '75px'}}>
                                        <div>
                                            <b>{message.user_name}</b>
                                        </div>
                                        <div>
                                            {_this.MessageInRead(message)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
     */
    render() {
        console.log(this.state.arMessages)
        return (
            <>
                <div className='row'>
                    <div className='col-lg-12'>
                        Сообщения пользователю id: {this.props.match.params.id}
                        {this.arMessages(this.state.arMessages)}
                    </div>
                </div>
                <div className='row'>
                    <div className='col-lg-12'>
                        <ElementMessageAdd user_id={2}/>
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
)(MessagesId);

