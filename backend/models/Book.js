const { db } = require('../db');

// Model książki
class Book {
  // Pobiera wszystkie książki
  static getAll() {
    const stmt = db.prepare('SELECT * FROM books');
    return stmt.all();
  }

  // Pobiera książkę po ID
  static getById(id) {
    const stmt = db.prepare('SELECT * FROM books WHERE id = ?');
    return stmt.get(id);
  }

  // Tworzy nową książkę
  static create({ title, author, content = '' }) {
    const stmt = db.prepare('INSERT INTO books (title, author, content) VALUES (?, ?, ?)');
    const result = stmt.run(title, author, content);
    return this.getById(result.lastInsertRowid);
  }

  // Aktualizuje książkę
  static update(id, updates) {
    const book = this.getById(id);
    if (!book) return null;

    const { title, author, content } = updates;
    const stmt = db.prepare('UPDATE books SET title = ?, author = ?, content = ? WHERE id = ?');
    stmt.run(
      title || book.title,
      author || book.author,
      content !== undefined ? content : book.content,
      id
    );
    return this.getById(id);
  }

  // Usuwa książkę
  static delete(id) {
    const book = this.getById(id);
    if (!book) return null;

    const stmt = db.prepare('DELETE FROM books WHERE id = ?');
    stmt.run(id);
    return book;
  }
}

module.exports = Book;