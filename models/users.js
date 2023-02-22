const mongoose = require("mongoose")
const  passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
    email: String,
    roles:[{type: String, required: false}]
  });
  
  userSchema.plugin(passportLocalMongoose);
  
  const User = mongoose.model('User', userSchema)
  module.exports = { User };
  