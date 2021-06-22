const {Router} = require('express')
const router = Router()
const Chair = require('../models/Chair')


router.get("/all", function(req, res){
    Chair.find((err, chair) => {
        res.send(chair)
    })
});

router.post("/add", async function (req, res) {
    const {name} = req.body
    const candidate = await Chair.findOne({name})
    if (candidate){
        return res.status(400).json({message: "Такая кафедра уже есть"})
    }
    const chair = new Chair({name})
    await chair.save()
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Chair.deleteOne({
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
    Chair.findOne({_id: id}, (err, chair) => {
        if (err) {
            console.log(err)
        }
        else {
            return res.send(chair);
        }
    })
});

router.put("/edit", async function(req, res){
    const id = req.body.id
    const candidate = await Chair.findOneAndUpdate({_id: id}, {name: req.body.name})
    candidate.save()
    console.log(candidate)
    return res.send(candidate);
});

module.exports = router