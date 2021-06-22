const {Router} = require('express')
const router = Router()
const Professor = require('../models/Professor')
const mongoose = require('mongoose')

router.get("/all", function(req, res){
    Professor.find((err, dir) => {
        res.send(dir)
    })
});

router.post("/add", async function (req, res) {
    //console.log(req.body)
    const name = req.body.name
    const chair = {_id: mongoose.Types.ObjectId(req.body.chair.id) , name: req.body.chair.name}
    const position = req.body.position
    const candidate = await Professor.findOne({name})
    if (candidate){
        return res.status(400).json({message: "Такой преподаватель уже есть"})
    }
    // console.log(name, chair, position)
    const dir = new Professor({name, chair,position})
    //console.log(dir)
    await dir.save()
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Professor.deleteOne({
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
    Professor.findOne({_id: id}, (err, dir) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.send(dir);
        }
    })
});

router.put("/edit", async function(req, res){
    //console.log(req.body)
    const id = req.body.id
    const name = req.body.name
    const chair = {_id: req.body.chair[0] , name: req.body.chair[1]}
    const position = req.body.position
    const candidate = await Professor.findOneAndUpdate({_id: id},
        {name: name, chair: chair, position: position})
    candidate.save()
    console.log(candidate)
    return res.send(candidate);
});

module.exports = router