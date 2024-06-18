import mongoose from "mongoose";

const emailSchema=new mongoose.Schema({
    "firstName":{
        type:"String",
        required:true
    },
    "lastName":{
        type:String,
        required:true
    },
    "company":{
        type:String,  
        required:true
    },
    "position":{
        type:String,
        required:true
    },
    "url":{
        type:String,
        required:true
    },
    "user":{
        type:mongoose.Schema.ObjectId
        ,required:true
    },
    "user_position":{
        type:String,
        required:true
    }

   
},{timestamps:true})
const emailVerificationModel=mongoose.model("emailData",emailSchema);;

export default emailVerificationModel;



