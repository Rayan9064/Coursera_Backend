const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    }, 
    name: {
      type: String,
      required: true
    }, 
    password: {
      type: String,
      required: true
    },
    role: {
        type: String, 
        enum: ["user", "admin"],
        default: "user",
    },
    courses: {
      type: Array, 
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course'}
    }
  });

module.exports = mongoose.model('User', userSchema);