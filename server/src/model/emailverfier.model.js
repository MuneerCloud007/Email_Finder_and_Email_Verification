import mongoose from "mongoose";
const emailSchema=new mongoose.Schema({
    "First Name":{
        type:"String",
        required:true
    },
    "Last Name":{
        type:String,
        required:true
    },
    "Type":{
        type:String,
        required:true
    },
    "Email address":{
        type:String,
        required:true
    },
    "User name":{
        type:mongoose.Schema.ObjectId,
        required:true
    }

   
},{timestamps:true})

export default mongoose.model("emailData",emailSchema);



