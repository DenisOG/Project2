const {Router} = require('express')
const router = Router()
const Student = require('../models/Student')
const mongoose = require('mongoose')


router.get("/all", function(req, res){
    Student.find((err, dir) => {
        res.send(dir)
    })
});

router.post("/add", async function (req, res) {
    const name = req.body.name
    const gruopp = {_id: mongoose.Types.ObjectId(req.body.gruopp.id) , name: req.body.gruopp.name}
    const direction = {_id: mongoose.Types.ObjectId(req.body.direction.id) , name: req.body.direction.name}
    const candidate = await Student.findOne({name})
    if (candidate){
        return res.status(400).json({message: "Такой студент уже есть"})
    }
    const dir = new Student({name,gruopp,direction})
    await dir.save()
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Student.deleteOne({
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
    Student.findOne({_id: id}, (err, dir) => {
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
    const direction = {_id: req.body.direction[0] , name: req.body.direction[1]}
    const candidate = await Student.findOneAndUpdate({_id: id},
        {name: name, gruopp: gruopp, direction: direction})
    candidate.save()
    console.log(candidate)
    return res.send(candidate);
});

module.exports = router