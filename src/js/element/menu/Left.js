import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import ElementAuth from "../auth/Auth";

class WidgetLetMenu extends Component {
    render() {
        return (
           <div className="row">
               {(this.props.myUser.auth) ?
                   <>
                       <nav className="nav flex-column menu-left">
                           <Link className="nav-link " to="/search"><i className="fas fa-search"></i> Поиск</Link>
                           <Link className="nav-link " to={`/user/${this.props.myUser.id}`}><i className="far fa-address-card"></i> Моя страница</Link>
                           {/*<Link className="nav-link " to="/messages"><i className="fas fa-sms"></i> Сообщения</Link>
                           <Link className="nav-link " to="/video"><i className="fas fa-film"></i> Видео</Link>
                           <Link className="nav-link " to="/friends"><i className="fas fa-user-friends"></i> Друзья</Link>*/}
                           <Link className="nav-link " to="/settings"><i className="fas fa-user-cog"></i> Настройки</Link>
                       </nav>
                   </>
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