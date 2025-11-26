USE booksdb;

DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publish_year INT NOT NULL,
    description TEXT
);

INSERT INTO books (title, author, publish_year, description)
VALUES
    ('The Hobbit', 'J.R.R. Tolkien', 1937, 'Fantasy'),
    ('1984', 'George Orwell', 1949, 'Dystopian'),
    ('To Kill a Mockingbird', 'Harper Lee', 1960, 'Classic Literature'),
    ('The Pragmatic Programmer', 'Andrew Hunt & David Thomas', 1999, 'Software Engineering');
