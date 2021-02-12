import React, {Component} from 'react';
import {connect} from 'react-redux';

class Blog extends Component {
    constructor () {
        super();

    }

    async componentDidMount () {
        await this.Get();
    }

    async Get (event) {
        //let id = this.props.match.params.id;
        //console.log(id)

    }

    render() {
        //let id = this.props.match.params.id;

        return (
            <>
                <div className="row">
                    <div className="col-lg-12 block-white">

                        <p className="h3">Блог <button type="button" className="btn btn-success btn-sm">+</button></p>

                        <div className="card" style={{marginTop: 10}}>

                            <div className="card-body">
                                <p>Алмазный фонд Российской Федерации - открытая в 1967 году выставка в Оружейной палате Московского Кремля, структурное подразделение Гохрана России. В коллекцию фонда входят шедевры ювелирного искусства XVIII-XX веков, а также самородки и драгоценные камни исторического и художественного значения.</p>

                                <div className="row">
                                    <div className="col-lg-4">
                                        <img  className="" style={{maxWidth: "100%", borderRadius: '10px',maxHeight: 300}} src="https://klike.net/uploads/posts/2019-11/1574605225_22.jpg"/>
                                    </div>

                                    <div className="col-lg-4">
                                        <img  className="" style={{maxWidth: "100%", borderRadius: '10px',maxHeight: 300}} src="https://vastphotos.com/files/uploads/photos/10252/mountains-in-autumn-landscape-l.jpg"/>
                                    </div>

                                    <div className="col-lg-4">
                                        <img  className="" style={{maxWidth: "100%", borderRadius: '10px',maxHeight: 300}} src="https://c.pxhere.com/images/43/96/3a72b34abb52d062e8352975e48f-1585865.jpg!d"/>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div className="card" style={{marginTop: 10}}>

                            <div className="card-body">
                                <p>Алмазный фонд Российской Федерации - открытая в 1967 году выставка в Оружейной палате Московского Кремля, структурное подразделение Гохрана России. В коллекцию фонда входят шедевры ювелирного искусства XVIII-XX веков, а также самородки и драгоценные камни исторического и художественного значения.</p>

                                <div className="row">
                                    <div className="col-lg-4">
                                        <img  className="" style={{maxWidth: "100%", borderRadius: '10px',maxHeight: 300}} src="https://klike.net/uploads/posts/2019-11/1574605225_22.jpg"/>
                                    </div>

                                    <div className="col-lg-4">
                                        <img  className="" style={{maxWidth: "100%", borderRadius: '10px',maxHeight: 300}} src="https://vastphotos.com/files/uploads/photos/10252/mountains-in-autumn-landscape-l.jpg"/>
                                    </div>

                                    <div className="col-lg-4">
                                        <img  className="" style={{maxWidth: "100%", borderRadius: '10px',maxHeight: 300}} src="https://c.pxhere.com/images/43/96/3a72b34abb52d062e8352975e48f-1585865.jpg!d"/>
                                    </div>

                                </div>

                            </div>
                        </div>
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
)(Blog);

