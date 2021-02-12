import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import GroupAddModal from "../elements/GroupAddModal";

class Group extends Component {
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
            arGroup: []
        }
    }

    async componentDidMount () {
        await this.Get();
    }

    async Get (event) {
        let owner_id = this.props.owner_id;

        const url = `/api/group/get?owner_id=${owner_id}&offset=${this.state.offset}&count=${this.state.count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        this.setState(prevState => ({
            response: result.response,
            arGroup: [...prevState.arGroup, ...result.response.items],
            offset: prevState.offset + prevState.count
        }))
    }

    arGroup (arGroup) {
        //<source src={video.path}/>
        return (

            <div className="row">
                { arGroup.map(function (group, i, arGroup) {
                    return ( <div className="col-md-3" key={i}>
                        <div className="card">
                            <img src={`${global.urlServer}/${group.photo.url}`} className="card-img-top" alt="..."/>
                            <div className="card-body">
                                <p className="card-text">
                                    <Link to={`/group/id${group.id}`}>{group.title}</Link>
                                </p>
                            </div>

                        </div>

                    </div>)
                })}
            </div>

        )
    }

    render() {
        let access = this.props.access;

        return (
            <>
                <GroupAddModal />

                <div className="row">
                    <div className="col-lg-12 block-white">

                        <p className="h3">
                            {access ? <button type="button" className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#modalGroupAdd">+</button> : null} Группы
                        </p>

                        <ul className="list-group">

                            {(this.state.arGroup.length) ? this.arGroup(this.state.arGroup) : <p>Групп еще нет</p>}
                        </ul>

                        {(this.state.arGroup.length < this.state.response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={this.Get}>еще видео ...</button> : null}

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
)(Group);

