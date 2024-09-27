import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({})
const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected...");
    }catch(e){
        console.error(e.message);
       

    }
}
export default connectDB;