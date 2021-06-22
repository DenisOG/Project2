const{Schema, model} = require('mongoose')

const schema = new Schema({
    name:{type:String, required: true},
    chair: [{ name: String }],
    position:{type:String, required:true},
})

module.exports = model('Professor', schema)