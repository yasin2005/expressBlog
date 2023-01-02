const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
//app.use can be used for middleware (like aysnc functions) and we must use next() it get to go to the next method inside as a parameter and call it at the end of the callback function

//blog routes
//post all the blogs
router.get("/", blogController.blog_index);
//add a new blog post
router.post("/", blogController.blog_create_post);

router.get("/create", blogController.blog_create_get);

//delete or update blog
router.get("/:id", blogController.blog_details);

router.delete("/:id", blogController.blog_delete);

router.put("/:id", blogController.blog_update);

module.exports = router;
