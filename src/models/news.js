const mongoose = require("mongoose")

const SchemaNew = new mongoose.Schema({
      title: { type: String, required: true },
      version:  { type: [Number], required: true },
      date:  { type: String, required: true },
      author:  { type: String, required: true },
      description:  { type: String, required: true },
      changelog:  { type: [String], required: true },
})

const New = mongoose.model('new', SchemaNew, "news");
module.exports = New