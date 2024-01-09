let mongoose = require("mongoose");
require("dotenv").config();

let connect = mongoose.connect(process.env.DATABASE_URL);

const BookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  authors: [String],
  isbn: {
    type: String,
    required: true,
  },
  published_year: {
    type: Number,
    required: false,
  },
  category: [String],
  availability: {
    type: Boolean,
    default: true,
  },
  time: {
    type: Date,
    default: null,
  },
  location: {
    shelf: String,
    row: Number,
  },
  additional_info: {
    publisher: String,
    language: String,
    page_count: Number,
  },
  cover_url: {
    type: String,
    required: false,
  },
  online_version_url: String,
});

connect
  .then(() => {
    console.log("datebase is connected");
  })
  .catch(() => {
    console.log("database is not connected");
  });

module.exports = new mongoose.model("Book", BookSchema);
