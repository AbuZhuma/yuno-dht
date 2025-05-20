const mongoose = require("mongoose")

const SchemaKey = new mongoose.Schema({
      key: { type: String, required: true },
      active:  { type: Boolean, required: true },
})

const Key = mongoose.model('key', SchemaKey, "keys");
module.exports = Key