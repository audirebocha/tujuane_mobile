import mongoose from 'mongoose'

const userSchema= new mongoose.Schema({
    message_id:String,
    sender_id:String,
    recipient_id:String,
    body:String,
    media_url:String,
    message_type:String,
    reaction_id:String,
    status:String
},{timestamps: true})

export default mongoose.model("Messages", userSchema)