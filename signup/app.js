const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user"),
  Employee = require("./Models/employee");
dotenv = require("dotenv");

//Connecting database
mongoose.connect(
  "mongodb+srv://Akhil:hitman007@cluster0.nk2dj.mongodb.net/connection_course?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

app.use(
  require("express-session")({
    secret: "Any normal Word", //decode or encode session
    resave: false,
    saveUninitialized: false,
  })
);

passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
  res.render("home", {
    name: "",
    username: "",
    phone: "",
    address: "",
    password: "",
  });
});
// Showing secret page
app.get("/userprofile", isLoggedIn, function (req, res) {
  res.render("userprofile");
});
// Showing register form
app.get("/register", function (req, res) {
  res.render("register", {
    name: "",
    username: "",
    phone: "",
    address: "",
    password: "",
  });
});
// Handling user signup
app.post("/register", function (req, res) {
  var username = req.body.username;
  var name = req.body.name;
  var phone = req.body.phone;
  var address = req.body.address;
  var password = req.body.password;
  User.register(
    new User({
      username: username,
      name: name,
      phone: phone,
      address: address,
    }),
    password,
    function (err, user) {
      if (err) {
        console.log(err);
        return res.render("login");
      }
      passport.authenticate("local")(req, res, function () {
        res.render("login");
      });
    }
  );
});

//Showing login form
app.get("/login", function (req, res) {
  res.render("login");
});

//Handling user login
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/userprofile",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

//Handling user logout
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
