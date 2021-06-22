import React, {useContext, useEffect, useState} from "react"
import {useHttp} from "../hooks/http.hooks"
import {useMessage} from "../hooks/message.hook"
import {AuthContext} from "../context/AuthContext"

export const AuthPage = () =>{
    document.body.style = 'background: #E6E6FA'
    document.title = "MOODUSE"
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request,error, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '',password: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error,message,clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event =>{
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
        }catch (e) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        }catch (e) {}
    }

    return(
        <div className="row" style={{fontFamily: 'Noto Sans JP,cursive',paddingBottom:199}}>
            <div className="col s6 offset-s3">
                <div className="card #616161 grey darken-2" style={{borderRadius:14}}>
                    <div className="header"
                         style={{height:50,textAlign:"left", padding:11, fontSize:20, borderTopRightRadius:13, borderTopLeftRadius:13, background:'#2196f3'}}>
                        MOODUSE
                    </div>
                    <div className="card-content white-text">
                        <span className="card-title center">Авторизация</span>
                        <div>

                            <div className="input-field">
                                <input placeholder="Введите Email" id="email"
                                       type="text" name="email" className="blue-input"
                                       onChange={changeHandler}/>
                                    <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-field">
                                <input placeholder="Введите пароль" id="password"
                                       type="password" name="password" className="blue-input"
                                       onChange={changeHandler}/>
                                <label htmlFor="email">Пароль</label>
                            </div>

                        </div>
                        <button className="bth blue-text" onClick={loginHandler}
                                style={{margin:2, width:170, height:40, border:"2px solid",background:"rgba(0,0,0,0)",
                                    fontSize:18,borderRadius:7,fontFamily: 'Noto Sans JP,cursive'}}
                                disabled={loading}>Войти</button>
                        <button className="bth grey lighten-1 black-text" onClick={registerHandler}
                                style={{position:'absolute', margin:2,marginLeft:55, width:170, height:40,
                                    border:"2px solid #2196f3",fontSize:18,borderRadius:7,fontFamily: 'Noto Sans JP,cursive'}}
                                disabled={loading}>Регистрация</button>
                    </div>
                </div>
            </div>
        </div>
    )
}