import React, {useState} from "react"
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from "@material-ui/core/Button"
import {TextField} from "@material-ui/core"
import {useHttp} from "../hooks/http.hooks"
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
    root: {

    },

    button: {
        position:"absolute",
        margin: 10,
        width: 120,
        marginTop: 200,
        marginLeft: 500,
        fontFamily: 'Noto Sans JP,cursive'
    },
    text:{
        position:"absolute",
        //marginTop: -280,
        marginLeft: 500,
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
    select:{
        position:'absolute',
        marginTop:80,
        marginLeft: 500,
        width: 300,
        fontFamily: 'Noto Sans JP,cursive'
    }
}));

let id_edit = ''

export default function DisciplinePage() {
    document.body.style = 'background: #E6E6FA'
    document.title = "MOODUSE"

    const classes = useStyles();
    const {request} = useHttp()
    const [form, setForm] = useState({
        id: '', name: '',idGroup: '',group:''
    })
    const changeHandler = event => {

        setForm({...form, [event.target.name]: event.target.value, [event.target.id]: event.target.value})
    }

    const addHandler = async () => {
        if (id_edit !== '') {
            const form = document.forms["disForm"];
            const name = form.elements["name"].value;
            const group = form.elements["group"].value;
            EditUser(id_edit, name,group)
            id_edit = ''
        } else {
            try {
                const data = await request('/api/discipline/add', 'POST', {...form})
                if (data.ok === true) {
                    const dis = await data.name
                    document.querySelector("tbody").append(row(dis));
                }
            } catch (e) {

            }
        }
    }


    async function getMark() {
        const response = await fetch("/api/discipline/all")
        if (response.ok === true) {
            const dis = await response.json()
            let rows = document.querySelector("tbody")
            dis.forEach(mark => {
                rows.append(row(mark))
            })
        }
    }

    getMark()

    async function getID(id) {
        id_edit = ''
        const response = await fetch("/api/discipline/" + id);
        if (response.ok === true) {
            const dis = await response.json()
            setForm({...form, id: dis._id, name: dis.name,
                idGroup: dis.group[0]._id,
                group:dis.group[0].name})
            id_edit = dis._id;
        }
    }

    async function DeleteUser(id) {
        const response = await fetch("/api/discipline/" + id, {
            method: "DELETE",
            headers: {"Accept": "application/json"}
        });
        if (response.ok === true) {
            document.querySelector("tr[data-rowid='" + id + "']").remove()
        }
    }

    const zap = []
    async function Dis () {
        const response = await fetch("/api/group/all")
        if (response.ok === true) {
            const dis = await response.json()
            dis.forEach(house => {
                zap.push({id:house._id, name: house.name})
            })
        }
    }

    async function EditUser(disId, disName,disGroup) {
        const response = await fetch("api/discipline/edit", {
            method: "PUT",
            headers: {"Accept": "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({
                id: disId,
                name: disName,
                group: [form.idGroup, disGroup]
            })
        });
        if (response.ok === true) {
            const dis = await response.json()
            getMark()
            row(dis)
        }
    }

    function row(dis) {
        console.log(dis)
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

        const groupTd = document.createElement("td");
        groupTd.setAttribute("style", "padding:5px; text-align: center");
        //console.log(dis.group[0].name);
        groupTd.append(dis.group[0].name);
        tr.append(groupTd);

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
                <TextField className={classes.text}
                           id="name"
                           label="Дисциплина"
                           onChange={changeHandler}
                           value={form.name}
                           name="name"
                           autoComplete="name"
                           autoFocus
                           multiline
                           variant="standard"
                           size="small"
                           margin="normal"
                />

                <Autocomplete className={classes.select}
                              id="group"
                              renderInput={(params) =>
                                  <TextField {...params} label="Группа" variant="standard" />}
                              onClick={Dis()}
                              options={zap}
                              onChange={(event, value) =>
                                  setForm({ ...form, idGroup: value.id,  group: value})}
                              autoComplete="group"
                              getOptionLabel={(option) => {
                                  if (option.hasOwnProperty('name')) {
                                      return option.name;
                                  }
                                  return option;
                              }}
                              value={form.group}
                />

                <Button className={classes.button}
                        type="button"
                        variant="contained"
                        onClick={addHandler}
                        color="primary"
                        disabled={form.name === ""}
                >
                    Сохранить
                </Button>
            </form>

            <CssBaseline/>
            <main>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <table>
                                    <thead>
                                    <tr>
                                        <th className={classes.zag}>Дисциплина</th>
                                        <th className={classes.zag}>Группа</th>
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