const {model,Schema} = require('mongoose');

const userSchema = new Schema({
    email: {type:String,unique:true},
    userName: {type:String},
    password: {type:String},
    createdAt:{type:String}
})

module.exports = model('User',userSchema);