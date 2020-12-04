import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import ElementVideo from "../elements/Video";
import ElementTopic from "../elements/Topic";
import ElementGroup from "../elements/Group";
import ElementMessageAdd from "../elements/MessageAddModal";
import Config from "../../config.json";

class User extends Component {
    constructor () {
        super();

        this.state = {
            pageLoad: false,
            user:null
        }
    }

    async componentDidMount () {
        await this.Get();
    }

    async Get (event) {
        let user_id = this.props.match.params.id;
        console.log(user_id)

        //запрос
        let result = await axios.get(`/api/user/getById?ids=${user_id}`, {});
        console.log(result)
        result = result.data;

        //ответ со всеми значениями
        if ((result) && (result.err === 0)) {

            this.setState({pageLoad: true});
            if ((result.response) && (result.response[0]))
                this.setState({user: result.response[0]});
            else
                this.setState({user: false});

        }

    }

    User() {

        let user_id = Number (this.props.match.params.id);
        if (!user_id)
            user_id = this.props.myUser.id;

        let access = false
        if (user_id === this.props.myUser.id) access = true

        return (

            <div className="row">
                <div className="col-lg-3">

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="block-white">
                                <img  className="" style={{maxWidth: "100%", borderRadius: '10px'}} src={this.state.user.personal_photo ? `${global.urlServer}/${this.state.user.personal_photo.url}` : "https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg" }/>
                            </div>
                        </div>
                    </div>

                    {access ? null :
                        <div className="d-grid gap-2">
                            <button type="button" className="btn btn-primary btn-sm btn-block" data-toggle="modal" data-target="#modalMessageAdd">Написать сообщение</button>
                        </div>
                    }
                    <ElementMessageAdd user_id={user_id}/>


                </div>
                <div className="col-lg-9">

                    <div className="row">
                        <div className="col-lg-12 block-white">
                            <h1 className="display-6">{this.state.user.name} {this.state.user.last_name}</h1>

                        </div>
                    </div>

                    <ElementVideo owner_id={Number (this.props.match.params.id)} access={access}/>
                    <ElementTopic owner_id={Number (this.props.match.params.id)} access={access}/>
                    <ElementGroup owner_id={Number (this.props.match.params.id)} access={access}/>


                </div>
            </div>

        )
    }
//<ElementBlog />

    render() {
        console.log('this.state.user')
        console.log(this.state.user)
        return (
            (this.state.user ? this.User(this.state.user) : null)
        )
    }

}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({
        Store_myUser: (login, tokenId, tokenKey, remember) => {
            dispatch({type: 'AUTH', login: login, tokenId: tokenId, tokenKey: tokenKey, remember: remember});
        }
    })
)(User);

