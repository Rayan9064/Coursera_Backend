const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
      type: String,
      required: true,
      unique: true,
    }, 
    description: {
      type: String,
      required: true
    }, 
    image: {
      url: String,
      filename: String,
    },
    instructors: {
      type: Array,
      required: true
    },
    duration: {
     type: String,
     required: true
      },
    price: {
        type: Number,
        required: true
      },
    category: {
        type: String,
        required: true,
      },
    level: {
        type: String,
        required: true,
        enum: ["beginner", "intermediate", "advanced"],
    },
    popularity: {
        type: String,
        required: true,
        enum: ["low", "intermediate" ,"high"]
    },
  Owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  });

module.exports = mongoose.model('Course', courseSchema);