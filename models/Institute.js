const{Schema, model} = require('mongoose')

const schema = new Schema({
    name:{type:String, required: true},
    housing:{type:String, required:true},
    location:{type:String, required:true},
})

module.exports = model('Institute', schema)