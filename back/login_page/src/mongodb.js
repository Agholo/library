let mongoose = require("mongoose");
require("dotenv").config();

let connect = mongoose.connect(process.env.DATABASE_URL);

connect
  .then(() => {
    console.log("datebase is connected");
  })
  .catch(() => {
    console.log("database is not connected");
  });

const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  group: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rentals: {
    type: [
      {
        dataBook: {
          type: Object,
          required: false,
        },
        futureDate: {
          type: Date,
          required: false,
        },
      },
    ],
    required: false,
    limit: 5,
  },
});

let collectPart = new mongoose.model("users", loginSchema);

module.exports = collectPart;
