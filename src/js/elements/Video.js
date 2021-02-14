import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import VideoAddModal from "./VideoAddModal";
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
        let owner_id = this.props.owner_id;

        const url = `/api/video/get?owner_id=${owner_id}&offset=${this.state.offset}&count=${this.state.count}`;

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
                                <video controls style={{width: '100%'}}>
                                    <source src={`${global.urlServer}/${video.file.url}`} type={video.file.type} />
                                </video>
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
        let access = this.props.access;
        let url
        if (this.props.owner_id > 0)
            url = `/user/id${this.props.owner_id}/video`
        else
            url = `/group/id${-this.props.owner_id}/video`

        return (
            <>
                <VideoAddModal owner_id={this.props.owner_id}/>

                <div className="row">
                    <div className="col-lg-12 block-white">

                        <p className="h3">
                            {access ? <button type="button" className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#modalVideoAdd">+</button> : null} <Link to={url}>Все видео</Link>
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

