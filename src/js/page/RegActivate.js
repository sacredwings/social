import React, {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom'
import {connect} from "react-redux";
import axios from "axios";
import {ServerUrl} from '../util/proxy'

//https://oauth.vk.com/token?grant_type=password&client_id=2274003&client_secret=hHbZxrka2uZ6jB1inYsH&username=%D0%9B%D0%9E%D0%93%D0%98%D0%9D&password=%D0%9F%D0%90%D0%A0%D0%9E%D0%9B%D0%AC&captcha_key=q24yud&captcha_sid=656412648896

function RegActivate (props) {
    const {code} = useParams()
    //запрос
    let [form, setForm] = useState({
        phone: '',
        code: '',
        err: null,
        msg: ''
    })
    //отслеживаем изменение props
    useEffect(async () => {
        await onClickReg()

    }, [])


    async function onClickReg (event) {

        console.log(code.length)
        //проверка полей
        if (code.length !== 32) return

        //запрос
        let result = await axios.post(`${ServerUrl()}/api/user/regActivate`, {
            code: code,
        });
        console.log(result)
        result = result.data;
        console.log(result)

        //ответ со всеми значениями
        if ((result) && (result.err === 0)) {
            console.log('удачно')
            //запоминаем состояние

            setForm(prev => ({...prev,...{
                err: 0,
            }}))
            //this.props.Store_myUser(result.login, result.tid, result.token, this.state.remember);
        } else {
            setForm(prev => ({...prev,...{
                    err: result.err,
                    msg: result.msg
                }}))
        }

    }

    function alertErr () {
        if ((form.err !== null) && (form.err === 0)) {
            return (
                <div className="alert alert-success" role="alert">
                    Активация нового пользователя прошла успешно. <Link to={"/auth"} type="submit" className="btn btn-primary">Войти</Link>
                </div>
            )
        }
        if ((form.err !== null) && (form.err !== 0)) {
            return (
                <div className="alert alert-warning" role="alert">
                    {form.msg}
                </div>
            )
        }
    }

    return (
        <div className="container">
            <div className="row">

                <h3>Подтверждение регистрации</h3>

                <div className="card-body">{alertErr()}</div>

            </div>
        </div>
    )

}
/*
class RegActivate extends Component {
    constructor () {
        super();
        this.state = {
            phone: '',
            code: '',
            err: null,
            msg: ''
        };

        this.alertErr = this.alertErr.bind(this);
    }

    async componentDidMount () {
        this.onClickReg();
    }

    async onClickReg (event) {
        let code = this.props.match.params.code;

        //проверка полей
        if (code.length !== 32) return

        //запрос
        let result = await axios.post('/api/user/regActivate', {
            code: code,
        });
        console.log(result)
        result = result.data;
        console.log(result)

        //ответ со всеми значениями
        if ((result) && (result.err === 0)) {
            console.log(this)
            console.log('удачно')
            //запоминаем состояние
            this.setState({err: 0});
            //this.props.Store_myUser(result.login, result.tid, result.token, this.state.remember);
        } else {
            this.setState({err: result.err, msg: result.msg});
        }

    }

    alertErr () {
        if ((this.state.err !== null) && (this.state.err === 0)) {
            return (
                <div className="alert alert-success" role="alert">
                    Активация нового пользователя прошла успешно. <Link to={"/auth"} type="submit" className="btn btn-primary">Войти</Link>
                </div>
            )
        }
        if ((this.state.err !== null) && (this.state.err !== 0)) {
            return (
                <div className="alert alert-warning" role="alert">
                    {this.state.msg}
                </div>
            )
        }
    }

    render() {
        let errMsg = this.alertErr();

        return (
            <div className="container">
                <div className="row">

                    <h3>Подтверждение регистрации</h3>

                    {errMsg? <div className="card-body">{errMsg}</div> : null}

                </div>
            </div>
        )
    }

}
*/

export default connect (

)(RegActivate);
