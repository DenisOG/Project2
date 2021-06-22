import React, {useContext} from "react"
import {NavLink,useHistory} from "react-router-dom"
import {AuthContext} from "../context/AuthContext"
import {makeStyles} from "@material-ui/core"

export const Navbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push("/")
    }

    const useStyles = makeStyles((theme) => ({
        exit:{
            backgroundColor:'#F85858',
            color:'black',
            fontWeight:'bold',
            borderRadius:10,
            fontFamily: 'Noto Sans JP, cursive',
        },
        lii:{
            borderRadius:10
        },
        navwrapper:{
            padding: '0 1rem',
            height:64,
            fontFamily: 'Noto Sans JP,cursive',
            background:'#2196f3',
            width:'100%',
            position: 'fixed',
            top: 0,
            zIndex:100
        }

    }));

    const classes = useStyles()
    return(
        <nav>
            <div className={classes.navwrapper}>
                <span className="brand-logo black-text">MOODUSE</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink className={classes.lii} to="/progress">Успеваемость</NavLink></li>
                    <li><NavLink className={classes.lii} to="/laboratorywork">Лаб. работы</NavLink></li>
                    <li><NavLink className={classes.lii} to="/discipline">Дисциплины</NavLink></li>
                    <li><NavLink className={classes.lii} to="/group">Группы</NavLink></li>
                    <li><NavLink className={classes.lii} to="/student">Студенты</NavLink></li>
                    <li><NavLink className={classes.lii} to="/chair">Кафедры</NavLink></li>
                    <li><NavLink className={classes.lii} to="/institute">Институты</NavLink></li>
                    <li><NavLink className={classes.lii} to="/professor">Преподаватели</NavLink></li>
                    <li><NavLink className={classes.lii} to="/direction">Направления</NavLink></li>
                    <li><a href="/" onClick={logoutHandler} className={classes.exit}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}