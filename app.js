const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Home route
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render('home', { posts: posts });
  } catch (err) {
    console.log(err);
  }
});

// Compose route
app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });

  try {
    await post.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

// Post route
app.get('/posts/:postId', async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ _id: requestedPostId });
    res.render('post', {
      title: post.title,
      content: post.content
    });
  } catch (err) {
    console.log(err);
  }
});

// Edit route
app.get('/edit/:postId', async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ _id: requestedPostId });
    res.render('edit', {
      post: post
    });
  } catch (err) {
    console.log(err);
  }
});

app.post('/edit/:postId', async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    await Post.updateOne(
      { _id: requestedPostId },
      { title: req.body.postTitle, content: req.body.postContent }
    );
    res.redirect('/posts/' + requestedPostId);
  } catch (err) {
    console.log(err);
  }
});

// Delete route
app.post('/delete/:postId', async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    await Post.deleteOne({ _id: requestedPostId });
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

