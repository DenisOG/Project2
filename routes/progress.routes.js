const {Router} = require('express')
const router = Router()
const Progress = require('../models/Progress')
const mongoose = require('mongoose')


router.get("/all", function(req, res){
    Progress.find((err, dir) => {
        res.send(dir)
    })
});

router.post("/add", async function (req, res) {
    const name = req.body.name
    const gruopp = {_id: mongoose.Types.ObjectId(req.body.gruopp.id) , name: req.body.gruopp.name}
    const discipline = {_id: mongoose.Types.ObjectId(req.body.discipline.id) , name: req.body.discipline.name}
    const dir = new Progress({name,gruopp,discipline})
    await dir.save()
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Progress.deleteOne({
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
    Progress.findOne({_id: id}, (err, dir) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.send(dir);
        }
    })
});

router.put("/edit", async function(req, res){
    const id = req.body.id
    const name = req.body.name
    const gruopp = {_id: req.body.gruopp[0] , name: req.body.gruopp[1]}
    const discipline = {_id: req.body.discipline[0] , name: req.body.discipline[1]}
    const candidate = await Progress.findOneAndUpdate({_id: id},
        {name: name, gruopp: gruopp, discipline: discipline})
    candidate.save()
    console.log(candidate)
    return res.send(candidate);
});

module.exports = router