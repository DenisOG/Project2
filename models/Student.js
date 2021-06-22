const{Schema, model} = require('mongoose')

const schema = new Schema({
    name:{type:String, required: true},
    gruopp: [{ name: String }],
    direction: [{ name: String }],
})

module.exports = model('Student', schema)