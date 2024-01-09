let express = require("express");
let app = express();
let path = require("path");
let bcrypt = require("bcrypt");
let collection = require("./mongodb.js");
let Books = require("./booksdb.js");
let cookieParser = require("cookie-parser");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const authenticateUserSession = async (req, res, next) => {
  const userId = req.cookies["userSession"];

  const user = await collection.findById(userId);
  req.user = user;
  next();
};

app.get("/", authenticateUserSession, async (req, res) => {
  try {
    let currentUser = req.user;
    let books = await Books.find();
    if (currentUser) {
      res.render("library", { books });
    } else {
      res.render("home");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/login", (req, res) => {
  res.render("login", { error: false });
});

app.get("/signup", (req, res) => {
  res.render("signup", {
    phoneMessage: true,
    surnameMessage: true,
    nameMessage: true,
    emailMessage: true,
    passMessage: true,
    exist: false,
  });
});

app.get("/library", (req, res) => {
  res.render("library");
});

app.get("/rentals", authenticateUserSession, async (req, res) => {
  try {
    let currentUser = req.user;
    if (currentUser.rentals.length == 0) {
      res.render("rentals", { rentals: false });
    } else {
      res.render("rentals", { rentals: currentUser.rentals });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// signup

app.post("/signup", async (req, res) => {
  let data = {
    name: req.body.name.trim(),
    surname: req.body.surname.trim(),
    phone: req.body.phone,
    group: req.body.group,
    password: req.body.password,
    email: req.body.email,
  };
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneNumberRegex = /^(?:\+374|0)\d{8}$/;

  let passMessage = passwordRegex.test(data.password) ? true : false;
  let emailMessage = emailRegex.test(data.email) ? true : false;
  let nameMessage = data.name.length ? true : false;
  let surnameMessage = data.surname.length ? true : false;
  let phoneMessage = phoneNumberRegex.test(data.phone) ? true : false;

  let existEmail = await collection.findOne({ email: data.email });

  if (existEmail) {
    res.render("/signup", {
      phoneMessage: true,
      surnameMessage: true,
      nameMessage: true,
      emailMessage: true,
      passMessage: true,
      exist: true,
    });
  } else {
    if (
      passMessage &&
      emailMessage &&
      nameMessage &&
      surnameMessage &&
      phoneMessage
    ) {
      let salt = 6;
      let hashedPass = await bcrypt.hash(data.password, salt);
      data.password = hashedPass;
      collection.create(data);
      res.redirect("/login");
    } else {
      res.render("signup", {
        phoneMessage: phoneMessage,
        surnameMessage: surnameMessage,
        nameMessage: nameMessage,
        emailMessage: emailMessage,
        passMessage: passMessage,
        exist: false,
      });
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    let user = await collection.findOne({ email: req.body.email });
    let isCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isCorrectPassword && user) {
      res.cookie("userSession", user._id, { httpOnly: true });
      return res.redirect("/");
    } else {
      res.render("login", { error: true });
    }
  } catch (e) {}
});

app.post("/timeHandle", authenticateUserSession, async (req, res) => {
  try {
    const dataTime = req.body.time * 60;
    const dataBook = req.body.book;
    const currentUser = req.user;
    const filter = { _id: currentUser._id };
    const bookFilter = { _id: dataBook._id };
    let currentDate = new Date();
    let futureDate = new Date(currentDate).setMinutes(
      currentDate.getMinutes() + dataTime
    );
    const bookUpdate = {
      $set: {
        availability: false,
        time: futureDate,
      },
    };
    const update = {
      $push: {
        rentals: { dataBook, futureDate },
      },
    };
    if (currentUser.rentals.length >= 5) {
      throw new Error("You can't have more then 5 rentals in one time");
    }
    await Books.updateOne(bookFilter, bookUpdate);
    await collection.updateOne(filter, update);
    res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

app.post("/cencal", authenticateUserSession, async (req, res) => {
  try {
    let currentUser = req.user;
    let { book } = req.body;
    await collection.updateOne(
      { _id: currentUser._id },
      { $pull: { rentals: { dataBook: book } } }
    );
    await Books.updateOne({ _id: book._id }, { $set: { availability: true } });
    res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

app.get("/book=:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await Books.findOne({ isbn });
    res.render("book", { book });
  } catch (e) {}
});

app.post("/logout", async (req, res) => {
  try {
    res.clearCookie("userSession");
  } catch (e) {
    console.error(e);
  }
});

app.get("/search", async (req, res) => {
  const searchTerm = req.query.term;

  try {
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const books = await Books.find({
      title: { $regex: new RegExp(escapedSearchTerm, "i") },
    });
    res.render("search", { books, searchTerm });
  } catch (error) {
    console.error(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log("connected");
});
