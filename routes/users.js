const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/pint")

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String},
  posts: [
    {
      type : mongoose.Schema.Types.ObjectId, 
      ref : 'Post'
    }
  ], //here we are going to apply data association.
  displayPicture: { type: String, required: false }, // URL to the display picture
  email: { type: String, required: true, unique: true },
  fullname: { type: String, required: true }
}, { timestamps: true });

UserSchema.plugin(plm);


module.exports = mongoose.model('User', UserSchema);