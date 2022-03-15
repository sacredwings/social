import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import MessageAdd from "./MessageAdd";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function MessageAddModal (props) {
    let [formCode, setFormCode] = useState(getRandomInt(0, 9999))

    //при добавлении сообщения закрываем модульное окно
    const Add = () => {
        window.$(`#modalMessageAdd${formCode}_close`).trigger('click')
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
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id={`modalMessageAdd${formCode}_close`}>Закрыть</button>
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

