import React, {useState} from "react"
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from "@material-ui/core/Button"
import {TextField} from "@material-ui/core"
import {useHttp} from "../hooks/http.hooks"

const useStyles = makeStyles((theme) => ({
    root: {

    },

    button: {
        position:"absolute",
        margin: 10,
        width: 120,
        marginTop: 250,
        marginLeft: 700,
        fontFamily: 'Noto Sans JP,cursive'
    },
    text1:{
        position:"absolute",
        marginLeft: 700,
        width: 300,
        fontFamily: 'Noto Sans JP,cursive'
    },
    text2:{
        position:"absolute",
        marginTop: 80,
        marginLeft: 700,
        width: 300,
        fontFamily: 'Noto Sans JP,cursive'
    },
    text3:{
        position:"absolute",
        marginTop: 280,
        marginLeft: 700,
        width: 300,
        fontFamily: 'Noto Sans JP,cursive'
    },
    container: {
        marginTop: 10,
        fontFamily: 'Noto Sans JP,cursive'
    },
    paper: {
        padding: 15,
        backgroundColor: '#FFFAFA',
        border:'1px solid',
        fontFamily: 'Noto Sans JP,cursive'
    },
    disForm:{
        position:'absolute',
        fontFamily: 'Noto Sans JP,cursive'
    },
    zag:{
        textAlign:"center",
        fontFamily: 'Noto Sans JP,cursive'
    },
    number:{
        position:"absolute",
        marginTop: 150,
        marginLeft: 700,
        fontFamily: 'Noto Sans JP,cursive'
    },
    tr:{
        borderRadius:3
    }
}));

let id_edit = ''

export default function GroupPage() {

    document.body.style = 'background: #E6E6FA'
    document.title = "MOODUSE"
    const classes = useStyles();
    const {request} = useHttp()
    const [form, setForm] = useState({
        id: '', name: '',headman:''
    })
    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value, [event.target.id]: event.target.value})
    }

    const addHandler = async () => {
        if (id_edit !== '') {
            const form = document.forms["disForm"];
            const name = form.elements["name"].value;
            const headman = form.elements["headman"].value;
            //const headman2 = form.elements["headman2"].value;
            EditUser(id_edit, name, headman)
            id_edit = ''
        } else {
            try {
                const data = await request('/api/group/add', 'POST', {...form})
                if (data.ok === true) {
                    const dis = await data.name
                    document.querySelector("tbody").append(row(dis));
                }
            } catch (e) {

            }
        }
    }


    async function getItem() {
        const response = await fetch("/api/group/all")
        if (response.ok === true) {
            const dis = await response.json()
            let rows = document.querySelector("tbody")
            dis.forEach(house => {
                rows.append(row(house))
            })
        }
    }

    getItem()

    async function getID(id) {
        id_edit = ''
        const response = await fetch("/api/group/" + id);
        if (response.ok === true) {
            const dis = await response.json()
            setForm({...form, id: dis._id, name: dis.name,
                headman:dis.headman,
                //headman2:dis.headman2
            })
            id_edit = dis._id;
        }
    }

    async function DeleteUser(id) {
        const response = await fetch("/api/group/" + id, {
            method: "DELETE",
            headers: {"Accept": "application/json"}
        });
        if (response.ok === true) {
            document.querySelector("tr[data-rowid='" + id + "']").remove()
        }
    }

    async function EditUser(disId, disName, disHeadman,disHeadman2) {
        const response = await fetch("api/group/edit", {
            method: "PUT",
            headers: {"Accept": "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({
                id: disId,
                name: disName,
                headman: disHeadman,
                //headman2: disHeadman2
            })
        });
        if (response.ok === true) {
            const dis = await response.json()
            getItem()
            row(dis)
        }
    }

    function row(dis) {

        if (document.querySelector("tr[data-rowid='" + dis._id + "']")) {
            document.querySelector("tr[data-rowid='" + dis._id + "']").remove()
        }

        const tr = document.createElement("tr");
        tr.setAttribute("style", "padding:10px;");
        tr.setAttribute("data-rowid", dis._id);

        const nameTd = document.createElement("td");
        nameTd.setAttribute("style", "padding:5px; text-align: center");
        nameTd.append(dis.name);
        tr.append(nameTd);

        const headmanTd = document.createElement("td");
        headmanTd.setAttribute("style", "padding:5px; text-align: center");
        headmanTd.append(dis.headman);
        tr.append(headmanTd);

        // const headman2Td = document.createElement("td");
        // headman2Td.setAttribute("style", "padding:5px; text-align: center");
        // headman2Td.append(dis.headman2);
        // tr.append(headman2Td);

        const linksTd = document.createElement("td");
        linksTd.setAttribute("style", "cursor:pointer;margin:10px;");

        const editLink = document.createElement("a");
        editLink.setAttribute("data-id", dis._id);
        editLink.setAttribute("style", "cursor:pointer;margin:10px;");
        editLink.append("Изменить");
        editLink.addEventListener("click", e => {
            e.preventDefault();
            getID(dis._id);
        });
        linksTd.append(editLink);

        const removeLink = document.createElement("a");
        removeLink.setAttribute("data-id", dis._id);
        removeLink.setAttribute("style", "cursor:pointer;margin:10px; margin-bottom: 10px;");
        removeLink.append("Удалить");
        removeLink.addEventListener("click", e => {
            e.preventDefault();
            DeleteUser(dis._id);
        });

        linksTd.append(removeLink);
        tr.appendChild(linksTd);

        return tr;
    }

    return (
        <div className={classes.root}>
            <form noValidate name="disForm">
                <TextField className={classes.text1}
                           id="name"
                           label="Группа"
                           onChange={changeHandler}
                           value={form.name}
                           name="name1"
                           autoFocus
                           multiline
                           variant="standard"
                           size="small"
                           margin="normal"
                />
                <TextField className={classes.text2}
                           id="headman"
                           label="Староста"
                           onChange={changeHandler}
                           value={form.headman}
                           name="headman"
                           multiline
                           variant="standard"
                           size="small"
                           margin="normal"
                />
                {/*<TextField className={classes.text3}*/}
                {/*           id="headman2"*/}
                {/*           label="Староста"*/}
                {/*           onChange={changeHandler}*/}
                {/*           value={form.headman2}*/}
                {/*           name="headman2"*/}
                {/*           multiline*/}
                {/*           variant="standard"*/}
                {/*           size="small"*/}
                {/*           margin="normal"*/}
                {/*/>*/}
                <Button className={classes.button}
                        type="button"
                        variant="contained"
                        onClick={addHandler}
                        color="primary"
                        disabled={form.name === "" || form.headman===""}
                >
                    Сохранить
                </Button>
            </form>

            <CssBaseline/>
            <main>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={1}>
                        <Grid item xs={8}>
                            <Paper className={classes.paper}>
                                <table>
                                    <thead>
                                    <tr>
                                        <th className={classes.zag}>Группа</th>
                                        <th className={classes.zag}>Староста</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
}