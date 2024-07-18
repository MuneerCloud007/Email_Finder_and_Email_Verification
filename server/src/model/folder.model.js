import mongoose, { mongo } from "mongoose";


const FolderSchema=new mongoose.Schema({
FolderName:{type:String,required:true},
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
checked:{type:Boolean,default:false}
})

export default mongoose.model("FolderData",FolderSchema)



