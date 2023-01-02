const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const methodOverride = require("method-override");
//express app
const app = express();

//conect to mongodb
const dbURI =
  "mongodb+srv://Yasin2005:Yasin2005@cluster0.opxnydz.mongodb.net/expressblog?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

//mongoose and mongo sandbox routes
app.get("/add-blog", (req, res) => {
  const blog = new Blog({
    title: "New Blog",
    snippet: "About the New Blog",
    body: "More about it",
  });
  blog
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/all-blog", (req, res) => {
  Blog.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/single-blog", (req, res) => {
  Blog.findById("6356ec2605242a81cf0c52ea")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

//register view engine
app.set("view engine", "ejs");

//listen for requests, returns an instance that we can save in a variable to reuse a server
//.send() infers content type, removing the need to set it up and infers the status code and an entire file is sent trhough sendFile()
//.render() does the same thing, but is used for views

//middleware & static files
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));
//routes
app.get("*", checkUser);
app.get("/", (req, res) => {
  //res.send("<p>Home Page</p>");
  //res.sendFile("./views/index.html", { root: __dirname });
  res.render("home", { title: "Home" });
});

app.get("/about", requireAuth, (req, res) => {
  res.render("about", { title: "About" });
});
//redircets
app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

//auth routes
app.use(authRoutes);
//blog routes
app.use("/blogs", requireAuth, blogRoutes);
//404, goes through the other requests before it to check if the page searched appears, if not the chained methods return a 404 status and sends the 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});
