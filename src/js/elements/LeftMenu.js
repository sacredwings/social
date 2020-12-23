import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import ElementAuth from "../elements/Auth";

class WidgetLetMenu extends Component {
    render() {
        return (
           <div className="row">
               {(this.props.myUser.auth) ?
                   <nav className="nav flex-column">
                       <Link className="nav-link active" to="/search">Поиск</Link>
                       <Link className="nav-link active" to={`/user/id${this.props.myUser.id}`}>Моя страница</Link>
                       <Link className="nav-link active" to="/messages">Сообщения</Link>
                       <Link className="nav-link active" to="/settings">Настройки</Link>
                   </nav>
                   :
                   <ElementAuth />}
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
)(WidgetLetMenu);