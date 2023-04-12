require("./config/database").connect();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const dotenv=require("dotenv").config();
const { PORT, MONGODB_URL, SESSION_SECRET_KEY } = process.env;
const expressLayouts = require("express-ejs-layouts");

// used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(expressLayouts);

// set up view engine
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));
// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "placement-cell",
    secret: SESSION_SECRET_KEY,
    saveUninitialized: false,
    resave: false, 
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: MONGODB_URL,
      autoRemove: "disabled",
    }),
    function(err) {
      console.log(err || "connect-mongodb setup ok");
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// sets the authenticated user in the response
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.get("", (req, res)=>{
  res.render("index")
})
app.get("/dashboard", (req, res)=>{
  res.render('dashboard')
});

app.get("/course", (req, res)=>{
  res.render('course')
});

const arr={
  "1.1": "https://www.youtube.com/embed/ukzFI9rgwfU?list=PLEiEAq2VkUULYYgj13YHUWmRePqiu8Ddy",
  "2.1": "https://www.youtube.com/embed/RmajweUFKvM?list=PLEiEAq2VkUULYYgj13YHUWmRePqiu8Ddy",
  "2.2": "https://www.youtube.com/embed/l3dZ6ZNFjo0?list=PLEiEAq2VkUULYYgj13YHUWmRePqiu8Ddy",
  "2.3": "https://www.youtube.com/embed/I7NrVwm3apg?list=PLEiEAq2VkUULYYgj13YHUWmRePqiu8Ddy",
  "3.1": "https://www.youtube.com/embed/-DEL6SVRPw0?list=PLEiEAq2VkUULYYgj13YHUWmRePqiu8Ddy",
  "4.1": "https://www.youtube.com/embed/ukzFI9rgwfU?list=PLEiEAq2VkUULYYgj13YHUWmRePqiu8Ddy",
}

app.get("/videoplayer", (req, res)=>{
  const name = req.query.name;
  
  const link=arr[name]
  res.render('videoplayer',{ name :link } )
});


// use express router (User Authentication)
app.use("/", require("./routes"));

app.listen(PORT || 5000, (err) => {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`server is running on port: ${PORT}`);
});
