const{Schema, model} = require('mongoose')

const schema = new Schema({
    name:{type:String, required:true},
    headman:{type:String, required:true}
})

module.exports = model('Group', schema)