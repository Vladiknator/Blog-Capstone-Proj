// import necessary modules
import express from 'express';
import methodOverride from 'method-override';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sanitizeHtml from 'sanitize-html';
import pkg from 'isomorphic-dompurify';
import clip from 'text-clipper';

import { Post, postReviver } from './postsObj.mjs';

const { sanitize } = pkg;

// var to store posts array
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

// Define async function to write to json file
async function writeJsonFile(filename, jsonData) {
  // Use a try-catch block to handle errors
  try {
    // Use fs.promises.readFile to write the file
    const out = fs.promises.writeFile(filename, jsonData);
    return out;
  } catch (error) {
    // Log the error and rethrow it
    console.error(error);
    throw error;
  }
}

// Setup dirname and filename constants
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
  res.render('index', { posts, clip: clip.default });
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
app.get('/post/:postUUID', (req, res) => {
  const { postUUID } = req.params;
  const selectedPost = posts.find((post) => post.uuid === postUUID);
  res.render('post', { post: selectedPost });
});

// Display Post management interface
app.get('/manage', (req, res) => {
  res.render('manage', { posts, clip: clip.default });
});

// Add new post
app.post('/add', (req, res) => {
  const postTitle = req.body.title;
  const postBody = sanitize(req.body.body);
  const newPost = new Post(postTitle, postBody);
  posts.push(newPost);
  writeJsonFile('posts.json', JSON.stringify(posts));
  res.redirect('/manage');
});

// Edit existing post
app.put('/edit', (req, res) => {
  const postTitle = req.body.title;
  const postBody = sanitize(req.body.body);
  const postUUID = req.body.uuid;
  const postIndex = posts.findIndex((post) => post.uuid === postUUID);
  posts[postIndex].setTitle(postTitle);
  posts[postIndex].setBody(postBody);
  writeJsonFile('posts.json', JSON.stringify(posts));
  res.redirect('/manage');
});

// Delete Post
app.delete('/delete/:postUUID', (req, res) => {
  // console.log(`delete ${req.params.postId}`);]
  const { postUUID } = req.params;
  posts = posts.filter((post) => post.uuid !== postUUID);
  writeJsonFile('posts.json', JSON.stringify(posts));
  res.redirect('/manage');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
