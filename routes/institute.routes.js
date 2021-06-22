const {Router} = require('express')
const router = Router()
const Institute = require('../models/Institute')


router.get("/all", function(req, res){
    Institute.find((err, dir) => {
        res.send(dir)
    })
});

router.post("/add", async function (req, res) {
    const {name} = req.body
    const {housing} = req.body
    const {location} = req.body
    const candidate = await Institute.findOne({name})
    if (candidate){
        return res.status(400).json({message: "Такой институт уже есть"})
    }
    const dir = new Institute({name,housing,location})
    await dir.save()
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Institute.deleteOne({
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
    Institute.findOne({_id: id}, (err, dir) => {
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
    const candidate = await Institute.findOneAndUpdate({_id: id},
        {name: req.body.name, housing: req.body.housing, location: req.body.location})
    candidate.save()
    console.log(candidate)
    return res.send(candidate);
});

module.exports = router