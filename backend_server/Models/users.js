import mongoose from 'mongoose'

const userSchema= new mongoose.Schema({
    email:String,
    display_name:String,
    phone:String,
    profile_photo_url:String,
    sid:String,
    status:String
},{timestamps: true})

export default mongoose.model("Users", userSchema)