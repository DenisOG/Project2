const{Schema, model} = require('mongoose')

const schema = new Schema({
    name:{type:String, required: true},
    group: [{ name: String }],

})

module.exports = model('Discipline', schema)