const{Schema, model} = require('mongoose')

const schema = new Schema({
    number_of_points:{type:String},
    group: [{ name: String }],
    discipline: [{ name: String }],
})

module.exports = model('Progress', schema)