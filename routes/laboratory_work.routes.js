const {Router} = require('express')
const router = Router()
const LabWork = require('../models/Laboratory_work')
const mongoose = require('mongoose')

router.get("/all", function(req, res){
    LabWork.find((err, dir) => {
        res.send(dir)
    })
});

router.post("/add", async function (req, res) {
    const name = req.body.name
    const discipline = {_id: mongoose.Types.ObjectId(req.body.discipline.id) , name: req.body.discipline.name}
    console.log(name,discipline)
    //const candidate = await LabWork.findOne({name})
    // if (candidate){
    //     return res.status(400).json({message: "Такая л.р. уже есть"})
    // }
    const dir = new LabWork({name,discipline})
    await dir.save()
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    LabWork.deleteOne({
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
    LabWork.findOne({_id: id}, (err, dir) => {
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
    const discipline = {_id: req.body.discipline[0] , name: req.body.discipline[1]}
    const candidate = await LabWork.findOneAndUpdate({_id: id},
        {name: name,discipline: discipline})
    candidate.save()
    console.log(candidate)
    return res.send(candidate);
});

module.exports = router