const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    Name: {
        type: "string",
        required: true,
    },
    Email: {
        type: "string",
        required: true,
    },
    Mobile: {
        type: Number,
        requird: true,
    },
    Password:{
        type:"string",
        required:true,
    },
    Cart:[] 
});

const User = new mongoose.model("User", UserSchema);

module.exports =  User;
