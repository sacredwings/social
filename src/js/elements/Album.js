import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import AlbumAddModal from "./AlbumAddModal";
import { Player } from 'video-react';
import Config from "../../config.json";


class Album extends Component {
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
        let owner_id = this.props.owner_id; /* из прямой передачи */

        if (!this.props.owner_id) { /* из url */
            owner_id = this.props.match.params.id
            if (this.props.match.params.owner === 'group')
                owner_id = -owner_id
        }

        const url = `/api/video/getAlbums?owner_id=${owner_id}&offset=${this.state.offset}&count=${this.state.count}`;

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
        let owner = (this.props.owner_id>0) ? 'user' : 'group'
        let id = (this.props.owner_id>0) ? this.props.owner_id : -this.props.owner_id

        return (
            <div className="row">
                { arVideo.map(function (video, i, arVideo) {

                    return ( <div className="col-md-3" key={i}>
                        <div className="card">
                            <div className="card-body">
                                <img src={`${global.urlServer}/${video.image_id.url}`} style={{width: '100%'}}/>
                                <p className="card-text">
                                    <Link to={`/${owner}/id${id}/video/album_id${video.id}`} >{video.title}</Link>
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
                <AlbumAddModal owner_id={this.props.owner_id}/>

                <div className="row">
                    <div className="col-lg-12 block-white">

                        <p className="h3">
                            {access ? <button type="button" className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#modalAlbumAdd">+</button> : null} Альбомы
                        </p>

                        {(this.state.arVideo.length) ? this.ListVideo(this.state.arVideo) : <p>Альбомов нет</p>}

                        {(this.state.arVideo.length < this.state.response.count) ? <button type="button" style={{marginTop: '10px'}} className="btn btn-light" onClick={this.Get}>еще альбомы ...</button> : null}

                    </div>
                </div>

                <hr />
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
)(Album);

