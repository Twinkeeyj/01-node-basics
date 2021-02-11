const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;

const ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => value.includes("@"),
  },
  phone: {
    type: String,
    required: true,
  },
},
{timestamps: true },
);
// ____
ContactSchema.plugin(mongoosePaginate)
// _____
const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
