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
import ReactHTMLTableToExcel from "react-html-table-to-excel";

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
        marginTop: -130,
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
    },
    excel:{
        backgroundColor: '#7FFF00',
        borderRadius:5,
        marginLeft:360,
        marginTop:10,
        padding:7
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
                const response = await fetch("/api/laboratorywork/all")
                let count = 0
                if (response.ok === true) {
                    const dis = await response.json()
                    if (document.querySelector("tr")) {
                        document.querySelector("tr").remove()
                    }
                    const tr = document.createElement("tr");
                    const groupTd = document.createElement("th");
                    groupTd.innerHTML = ""
                    tr.appendChild(groupTd);
                    dis.forEach(fio => {
                        if(form.discipline !== undefined)
                            if(fio.discipline[0].name === form.discipline["name"])
                            {
                                const groupTd = document.createElement("th");
                                groupTd.innerHTML = "Лаб " + fio.name
                                tr.appendChild(groupTd);
                                count++
                                console.log(fio.name)
                            }
                           })
                    for (let i = 0; i < stud.length; i++)
                    {
                        if (document.querySelector("tr")) {
                            document.querySelector("tr").remove()
                        }
                    }
                    for (let i = 0; i < stud.length; i++)
                    {
                        const tbody = document.getElementsByTagName('tbody')[0]
                        const trbody = document.createElement("tr");
                        const groupTd = document.createElement("td");
                        groupTd.innerHTML = stud[i]
                        trbody.append(groupTd);
                        for (let i = 0; i < count; i++)
                        {
                            const text = document.createElement("td");
                            text.contentEditable = "true"
                            text.innerHTML = "0"
                            trbody.append(text);
                        }


                        tbody.appendChild(trbody)
                    }
                    const thead = document.getElementsByTagName('thead')[0]

                    thead.appendChild(tr)


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

    // getMark()

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

    const zap = []
    async function Dis () {
        const response = await fetch("/api/discipline/all")
        if (response.ok === true) {
            const dis = await response.json()
            dis.forEach(house => {

                if(form.discipline !== undefined)
                    if(house.name === form.discipline["name"])
                        zap.push({id:house.group[0].id, name: house.group[0].name})
            })
        }
    }


    StudFind()
    const stud = []
    async function StudFind () {
        const response = await fetch("/api/student/all")
        if (response.ok === true) {
            const dis = await response.json()
            dis.forEach(house => {
                if(house.gruopp[0].name === form.gruopp["name"])
                {
                    stud.push(house.name)
                }

            })
        }
    }
    // StudFind()
    function row(dis) {

        if (document.querySelector("tr[data-rowid='" + dis._id + "']")) {
            document.querySelector("tr[data-rowid='" + dis._id + "']").remove()
        }

        console.log(dis)
        const tr = document.createElement("tr");
        tr.setAttribute("style", "padding:10px;");
        tr.setAttribute("data-rowid", dis._id);

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
                        disabled={form.discipline === "" || form.gruopp === ""}
                >
                    Показать
                </Button>
            </form>

            <CssBaseline/>
            <main>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Paper className={classes.paper}>
                                <table id="excel">
                                    <thead>

                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>

                            </Paper>
                        </Grid>
                    </Grid>
                </Container>

            </main>
            <ReactHTMLTableToExcel className={classes.excel}
                                   table="excel"
                                   filename="excel"
                                   sheet="Sheet"
                                   buttonText="Экспорт Excel"
            />
        </div>
    );
}