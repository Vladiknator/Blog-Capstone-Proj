// import necessary modules
import express from 'express';
import methodOverride from 'method-override';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sanitizeHtml from 'sanitize-html';
import pkg from 'isomorphic-dompurify';
import { Post, postReviver } from './postsObj.mjs';

const { sanitize } = pkg;

// read posts from json file
let posts = [];

// Define an async function that reads a json file and writes it to a variable
async function readJsonFile(filename) {
  // Use a try-catch block to handle errors
  try {
    // Use fs.promises.readFile to read the file and await the result
    const data = await fs.promises.readFile(filename, 'utf8');
    // Parse the data as JSON and assign it to a variable, use reviver function to recreate Post objects
    const json = JSON.parse(data, postReviver);
    // Return the variable
    return json;
  } catch (error) {
    // Log the error and rethrow it
    console.error(error);
    throw error;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Write contents of JSON to posts array
posts = await readJsonFile('posts.json');

// Initialize the app
const app = express();
const port = 3000;

// Set up EJS view engine
app.set('view engine', 'ejs');

// Set up body-parser middleware
app.use(express.urlencoded({ extended: false }));

// Set up static route
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// Use method override
app.use(methodOverride('_method'));

// Use Tiny MCE
app.use(
  '/tinymce',
  express.static(path.join(__dirname, 'node_modules', 'tinymce')),
);

// Define routes

// Default route
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// Displays post with given ID
app.get('/read/:postId', (req, res) => {
  const { postId } = req.params;
  const selectedPost = posts.find((post) => post.uuid === postId);
  res.render('read', { post: selectedPost });
});

// Display Post creation interface
app.get('/post', (req, res) => {
  res.render('post');
});

// Display editor version of post creation interface
app.get('/post/:postId', (req, res) => {
  res.render('post');
});

// Display Post management interface
app.get('/manage', (req, res) => {
  res.render('manage');
});

// Add new post
app.post('/add', (req, res) => {
  console.log(req.body.title);
  const postTitle = req.body.title;
  const postBody = sanitize(req.body.body);
  const newPost = new Post(postTitle, postBody);
  console.log(newPost.toString());
  posts.push(newPost);
  res.redirect('/');
});

// Edit existing post
app.put('/edit', (req, res) => {
  res.redirect('/');
});

// Delete Post
app.delete('/delete', (req, res) => {
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
