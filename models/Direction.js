const{Schema, model} = require('mongoose')

const schema = new Schema({
    name:{type:String, required:true},
    form_of_education:{type:String, required:true},
    course_of_study:{type:Number, required:true},
})

module.exports = model('Direction', schema)