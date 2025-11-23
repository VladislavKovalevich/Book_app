const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 80;

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'booksdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

async function initDb() {
  pool = mysql.createPool(dbConfig);
  console.log(`Connected to DB at ${dbConfig.host}:${dbConfig.port}`);
}

// Root endpoint to verify the app is running
app.get('/', async (req, res) => {
  res.send('Books app is running');
});

// GET endpoint to return all books as JSON
app.get('/books', async (req, res) => {
	try {
    	const [rows] = await pool.query('SELECT * FROM books');
    	res.json(rows);
  	} catch (err) {
    	console.error(err);
    	res.status(500).send('DB error');
  	}
});

// POST endpoint to create a new book
app.post('/create-book', async (req, res) => {
	const { title, author, publish_year, description } = req.body;
	if (!title) {
		return res.status(400).json({ error: 'Title is required.' });
	}
    if (!author) {
        return res.status(400).json({ error: 'Author is required.' });
    }
    if (!publish_year) {
        return res.status(400).json({ error: 'Publish year is required.' });
    }
    if (!description) {
        return res.status(400).json({ error: 'Description is required.' });
    }
	try {
    const [result] = await pool.query(
      'INSERT INTO books (title, author, publish_year, description) VALUES (?, ?, ?, ?)', [title, author, parseInt(publish_year, 10), description]);
    	res.json({ id: result.insertId, title, author, publish_year: parseInt(publish_year, 10), description });
  	} catch (err) {
    	console.error(err);
    	res.status(500).send('DB error');
  	}
});

// GET endpoint to show book details by id
app.get('/books/:id', async (req, res) => {
	const bookId = parseInt(req.params.id, 10);
		try {
    	const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [bookId]);
    	res.json(rows);
  	} catch (err) {
    	console.error(err);
    	res.status(500).send('DB error');
  	}
});

// DELETE endpoint to delete a book by id
app.delete('/books/:id', async (req, res) => {
	const bookId = parseInt(req.params.id, 10);
	try {
    	const [rows] = await pool.query('DELETE FROM books WHERE id = ?', [bookId]);
    	res.json(rows);
  	} catch (err) {
    	console.error(err);
    	res.status(500).send('DB error');
  	}
});

// PUT endpoint to update an existing book by id
app.put('/books/:id', async (req, res) => {
	const bookId = parseInt(req.params.id, 10);
	const { title, author, publish_year, description } = req.body;
	if (!title) {
		return res.status(400).json({ error: 'Title is required.' });
	}
	if (!author) {
		return res.status(400).json({ error: 'Author is required.' });
	}
	if (!publish_year) {
		return res.status(400).json({ error: 'Publish year is required.' });
	}
	if (!description) {
		return res.status(400).json({ error: 'Description is required.' });
	}
	try {
	const [result] = await pool.query(
	  'UPDATE books SET title = ?, author = ?, publish_year = ?, description = ? WHERE id = ?', [title, author, parseInt(publish_year, 10), description, bookId]);
		res.json({ id: bookId, title, author, publish_year: parseInt(publish_year, 10), description });
  	} catch (err) {
		console.error(err);
		res.status(500).send('DB error');
  	}
});

initDb().then(() => {
  app.listen(port, () => {
    console.log(`Books API listening on port ${port}`);
  });
});
