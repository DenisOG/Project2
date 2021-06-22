import React from "react"
import {Container} from "react-bootstrap"
import {makeStyles} from "@material-ui/core/styles";
import {CssBaseline} from "@material-ui/core";

export const Footer = () => {

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '55vh',
        },
        main: {
            marginTop: theme.spacing(8),
            marginBottom: theme.spacing(2),
        },
        footer: {
            padding: theme.spacing(3, 2),
            marginTop: 'auto',
            background:"black",
            fontSize:15,
            fontFamily: 'Noto Sans JP,cursive',
        },
        foot: {
            color:"white"
        },
    }));
    const classes = useStyles();

    return(

        <div className={classes.root}>
            <CssBaseline />
            <footer className={classes.footer}>
                <Container fluid className={classes.foot}>
                    <div className="footer">
                        <div className="footer1 center" style={{textDecoration:"underline"}}> Тех. поддержка: 89000010101<br/>
                            Эл. почта: isteh@mail.ru
                        </div>
                        <div className="footer2 right" style={{marginRight:10,marginTop:-30,fontSize:11}}> MOODUSE<br/>
                            © 2018-2021
                        </div>
                    </div>
                </Container>
            </footer>
        </div>
    )
}
