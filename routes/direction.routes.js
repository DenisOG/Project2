const {Router} = require('express')
const router = Router()
const Direction = require('../models/Direction')


router.get("/all", function(req, res){
    Direction.find((err, dir) => {
        res.send(dir)
    })
});

router.post("/add", async function (req, res) {
    const {name} = req.body
    const {form_of_education} = req.body
    const {course_of_study} = req.body
    const candidate = await Direction.findOne({name})
    if (candidate){
        return res.status(400).json({message: "Такое направление уже есть"})
    }
    const dir = new Direction({name,form_of_education,course_of_study})
    await dir.save()
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Direction.deleteOne({
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
    Direction.findOne({_id: id}, (err, dir) => {
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
    const candidate = await Direction.findOneAndUpdate({_id: id},
        {name: req.body.name,form_of_education: req.body.form_of_education,course_of_study: req.body.course_of_study})
    candidate.save()
    console.log(candidate)
    return res.send(candidate);
});

module.exports = router