import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import TopicAddModal from "../elements/TopicAddModal";

class Topic extends Component {
    constructor () {
        super();

        this.state = {
            response: {
                count: 0,
                items: [],
                users: []
            },
            count: 20,
            offset: 0,
            arTopic: []
        }
    }

    async componentDidMount () {
        await this.Get();
    }

    async Get (event) {
        let owner_id = this.props.owner_id;

        const url = `/api/topic/get?owner_id=${owner_id}&offset=${this.state.offset}&count=${this.state.count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        this.setState(prevState => ({
            response: result.response,
            arTopic: [...prevState.arTopic, ...result.response.items],
            offset: prevState.offset + prevState.count
        }))
    }

    arTopic (arTopic) {
        //<source src={video.path}/>
        return (

            <div className="row">
                { arTopic.map(function (topic, i, arTopic) {
                    return ( <div className="list-group" key={i}>
                        <Link to={`/topic/id${topic.id}`} className="list-group-item list-group-item-action">{topic.title}</Link>
                    </div>)
                })}
            </div>

        )
    }

    render() {
        let access = this.props.access;

        return (
            <>
                <TopicAddModal owner_id={this.props.owner_id}/>

                <div className="row">
                    <div className="col-lg-12 block-white">

                        <p className="h3">
                            {access ? <button type="button" className="btn btn-success btn-sm" data-toggle="modal" data-target="#modalTopicAdd">+</button> : null} Обсуждения
                        </p>

                        <ul className="list-group">

                            {(this.state.arTopic.length) ? this.arTopic(this.state.arTopic) : <p>Тем для обсуждений еще нет</p>}
                        </ul>

                        {(this.state.arTopic.length < this.state.response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={this.Get}>еще видео ...</button> : null}

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
)(Topic);

