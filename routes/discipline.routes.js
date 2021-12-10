const {Router} = require('express')
const router = Router()
const Discipline = require('../models/Discipline')
const mongoose = require('mongoose')

router.get("/all", function(req, res){
    Discipline.find((err, mark) => {
        res.send(mark)
    })
});

router.post("/add", async function (req, res) {
    const {name} = req.body
    const group = {_id: mongoose.Types.ObjectId(req.body.group.id) , name: req.body.group.name}
    const candidate = await Discipline.findOne({name})
    if (candidate){
        return res.status(400).json({message: "Такая дисциплина уже есть"})
    }
    const mark = new Discipline({name, group})
    await mark.save()
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    //console.log(id)
    Discipline.deleteOne({
        _id: id
    }, function(err){
        if (err) {
            console.log(err)
        }
        else {
            return res.send("Removed");
        }
    });
});

router.get("/:id", function(req, res){
    const id = req.params.id
    Discipline.findOne({_id: id}, (err, mark) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.send(mark);
        }
    })
});

router.put("/edit", async function(req, res){
    const id = req.body.id
    const group = {_id: req.body.group[0] , name: req.body.group[1]}
    const candidate = await Discipline.findOneAndUpdate({_id: id}, {name: req.body.name, group: group})
    candidate.save()
    //console.log(candidate)
    return res.send(candidate);
});

module.exports = router