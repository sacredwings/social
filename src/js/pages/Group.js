import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import ElementVideo from "../elements/Video";
import ElementTopic from "../elements/Topic";


class User extends Component {
    constructor () {
        super();

        this.state = {
            pageLoad: false,
            group:null
        }
    }

    async componentDidMount () {
        await this.Get();
    }

    async Get (event) {
        let group_id = this.props.match.params.id;
        console.log(group_id)

        //запрос
        let result = await axios.get(`/api/group/getById?ids=${group_id}`, {});
        result = result.data;

        //ответ со всеми значениями
        if ((result) && (result.err === 0)) {

            this.setState({pageLoad: true});
            if ((result.response) && (result.response[0]))
                this.setState({group: result.response[0]});
            else
                this.setState({group: false});

        }

    }

    Group(group) {

        let access = false
        if (group.create_id === this.props.myUser.id) access = true

        return (

            <div className="row">
                <div className="col-lg-9">

                    <div className="row">
                        <div className="col-lg-12 block-white">
                            <h1 className="display-6">{group.title}</h1>

                        </div>
                    </div>

                    <ElementVideo owner_id={-Number (this.props.match.params.id)} access={access}/>
                    <ElementTopic owner_id={-Number (this.props.match.params.id)} access={access}/>

                </div>
                <div className="col-lg-3">

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="block-white">
                                <img style={{maxWidth: "100%", borderRadius: '10px'}} src={group.photo ? `${global.urlServer}/${group.photo.url}` : "https://svgsilh.com/svg/479631.svg" }/>
                            </div>
                        </div>
                    </div>
                    <div className="d-grid gap-2">
                        {(access ? <Link to={`/group/settings_id${group.id}`} type="button" className="btn btn-primary btn-sm btn-block">Настройки</Link> : null)}
                    </div>
                </div>
            </div>

        )
    }
//<ElementBlog />

    render() {

        console.log(this.state.group)
        return (
            (this.state.group ? this.Group(this.state.group) : null)
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

