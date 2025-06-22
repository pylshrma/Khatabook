const express = require("express");
const app = express();
const bcrypt = require('bcryptjs');
const cookieparser = require("cookie-parser");
const path = require("path");
const userModel = require("./models/user");
const jwt = require("jsonwebtoken");
const khataModel = require("./models/khata");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));
app.use(cookieparser());
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/profile", isLoggedIn, async function (req, res) {
  let { startDate, endDate } = req.query;

  let match = {};
  if (startDate && endDate) {
    match.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  try {
    let users = await userModel.findOne({ email: req.user.email }).populate({
      path: "khatas",
      match: match,
    });

    console.log("Final User Data to EJS:", JSON.stringify(users, null, 2));
    res.render("profile", { users });
  } catch (err) {
    console.error("Error in /profile:", err);
    res.status(500).send("Something went wrong!");
  }
});


app.get("/new", isLoggedIn, async function (req, res) {
  res.render("new");
});

app.post("/khata",isLoggedIn ,async function(req, res) {
  let { title, details, passcode,shareable,isEncoded } = req.body;
  let user = await userModel.findOne({email:req.user.email})
  let khata = await khataModel.create({
    title,
    details,
    user:user._id,
    passcode:passcode,
    shareable:shareable,
    isEncoded:isEncoded
  });
  user.khatas.push(khata._id);
  await user.save();
  res.redirect("/profile");
  console.log(khata);
});



app.post("/register", async function (req, res) {
  let { name, username, password, age, email } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("User Already exist");
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      const user = await userModel.create({
        name,
        username,
        email,
        age,
        password: hash,
      });
      let token = jwt.sign({ email: email, userId: user._id },process.env.JWT_SECRET);
      res.cookie("token", token);
      res.redirect("/login");
    });
  });
});

  app.post("/login", async function (req, res) {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.status(500).send("Something went wrong");
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        let token = jwt.sign({ email: email, userId: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token);
        res.status(200).redirect("/profile");
      } else res.redirect("/");
    });
  });

app.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.redirect("/login");
});

app.get("/view/:id",async function(req,res)
{
  let user=await khataModel.findOne({_id:req.params.id});
  res.render("read",{user});
})

app.get("/delete/:id",async function(req,res)
{
  let user=await khataModel.findOneAndDelete({_id:req.params.id});
  res.redirect("/profile");
})

app.get("/edit/:id",isLoggedIn,async function(req,res)
{
  let khata=await khataModel.findOne({_id:req.params.id});
  res.render("edit",{khata}); 
})

app.post("/update/:id",async function(req,res)
{
  let {title,details}=req.body;
  const update=await khataModel.findOneAndUpdate({_id:req.params.id},{
    title,details },{new:true});
    res.redirect("/profile");
})


function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") res.redirect("/login");
  else {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.redirect("/login");
      } else {
        req.user = decoded;
        next();
      }
    });
  }
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});

