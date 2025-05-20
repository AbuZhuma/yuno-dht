const mongoose = require("mongoose");

const SchemaPlus = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  settings: {
    type: [String], 
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "", 
  },
  online: {
    type: Number,
    default: 0, 
  },
  language: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    default: "", 
  },
  createdAt: {
    type: String, 
    default: new Date().toISOString(), 
  },
  tags: {
    type: [String],
    default: [], 
  },
  technologies: {
    type: [String],
    default: [],
  },
});

const PlusRoom = mongoose.model("PlusRoom", SchemaPlus, "pluses");
module.exports = PlusRoom;