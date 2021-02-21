import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import VideoAddModal from "../elements/VideoAddModal";
import Album from "../elements/Album";
import ElementVideo from "../objects/Video";
//import { Player } from 'video-top-react';


class Video extends Component {
    constructor () {
        super();

        this.state = {
            response: {
                count: 0,
                items: [],
                users: []
            },
            count: 4,
            offset: 0,
            arVideo: []
        }

        this.Get = this.Get.bind(this)
    }

    async componentDidMount () {
        await this.Get();
    }

    async Get () {
        //id владельца списка видео
        let owner_id = this.props.match.params.id
        //пользователь или группа
        if (this.props.match.params.owner === 'group')
            owner_id = -owner_id
        //альбом
        let album_id = this.props.match.params.album_id
        if (!this.props.match.params.album_id)
            album_id = 0

        const url = `/api/video/get?owner_id=${owner_id}&album_id=${album_id}&offset=${this.state.offset}&count=${this.state.count}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if (!result.response) return

        this.setState(prevState => ({
            response: result.response,
            arVideo: [...prevState.arVideo, ...result.response.items],
            offset: prevState.offset + prevState.count
        }))
    }

    ListVideo (arVideo) {
        return (
            <div className="row">
                { arVideo.map(function (video, i, arVideo) {

                    return ( <div className="col-lg-6" key={i}>
                        <div className="card">
                            <div className="card-body">
                                <ElementVideo object={video}/>
                                <p className="card-text">
                                    <Link to={`/video/id${video.id}`} >{video.title}</Link>
                                </p>
                            </div>

                        </div>
                    </div>)
                })}
            </div>
        )
    }

    render() {
        let owner_id = this.props.match.params.id
        if (this.props.match.params.owner === 'group')
            owner_id = -owner_id

        let album_id = this.props.match.params.album_id

        let access = true//this.props.access;

        return (
            <>
                <VideoAddModal owner_id={owner_id}/>

                <div className="row">
                    <div className="col-lg-12 block-white">
                        {!album_id ? <Album access={access} owner_id={owner_id}/> : null}
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12 block-white">

                        <p className="h3">
                            {access ? <button type="button" className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#modalVideoAdd">+</button> : null} Видео
                        </p>

                        {(this.state.arVideo.length) ? this.ListVideo(this.state.arVideo) : <p>Видео еще не загружено</p>}

                        {(this.state.arVideo.length < this.state.response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={this.Get}>еще видео ...</button> : null}

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
)(Video);

