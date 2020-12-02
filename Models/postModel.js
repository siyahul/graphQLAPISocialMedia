const {model,Schema} = require('mongoose');

const postSchema = new Schema({
    caption:{type:String},
    image:{type:String},
    userName:{type:String},
    createdAt:{type:String},
    comments:[
        {
            userName: {type:String},
            body: {type:String},
            createdAt: {type:String},
            id: {type:Schema.Types.ObjectId},
        }
    ],
    likes:[
        {
            userId: {type:String},
            userName: {type:String},
            createdAt: {type:String}
        }
    ],
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
})

module.exports = model('Post',postSchema);