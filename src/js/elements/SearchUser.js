import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import TopicAddModal from "../elements/TopicAddModal";

class SearchUser extends Component {
    constructor () {
        super();

        this.state = {
            response: {
                count: 0,
                items: []
            },
            count: 20,
            offset: 0,
            arUser: [],
            q: ''
        }
    }

    static async getDerivedStateFromProps(props, state) {
        console.log(this)
        console.log(props.q)
    }

    async componentDidMount () {
        await this.Get();
    }

    async Get (event) {
        let q = this.props.q;

        const url = `/api/user/search?q=${q}&offset=${this.state.offset}&count=${this.state.count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        this.setState(prevState => ({
            response: result.response,
            arUser: [...prevState.arUser, ...result.response.items],
            offset: prevState.offset + prevState.count
        }))
    }

    arUser (arUser) {
        return (
            <div className="row">
                Здесь пользователи
                { arUser.map(function (user, i) {
                    return ( <div className="list-group" key={i}>
                        <Link to={`/user/id${user.id}`} className="list-group-item list-group-item-action">{user.name}</Link>
                    </div>)
                })}
            </div>
        )
    }

    render() {
        let q = this.props.q;

        return (
            <div className="row">
                <div className="col-lg-12">
                    {(this.state.arUser.length) ? this.arUser(this.state.arUser) : <p>Пользователи не найдены</p>}
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
)(SearchUser);

