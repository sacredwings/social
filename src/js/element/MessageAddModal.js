import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import MessageAdd from "../element/MessageAdd";
import {ServerUrl} from '../util/proxy'

function MessageAddModal (props) {

    //при добавлении сообщения закрываем модульное окно
    const Add = () => {
        window.$('#modalMessageAdd').modal('hide');
    }

    return (

        <div  className="modal fade" id="modalMessageAdd" tabIndex="-1" aria-labelledby="modalMessageAdd"
             aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel"></h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <MessageAdd user_id={props.user_id} add={Add}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default connect (
    state => ({
        myUser: state.myUser,
    }),
    dispatch => ({

    })
)(MessageAddModal);

