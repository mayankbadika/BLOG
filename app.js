require("dotenv").config();

const express = require('express');
const path = require('path');
const app = express();
const { connectToDb } = require('./connection');
let mongodburl = process.env.MONGODB_URI;
const cookieParser = require('cookie-parser');
const { checkAuthenticationCookie } = require('./middlewares/authentication');

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');

const Blog = require('./models/blog');

const PORT = process.env.PORT;

connectToDb(mongodburl);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render('home', {
        user: req.user,
        blogs: allBlogs
    });
});

app.use('/user', userRouter);

app.use('/blog', blogRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})