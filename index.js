const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Local dictionary of books
const books = [
	{
		id: 1,
		title: 'The Great Gatsby',
		author: 'F. Scott Fitzgerald',
		publish_year: 1925,
		description: 'A novel set in the Roaring Twenties, exploring themes of wealth, love, and the American Dream.'
	},
	{
		id: 2,
		title: 'To Kill a Mockingbird',
		author: 'Harper Lee',
		publish_year: 1960,
		description: 'A story of racial injustice and childhood innocence in the Deep South.'
	},
	{
		id: 3,
		title: '1984',
		author: 'George Orwell',
		publish_year: 1949,
		description: 'A dystopian novel about totalitarianism and surveillance.'
	}
];

// GET endpoint to return all books as JSON
app.get('/books', (req, res) => {
	res.json(books);
});

// POST endpoint to create a new book (accepts JSON or urlencoded)
app.post('/create-book', (req, res) => {
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
	const newBook = {
		id: books.length ? books[books.length - 1].id + 1 : 1,
		title,
		author,
		publish_year: parseInt(publish_year, 10),
		description
	};
	books.push(newBook);
	res.status(201).json(newBook);
});

// GET endpoint to show book details by id as JSON
app.get('/books/:id', (req, res) => {
	const bookId = parseInt(req.params.id, 10);
	const book = books.find(b => b.id === bookId);
	if (!book) {
		return res.status(404).json({ error: 'Book not found' });
	}
	res.json(book);
});

// DELETE endpoint to delete a book by id (returns JSON result)
app.delete('/books/:id', (req, res) => {
	const bookId = parseInt(req.params.id, 10);
	const bookIndex = books.findIndex(b => b.id === bookId);
	if (bookIndex === -1) {
		return res.status(404).json({ error: 'Book not found' });
	}
	const deletedBook = books.splice(bookIndex, 1)[0];
	res.json({ deleted: deletedBook });
});

// PUT endpoint to update an existing book by id
app.put('/books/:id', (req, res) => {
	const bookId = parseInt(req.params.id, 10);
	const bookIndex = books.findIndex(b => b.id === bookId);
	if (bookIndex === -1) {
		return res.status(404).json({ error: 'Book not found' });
	}
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
	books[bookIndex] = {
		id: bookId,
		title,
		author,
		publish_year: parseInt(publish_year, 10),
		description
	};
	res.json(books[bookIndex]);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
