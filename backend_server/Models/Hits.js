import mongoose from 'mongoose'

const userSchema= new mongoose.Schema({
    date:String,
    hits:Number,
},{timestamps: true})

export default mongoose.model("hits", userSchema)