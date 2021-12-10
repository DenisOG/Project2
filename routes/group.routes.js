const {Router} = require('express')
const router = Router()
const Group = require('../models/Group')


router.get("/all", function(req, res){
    Group.find((err, dir) => {
        res.send(dir)
    })
});

router.post("/add", async function (req, res) {
    const {name} = req.body
    const {headman} = req.body
    const {headman2} = req.body
    const candidate = await Group.findOne({name})
    if (candidate){
        return res.status(400).json({message: "Такая группа уже есть"})
    }
    const dir = new Group({name,headman})
    await dir.save()
});

router.delete("/:id", function(req, res){
    const id = req.params.id;
    console.log(id)
    Group.deleteOne({
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
    Group.findOne({_id: id}, (err, dir) => {
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
    const candidate = await Group.findOneAndUpdate({_id: id},
        {name: req.body.name,headman: req.body.headman,headman2: req.body.headman2})
    candidate.save()
    console.log(candidate)
    return res.send(candidate);
});

module.exports = router