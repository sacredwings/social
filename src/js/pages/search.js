import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import axios from "axios";
import SearchUser from "../elements/SearchUser";

class Search extends Component {
    constructor () {
        super();

        this.state = {
            q: '', //текущее изменение поля
        }
        this.onChangeText = this.onChangeText.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    async componentDidMount () {

    }

    onChangeText(e) {
        let name = e.target.id;
        let value = e.target.value;

        this.setState({[name]:value})
    }

    async onFormSubmit (e) {
        e.preventDefault() // Stop form submit

        /*
        this.setState(prevState => ({
            queryQ: prevState.q,
        }))*/
    }

    render() {

        return (
            <div className="row">
                <div className="col-lg-12">

                    <form className="row g-3" onSubmit={this.onFormSubmit}>
                        <div className="col-9">
                            <input type="text" className="form-control" id="q" placeholder="Поиск" value={this.state.q} onChange={this.onChangeText}/>
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary mb-3">Найти</button>
                        </div>
                    </form>

                    <SearchUser q={this.state.q}/>
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
)(Search);

