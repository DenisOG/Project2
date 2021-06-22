import React, {useState} from "react"
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from "@material-ui/core/Button"
import {TextField} from "@material-ui/core"
import {useHttp} from "../hooks/http.hooks"
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
    root: {

    },

    button: {
        position:"absolute",
        margin: 10,
        width: 120,
        marginTop: 160,
        marginLeft: 700,
        fontFamily: 'Noto Sans JP,cursive'
    },
    text1:{
        position:"absolute",
        marginLeft: 700,
        marginTop: 90,
        width: 300,
        fontFamily: 'Noto Sans JP,cursive'
    },
    text2:{
        position:"absolute",
        marginTop: 95,
        marginLeft: 700,
        width: 300,
        fontFamily: 'Noto Sans JP,cursive'
    },
    container: {
        marginTop: -75,
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
    select:{
        marginLeft: 700,
        width: 300,
        fontFamily: 'Noto Sans JP,cursive'
    }
}));

let id_edit = ''

export default function ProfessorPage() {

    document.body.style = 'background: #E6E6FA'
    document.title = "MOODUSE"
    const classes = useStyles();
    const {request} = useHttp()
    const [form, setForm] = useState({
        id: '', name: '', idChair: '', chair:'', position:''
    })
    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value, [event.target.id]: event.target.value})
    }

    const addHandler = async () => {
        if (id_edit !== '') {
            const form = document.forms["disForm"];
            const name = form.elements["name"].value;
            const chair = form.elements["chair"].value;
            const position = form.elements["position"].value;
            EditUser(id_edit, name, chair, position)
            id_edit = ''
        } else {
            try {
                // console.log(form.name)
                const data = await request('/api/professor/add', 'POST', {...form})
                // console.log(data)
                if (data.ok === true) {
                    const dis = await data.name
                    document.querySelector("tbody").append(row(dis));
                }
            } catch (e) {

            }
        }
    }

    async function getItem() {
        const response = await fetch("/api/professor/all")
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
        const response = await fetch("/api/professor/" + id);
        if (response.ok === true) {
            const dis = await response.json()
            setForm({...form, id: dis._id, name: dis.name,
                idChair: dis.chair[0]._id,
                chair:dis.chair[0].name, position:dis.position})
            id_edit = dis._id;
        }
    }

    async function DeleteUser(id) {
        const response = await fetch("/api/professor/" + id, {
            method: "DELETE",
            headers: {"Accept": "application/json"}
        });
        if (response.ok === true) {
            document.querySelector("tr[data-rowid='" + id + "']").remove()
        }
    }
    const zap = []
    async function Dis () {
        const response = await fetch("/api/chair/all")
        if (response.ok === true) {
            const dis = await response.json()
            dis.forEach(house => {
                zap.push({id:house._id, name: house.name})
            })
        }
    }
    //console.log(zap)
    async function EditUser(disId, disName, disChair, disPosition) {
        const response = await fetch("api/professor/edit", {
            method: "PUT",
            headers: {"Accept": "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({
                id: disId,
                name: disName,
                chair: [form.idChair, disChair],
                position: disPosition
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

        const chairTd = document.createElement("td");
        chairTd.setAttribute("style", "padding:5px; text-align: center");
        chairTd.append(dis.chair[0].name);
        tr.append(chairTd);

        const positionTd = document.createElement("td");
        positionTd.setAttribute("style", "padding:5px; text-align: center");
        positionTd.append(dis.position);
        tr.append(positionTd);

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
    //console.log(zap)
        return tr;
    }

    return (
        <div className={classes.root}>
            <form noValidate name="disForm">
                <TextField className={classes.text2}
                           id="name"
                           label="ФИО"
                           onChange={changeHandler}
                           value={form.name}
                           name="name"
                           autoFocus
                           multiline
                           variant="standard"
                           size="small"
                           margin="normal"
                />
                <Autocomplete className={classes.select}
                              id="chair"
                              renderInput={(params) =>
                                  <TextField {...params} label="Кафедра" variant="standard" />}
                              onClick={Dis()}
                              options={zap}
                              onChange={(event, value) =>
                                  setForm({ ...form, idChair: value.id,  chair: value})}
                              autoComplete="chair"
                              getOptionLabel={(option) => {
                                  if (option.hasOwnProperty('name')) {
                                      return option.name;
                                  }
                                  return option;
                              }}
                              value={form.chair}
                />

                <TextField className={classes.text1}
                           id="position"
                           label="Должность"
                           onChange={changeHandler}
                           value={form.position}
                           name="position"
                           autoFocus
                           multiline
                           variant="standard"
                           size="small"
                           margin="normal"
                />

                <Button className={classes.button}
                        name="institute"
                        id="institute"
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
                    <Grid container spacing={1}>
                        <Grid item xs={8}>
                            <Paper className={classes.paper}>
                                <table>
                                    <thead>
                                    <tr>
                                        <th className={classes.zag}>ФИО</th>
                                        <th className={classes.zag}>Кафедра</th>
                                        <th className={classes.zag}>Должность</th>
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