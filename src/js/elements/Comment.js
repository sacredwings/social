import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import CommentAdd from "./CommentAdd";
import axios from "axios";
import {Player} from "video-react";
import Config from "../../config.json";

class Comments extends Component {
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
            arComments: [],
            arUsers: []
        }

    }

    async componentDidMount () {
        await this.Get();
    }

    async Get (event) {
        let module = this.props.module;
        let object_id = this.props.object_id;

        const url = `/api/comment/get?module=${module}&object_id=${object_id}&offset=${0}&count=${20}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        this.setState(prevState => ({
            response: result.response,
            arComments: [...prevState.arComments, ...result.response.items],
            arUsers: [...prevState.arComments, ...result.response.users],
            offset: prevState.offset + prevState.count
        }))

    }

    SearchUser (id) {
        for (let user of this.state.arUsers) {
            if (id === user.id) return user
        }
    }

    ElementFiles (files) {
        return <>
            { files.map((file, i) => {

                //видео
                if (file.type === 'video/mp4')
                    return ( <div className="col-md-4" key={i}>
                        <Player>
                            <source src={`${global.urlServer}/${file.url}`}/>
                        </Player>
                    </div>)

                //картинка
                if ((file.type === 'image/gif') || (file.type === 'image/png') || (file.type === 'image/jpeg'))
                    return ( <div className="col-md-4" key={i}>
                        <img src={`${global.urlServer}/${file.url}`} style={{width: '100%'}}/>
                    </div>)

            })}
        </>
    }

    List (comments) {
        let _this = this
        return (
            <>
                { comments.map(function (comment, i) {
                    comment.user = _this.SearchUser(comment.from_id)
                    return ( <div className="col-lg-6" key={i}>
                        <ul className="list-unstyled">
                            <li className="media">
                                <img src={comment.user.personal_photo ? `${global.urlServer}/${comment.user.personal_photo.url}` : "https://n.sked-stv.ru/wa-data/public/site/sked/unnamed.jpg"} className="mr-3" alt="..." style={{maxWidth: '64px', maxHeight: '64px', float: 'left'}}/>
                                <div className="media-body" >
                                    <h5 className="mt-0 mb-1">{comment.user.name}</h5>
                                    <p> {comment.text}</p>
                                    <div className="row">
                                        {comment.files ? _this.ElementFiles(comment.files) : null}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>)
                })}
            </>
        )
    }

    render() {


        return (
            <>
                <div className="row">
                    <div className="col-lg-12">
                        <hr/>
                        {this.List(this.state.arComments)}
                        <hr/>
                        {this.props.myUser.auth ? <CommentAdd module={this.props.module} object_id={this.props.object_id}/> : null}
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
)(Comments);

