const {Router} = require('express')
const router = Router()
const Discipline = require('../models/Discipline')


router.get("/all", function(req, res){
    Discipline.find((err, mark) => {
        res.send(mark)
    })
});

router.post("/add", async function (req, res) {
    const {name} = req.body
    const candidate = await Discipline.findOne({name})
    if (candidate){
        return res.status(400).json({message: "Такая дисциплина уже есть"})
    }
    const mark = new Discipline({name})
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
    const candidate = await Discipline.findOneAndUpdate({_id: id}, {name: req.body.name})
    candidate.save()
    //console.log(candidate)
    return res.send(candidate);
});

module.exports = router