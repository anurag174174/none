import mongoose from "mongoose";
const userSchema =new mongoose.Schema({

    fullname:{
        typeof: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
      
    },
    phoneNumber:{
        type: Number,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minlength:6,
    },
    role:{
        type: String,
        required: true,
        enum:['student','recruiter']
    },
    profile:{
        bio:{type: String},
        skills:[{type: String}],
        resume:{type:String}, //URL to resume
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId,ref:'Company'}, 
        profilePhoto:{
            type: String,
            default: ''
        }
    }
},{timestamps:true});

export const User=mongoose.model('User',userSchema)