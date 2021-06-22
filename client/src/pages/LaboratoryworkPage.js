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
        marginTop: 100,
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

export default function LaboratoryworkPage() {

    document.body.style = 'background: #E6E6FA'
    document.title = "MOODUSE"
    const classes = useStyles();
    const {request} = useHttp()
    const [form, setForm] = useState({
        id: '', name: '',idDiscipline:'',discipline:''
    })
    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value, [event.target.id]: event.target.value})
    }

    const addHandler = async () => {
        if (id_edit !== '') {
            const form = document.forms["disForm"];
            const name = form.elements["name"].value;
            const discipline = form.elements["discipline"].value;
            //console.log(name,discipline)
            EditUser(id_edit, name, discipline)
            id_edit = ''
        } else {
            try {
                const data = await request('/api/laboratorywork/add', 'POST', {...form})
                console.log(data)
                if (data.ok === true) {
                    const dis = await data.name
                    document.querySelector("tbody").append(row(dis));
                }
            } catch (e) {

            }
        }
    }

    async function getItem() {
        const response = await fetch("/api/laboratorywork/all")
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
        const response = await fetch("/api/laboratorywork/" + id);
        if (response.ok === true) {
            const dis = await response.json()
            setForm({...form, id: dis._id, name: dis.name,
                idDiscipline: dis.discipline[0]._id,
                discipline:dis.discipline[0].name})
            id_edit = dis._id;
        }
    }

    async function DeleteUser(id) {
        const response = await fetch("/api/laboratorywork/" + id, {
            method: "DELETE",
            headers: {"Accept": "application/json"}
        });
        if (response.ok === true) {
            document.querySelector("tr[data-rowid='" + id + "']").remove()
        }
    }
    const zap = []
    async function Dis () {
        const response = await fetch("/api/discipline/all")
        if (response.ok === true) {
            const dis = await response.json()
            dis.forEach(house => {
                zap.push({id:house._id, name: house.name})
            })
        }
    }

    async function EditUser(disId, disName, disLaboratorywork) {
        const response = await fetch("api/laboratorywork/edit", {
            method: "PUT",
            headers: {"Accept": "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({
                id: disId,
                name: disName,
                discipline: [form.idDiscipline, disLaboratorywork]
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
                <Autocomplete className={classes.select}
                              id="discipline"
                              renderInput={(params) =>
                                  <TextField {...params} label="Дисциплина" variant="standard" />}
                              onClick={Dis()}
                              options={zap}
                              onChange={(event, value) =>
                                  setForm({ ...form, idDiscipline: value.id,  discipline: value})}
                              autoComplete="discipline"
                              getOptionLabel={(option) => {
                                  if (option.hasOwnProperty('name')) {
                                      return option.name;
                                  }
                                  return option;
                              }}
                              value={form.discipline}
                />

                <TextField className={classes.text1}
                           id="name"
                           label="Лаб.работа"
                           onChange={changeHandler}
                           value={form.name}
                           name="name"
                           autoFocus
                           multiline
                           variant="standard"
                           size="small"
                           margin="normal"
                />

                <Button className={classes.button}
                        name="button"
                        id="button"
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
                                        <th className={classes.zag}>Лаб.работа</th>
                                        <th className={classes.zag}>Дисциплина</th>
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