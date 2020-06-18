const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:String,
    lastName:String,
    email:String,
    cars:[{
        type:Schema.Types.ObjectId,
        ref:'car'
    }],
    

})

module.exports = User = mongoose.model('user', userSchema);