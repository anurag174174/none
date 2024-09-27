
import { User } from "../models/user.model";
import bcrypt from "bcryptjs"
import jwt from "jwt"
export const register=async(req,res)=>{
    try{
        const{fullname,email,phoneNumber,password,role}=req.body;
        if(!fullname || !email || !phoneNumber||password){
            return res.status(400).json(
                {messsage:'Please enter all fields',success:false

                } );
        }
    
    const user=await User.findOne({email});
    if(user)
    {
        return res.status(400).json({message:'Email already exists',success:false});
    }
    const hashedPassword=await bcrypt.hash(password,10);

    await User.create({
        fullname,
        email,
        phoneNumber,
        password:hashedPassword,
        role 
    })
    return res.status(201).json({msg:'Account Created Successfully',success:true});
}
    catch(e){

    }
}

//login check
export const login=async(req,res)=>{
    try{
        const{email,password,role}=req.body;
        if(!email ||!password ||!role){
            return res.status(400).json(
                {messsage:'Please enter all fields',success:false})
        }
        const user=await User.findOne({email});
        const isPasswordMatch = await bcrypt.compare(password,user.password)
        if(!user){
            return res.status(400).json({message:'User not found',success:false});
        }
        if(!isPasswordMatch)
        {
            return res.status(400).json({message:'Invalid password',success:false});
        }
        if(role!==user.role){
            return res.status(400).json({message:'Invalid role',success:false});
        }
        const tokenData=
        {
            userId: user._id,
        }
   

        user={
            userId:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});


        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
            msg:`welcome back${user.fullname}}`
        });;

    }
catch(e)
{

}
}

export const logout=async (req,res) => {
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json(
            {
                message: "Logged out successfully",
                success: true,  
            }
        );
    } catch (error) {
        
    }
}

export const updateProfile=async (req,res) => {
    try {
       const {fullname,email,phoneNumber,bio,skills} = req.body;
       const file=req.file;
       if(!fullname || !email || !phoneNumber||!bio||!skills){
        return res.status(400).json(
            {messsage:'Please enter all fields',success:false

            } );
    }


    const skillsArray = skills.split(',');
    const userId=req.id; //middle ware authentication
    let user=await User.findById(userId);

    if(!user)
    {
        return res.status(400).json({message:'User not found',success:false});
    }
    //updating data
    user.fullname=fullname;
    user.email=email;
    user.phoneNumber=phoneNumber;
    user.bio=bio;
    user.skills=skillsArray;
//resume comes later here//

    await user.save();
    user={
        userId:user._id,
        fullname:user.fullname,
        email:user.email,
        phoneNumber:user.phoneNumber,
        role:user.role,
        profile:user.profile
    }
    return res.status(200).json({
        message:"profile updated",user,success:true
    })
    } catch (error) {
        
    }
}