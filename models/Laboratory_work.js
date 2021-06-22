const{Schema, model} = require('mongoose')

const schema = new Schema({
    name:{type:String},
    discipline: [{ name: String }],
})

module.exports = model('Laboratory_work', schema)