const mongoose = require("mongoose")

const SchemaFb = new mongoose.Schema({
      text: { type: String, required: true },
      email: { type: String, required: true },
      date: { type: String, required: true }
})

const Fb = mongoose.model('feadback', SchemaFb, "feadbacks");
module.exports = Fb