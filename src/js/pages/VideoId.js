import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
//import {Player} from "video-top-react";
import Comment from "../elements/Comment";
import ElementVideo from "../objects/Video";

class VideoId extends Component {
    constructor () {
        super();

        this.state = {
            video: null
        }
    }

    async componentDidMount () {
        await this.Get();
    }

    async Get (event) {
        let id = this.props.match.params.id;

        const url = `/api/video/getById?ids=${id}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку
        if ((!result.response) || (!result.response[0])) return

        this.setState({video: result.response[0]})
    }

    Element (video) {
        return <>
            <div className="row">
                <div className="col-12">
                    <h1>Видео</h1>
                    <h2>{video.title}</h2>
                    <ElementVideo object={video}/>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Comment module='video' object_id={video.id}/>
                </div>
            </div>
        </>
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        {(this.state.video) ? this.Element(this.state.video) : null}
                    </div>
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
)(VideoId);

