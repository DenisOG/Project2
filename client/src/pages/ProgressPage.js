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
        marginBottom:100
    },

    button: {
        position:"absolute",
        margin: 10,
        width: 120,
        marginTop: 100,
        marginLeft: 700,
        fontFamily: 'Noto Sans JP,cursive'
    },
    text:{
        position:"absolute",
        //marginTop: -280,
        marginLeft: 700,
        width: 300,
        fontFamily: 'Noto Sans JP,cursive'
    },
    container: {
        marginTop: -150,
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
        marginLeft: 700,
        width: 300,
        fontFamily: 'Noto Sans JP,cursive'
    },
    select1:{
        marginLeft: 700,
        width: 300,
        fontFamily: 'Noto Sans JP,cursive'
    }
}));

let id_edit = ''

export default function StudentPage() {
    document.body.style = 'background: #E6E6FA'
    document.title = "MOODUSE"

    const classes = useStyles();
    const {request} = useHttp()
    const [form, setForm] = useState({
        id: '', name: '',idGroupp:'', gruopp: '',idDirection:'', direction: ''
    })
    const changeHandler = event => {

        setForm({...form, [event.target.name]: event.target.value, [event.target.id]: event.target.value})
    }

    const addHandler = async () => {
        if (id_edit !== '') {
            const form = document.forms["disForm"];
            const name = form.elements["name"].value;
            const gruopp = form.elements["groupp"].value;
            const direction = form.elements["direction"].value;
            EditUser(id_edit, name, gruopp, direction)
            id_edit = ''
        } else {
            try {
                const data = await request('/api/student/add', 'POST', {...form})
                if (data.ok === true) {
                    const dis = await data.name
                    document.querySelector("tbody").append(row(dis));
                }
            } catch (e) {

            }
        }
    }


    async function getMark() {
        const response = await fetch("/api/progress/all")
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
        const response = await fetch("/api/progress/" + id);
        if (response.ok === true) {
            const dis = await response.json()
            setForm({...form, id: dis._id, name: dis.name,
                idGroupp:dis.gruopp[0]._id, gruopp: dis.gruopp[0].name,
                idDirection:dis.direction[0]._id, direction: dis.direction[0].name})
            id_edit = dis._id;
        }
    }

    async function DeleteUser(id) {
        const response = await fetch("/api/progress/" + id, {
            method: "DELETE",
            headers: {"Accept": "application/json"}
        });
        if (response.ok === true) {
            document.querySelector("tr[data-rowid='" + id + "']").remove()
        }
    }

    async function EditUser(disId, disName, disGroupp, disDirection) {
        const response = await fetch("api/progress/edit", {
            method: "PUT",
            headers: {"Accept": "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({
                id: disId,
                name: disName,
                gruopp: [form.idGroupp, disGroupp],
                direction: [form.idDirection, disDirection]
            })
        });
        if (response.ok === true) {
            const dis = await response.json()
            getMark()
            row(dis)
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

    const zap2 = []
    async function Dis2 () {
        const response = await fetch("/api/discipline/all")
        if (response.ok === true) {
            const dis = await response.json()
            dis.forEach(house => {
                zap2.push({id:house._id, name: house.name})
            })
        }
    }


    function row(dis) {

        if (document.querySelector("tr[data-rowid='" + dis._id + "']")) {
            document.querySelector("tr[data-rowid='" + dis._id + "']").remove()
        }

        console.log(dis)
        const tr = document.createElement("tr");
        tr.setAttribute("style", "padding:10px;");
        tr.setAttribute("data-rowid", dis._id);

        // const nameTd = document.createElement("td");
        // nameTd.setAttribute("style", "padding:5px; text-align: center");
        // nameTd.append(dis.name);
        // tr.append(nameTd);

        const groupTd = document.createElement("td");
        groupTd.setAttribute("style", "padding:5px; text-align: center");
        // console.log(dis.gruopp[0].name)
        groupTd.append(dis.gruopp[0].name);
        tr.append(groupTd);

        const disciplineTd = document.createElement("td");
        disciplineTd.setAttribute("style", "padding:5px; text-align: center");
        disciplineTd.append(dis.discipline[0].name);
        tr.append(disciplineTd);

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
                <Autocomplete className={classes.select1}
                              id="discipline"
                              renderInput={(params) =>
                                  <TextField {...params} label="Дисциплина" variant="standard" />}
                              onClick={Dis2()}
                              options={zap2}
                              onChange={(event, value) =>
                                  setForm({ ...form, idDiscipline: value.id,  discipline: value})}
                              getOptionLabel={(option) => {
                                  if (option.hasOwnProperty('name')) {
                                      return option.name;
                                  }
                                  return option;
                              }}
                              value={form.discipline}
                />
                <Autocomplete className={classes.select}
                              id="gruopp"
                              renderInput={(params) =>
                                  <TextField {...params} label="Группа" variant="standard" />}
                              onClick={Dis()}
                              options={zap}
                              onChange={(event, value) =>
                                  setForm({ ...form, idGroupp: value.id,  gruopp: value})}
                              getOptionLabel={(option) => {
                                  if (option.hasOwnProperty('name')) {
                                      return option.name;
                                  }
                                  return option;
                              }}
                              value={form.gruopp}
                />

                <Button className={classes.button}
                        type="button"
                        variant="contained"
                        onClick={addHandler}
                        color="primary"
                        disabled={form.name === ""}
                >
                    Показать
                </Button>
            </form>

            {/*<CssBaseline/>*/}
            {/*<main>*/}
            {/*    <Container maxWidth="lg" className={classes.container}>*/}
            {/*        <Grid container spacing={2}>*/}
            {/*            <Grid item xs={6}>*/}
            {/*                <Paper className={classes.paper}>*/}
            {/*                    <table>*/}
            {/*                        <thead>*/}
            {/*                        <tr>*/}
            {/*                            <th className={classes.zag}>ФИО</th>*/}
            {/*                            <th className={classes.zag}>Группа</th>*/}
            {/*                            <th className={classes.zag}>Направление</th>*/}
            {/*                            <th></th>*/}
            {/*                        </tr>*/}
            {/*                        </thead>*/}
            {/*                        <tbody>*/}
            {/*                        </tbody>*/}
            {/*                    </table>*/}
            {/*                </Paper>*/}
            {/*            </Grid>*/}
            {/*        </Grid>*/}
            {/*    </Container>*/}
            {/*</main>*/}
        </div>
    );
}