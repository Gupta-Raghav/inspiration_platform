const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const PostSchema = new Schema({
    postText: { type: String, required: true },
    // content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }, 
    likes : {type: Array, default:[]}
  });

module.exports = mongoose.model('Post', PostSchema);