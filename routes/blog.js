const { Router } = require('express');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const multer = require('multer');
const router = Router();
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })

router.get("/add", (req, res) => {
    res.render("addBlog", {
        user: req.user
    });
});

router.post("/add", upload.single('coverImage'), async (req, res) => {
    
    const { title, body } = req.body;
    console.log("req.file", req.file);
    const newBlog = await Blog.create({
                        title,
                        body,
                        createdBy: req.user._id,
                        coverImageURl: `uploads/${req.file?.filename}`
                    });

    return res.redirect(`/blog/${newBlog._id}`);
});

router.get("/:id", async (req, res) => {
  //Populate the blog with the userdetails instead of a reference
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({blogId: req.params.id}).populate('createdBy');
    
    return res.render("blog", {
        user: req.user,
        blog,
        comments
    })
});

router.post("/comment/:blogId", async (req, res) => {
    const { content } = req.body;
    console.log("req.user", req.user);
    //console.log("content", content);
    const comment = await Comment.create({
        content,
        createdBy: req.user._id,
        blogId: req.params.blogId
    });

  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;