const {model,Schema} = require('mongoose');

const userSchema = new Schema({
    email: {type:String,unique:true},
    userName: {type:String,unique:true},
    password: {type:String},
    createdAt:{type:String},
    followings:[
        {
            type:Schema.Types.ObjectId,
            ref:'users'
        }
    ],
    followers:[
        {
            type:Schema.Types.ObjectId,
            ref:'users'
        }
    ],
})

module.exports = model('User',userSchema);