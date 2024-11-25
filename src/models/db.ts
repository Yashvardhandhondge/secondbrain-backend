//It's am db,ts file for storing users and the brain (i.e) ideas tweets and video from youtube user wants to store

import mongoose, { Types } from "mongoose";

//user Schema 

const UserSchema = new mongoose.Schema({
    email : {type : String , required : true, unique : true},
    password : {type : String , required : true},
    username : {type : String , required : true},
    image : {type : String },
})

export const User = mongoose.model('User', UserSchema);

const BrainEntrySchema = new mongoose.Schema({
    user: { type: Types.ObjectId, ref: 'User'}, 
    contentType: { type: String,  enum: ['youtube', 'twitter', 'instagram', 'linkedin', 'googleDocs', 'manual'] }, 
    contentLink: { type: String }, 
    title: { type: String }, 
    description: { type: String }, 
    tags: [{ type: String }], 
    manualContent: { type: String }, 
    isShared: { type: Boolean, default: false },  
    shareableLink: { type: String }, 
    createdAt: { type: Date, default: Date.now }, 
});

BrainEntrySchema.index({title : 'text', description : 'text', tags : 'text'});
export const Brain = mongoose.model('Brain', BrainEntrySchema);