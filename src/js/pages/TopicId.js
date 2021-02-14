import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from "axios";
//import {Player} from "video-top-react";
import Comment from "../elements/Comment";

class TopicId extends Component {
    constructor () {
        super();

        this.state = {
            topic: null,
        }
    }

    async componentDidMount () {
        await this.Get();
    }

    async Get (event) {
        let id = this.props.match.params.id;
        console.log(`Загрузка ${id}`)

        const url = `/api/topic/getById?ids=${id}`;

        let result = await axios.get(url);

        result = result.data;
        if (result.err) return; //ошибка, не продолжаем обработку

        if ((!result.response) || (!result.response[0])) return

        this.setState({topic: result.response[0]})

    }
    ElementFiles (files) {
        return <>
            { files.map((file, i) => {

                //видео
                if (file.type === 'video/mp4')
                    return ( <div className="col-md-4" key={i}>
                        <video controls>
                            <source src={`${global.urlServer}/${file.url}`} type="video/mp4"/>
                        </video>
                    </div>)

                //картинка
                if ((file.type === 'image/gif') || (file.type === 'image/png') || (file.type === 'image/jpeg'))
                    return ( <div className="col-md-4" key={i}>
                        <img src={`${global.urlServer}/${file.url}`} style={{width: '100%'}}/>
                    </div>)

        })}
        </>
    }

    Element (topic) {
        return <>
            <div className="row">
                <div className="col-12">
                    <h1>Тема для обсуждения</h1>
                    <h2>{topic.title}</h2>
                    <p>{topic.text}</p>

                    <div className="row">
                        {topic.files ? this.ElementFiles(topic.files) : null}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Comment module='topic' object_id={topic.id}/>
                </div>
            </div>
        </>
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        {(this.state.topic) ? this.Element(this.state.topic) : null}
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
)(TopicId);

