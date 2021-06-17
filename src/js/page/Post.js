import React, {Component} from 'react';
import {connect} from 'react-redux';

class Post extends Component {
    constructor () {
        super();

    }

    async componentDidMount () {
        await this.get();
    }

    async get (event) {
        let id = this.props.match.params.id;
        console.log(id)


    }

    render() {
        let id = this.props.match.params.id;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <h1>Пост</h1>
                        id: {id}
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
)(Post);

