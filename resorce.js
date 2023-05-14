CREATE TABLE`categories`(
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
);

CREATE TABLE`subcategories`(
  `id` INT NOT NULL AUTO_INCREMENT,
  `category_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  FOREIGN KEY(`category_id`) REFERENCES`categories`(`id`)
);

CREATE TABLE`contents`(
  `id` INT NOT NULL AUTO_INCREMENT,
  `subcategory_id` INT NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `text` TEXT NOT NULL,
  `audio` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  FOREIGN KEY(`subcategory_id`) REFERENCES`subcategories`(`id`)
);


// db.js


const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydatabase',
});

module.exports = pool;


// index.js

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Category routes
app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  const sql = 'INSERT INTO categories(name) VALUES (?)';
  pool.query(sql, [name], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, name });
  });
});

app.get('/api/categories', (req, res) => {
  const sql = 'SELECT * FROM categories';
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const sql = 'UPDATE categories SET name = ? WHERE id = ?';
  pool.query(sql, [name, id], (err, result) => {
    if (err) throw err;
    res.json({ id, name });
  });
});

// Delete a category and its subcategories and contents
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM categories WHERE id = ?';
  pool.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Category deleted successfully' });
  });
});

// Subcategory routes
app.post('/api/subcategories', (req, res) => {
  const { category_id, name } = req.body;
  const sql = 'INSERT INTO subcategories(category_id, name) VALUES (?, ?)';
  pool.query(sql, [category_id, name], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, category_id, name });
  });
});

app.get('/api/subcategories', (req, res) => {
  const sql = 'SELECT * FROM subcategories';
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.put('/api/subcategories/:id', (req, res) => {
  const { id } = req.params;
  const { category_id, name } = req.body;
  const sql = 'UPDATE subcategories SET category_id = ?, name = ? WHERE id = ?';
  pool.query(sql, [category_id, name, id], (err, result) => {
    if (err) throw err;
    res.json({ id, category_id, name });
  });
});

app.delete('/api/subcategories/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM subcategories WHERE id = ?';
  pool.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Subcategory deleted successfully' });
  });
});

// Content routes
app.post('/api/contents', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), (req, res) => {
  const { subcategory_id, text } = req.body;
  const image = req.files['image'][0].filename;
  const audio = req.files['audio'][0].filename;
  const sql = 'INSERT INTO contents(subcategory_id, image, text, audio) VALUES (?, ?, ?, ?)';
  pool.query(sql, [subcategory_id, image, text, audio], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, subcategory_id, image, text, audio });
  });
});

app.get('/api/contents', (req, res) => {
  const sql = 'SELECT * FROM contents';
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.put('/api/contents/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), (req, res) => {
  const { id } = req.params;
  const { subcategory_id, text } = req.body;
  let image = req.body.image;
  let audio = req.body.audio;
  if (req.files) {
    if (req.files['image']) image = req.files['image'][0].filename;
    if (req.files['audio']) audio = req.files['audio'][0].filename;
  }
  const sql = 'UPDATE contents SET subcategory_id = ?, image = ?,
  text = ?, audio = ? WHERE id = ? ';
pool.query(sql, [subcategory_id, image, text, audio, id], (err, result) => {
    if (err) throw err;
    res.json({ id, subcategory_id, image, text, audio });
  });
});

app.delete('/api/contents/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM contents WHERE id = ?';
  pool.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Content deleted successfully' });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});



app.get('/api/all-data', (req, res) => {
  const sql = `SELECT c.id AS category_id, c.name AS category_name,
               s.id AS subcategory_id, s.name AS subcategory_name,
               ct.id AS content_id, ct.image, ct.text, ct.audio
               FROM categories c
               INNER JOIN subcategories s ON s.category_id = c.id
               INNER JOIN contents ct ON ct.subcategory_id = s.id`;
  pool.query(sql, (err, result) => {
    if (err) throw err;

    // Organize data into arrays
    const data = [];
    let lastCategoryId = null;
    let lastSubcategoryId = null;
    let categoryIndex = -1;
    let subcategoryIndex = -1;

    result.forEach(row => {
      const { category_id, category_name, subcategory_id, subcategory_name, content_id, image, text, audio } = row;
      if (category_id !== lastCategoryId) {
        // Start a new category
        data.push({
          id: category_id,
          name: category_name,
          subcategories: []
        });
        categoryIndex++;
        subcategoryIndex = -1;
        lastCategoryId = category_id;
      }
      if (subcategory_id !== lastSubcategoryId) {
        // Start a new subcategory
        data[categoryIndex].subcategories.push({
          id: subcategory_id,
          name: subcategory_name,
          contents: []
        });
        subcategoryIndex++;
        lastSubcategoryId = subcategory_id;
      }
      data[categoryIndex].subcategories[subcategoryIndex].contents.push({
        id: content_id,
        image,
        text,
        audio
      });
    });

    res.json(data);
  });
});



app.get('/api/category/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;

  // Get category details
  const sqlCategory = `SELECT * FROM categories WHERE id = ?`;
  pool.query(sqlCategory, [categoryId], (errCategory, resultCategory) => {
    if (errCategory) throw errCategory;
    if (resultCategory.length === 0) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    // Get subcategories for the category
    const sqlSubcategories = `SELECT * FROM subcategories WHERE category_id = ?`;
    pool.query(sqlSubcategories, [categoryId], (errSubcategories, resultSubcategories) => {
      if (errSubcategories) throw errSubcategories;

      // Get contents for each subcategory
      const subcategories = [];

      resultSubcategories.forEach(subcategory => {
        const { id, name } = subcategory;
        const sqlContents = `SELECT * FROM contents WHERE subcategory_id = ?`;
        pool.query(sqlContents, [id], (errContents, resultContents) => {
          if (errContents) throw errContents;

          const contents = resultContents.map(content => ({
            id: content.id,
            image: content.image,
            text: content.text,
            audio: content.audio
          }));

          subcategories.push({
            id: id,
            name: name,
            contents: contents
          });

          // Send response when all contents have been retrieved
          if (subcategories.length === resultSubcategories.length) {
            const category = {
              id: resultCategory[0].id,
              name: resultCategory[0].name,
              subcategories: subcategories
            };
            res.json(category);
          }
        });
      });
    });
  });
});


// error middleware


// Error handler middleware
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    const errors = Object.values(err.errors).map((error) => error.message);
    res.status(400).json({ message: 'Validation error', errors });
  } else if (err.name === 'CastError') {
    // Mongoose cast error
    res.status(400).json({ message: 'Invalid ID format' });
  } else {
    // Other errors
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
});
