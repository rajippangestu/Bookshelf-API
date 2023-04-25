/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

// addBooksHandler "POST"
const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
    data: {
      notesId: id,
    },
  });
  response.code(500);
  return response;
};

// getAllBooksHandler "GET/books"
const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  let booksFilter = books;

  if (name) {
    booksFilter = booksFilter.filter(
        (book) => book.name?.toLowerCase().includes(name.toLowerCase()) === true,
    );
  }

  if (reading) {
    booksFilter = booksFilter.filter(
        (book) => Number(book.reading) === Number(reading),
    );
  }

  if (finished) {
    booksFilter = booksFilter.filter(
        (book) => Number(book.finished) === Number(finished),
    );
  }

  const response = h.response({
    status: 'success',
    data: {
      books: booksFilter.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// getBookByIdHandler "GET =>/books/{bookId}"
const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// editBookHandler "PUT =>/books/{bookId}"
const editBooksByIdHandler = (request, h) => {
  const {bookId} = request.params;
  
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  
  const index = books.findIndex((e) => e.id === bookId);
  
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
  
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// deleteBookByIdHandler "DELETE => /books/{bookId}"
const deleteBooksByIdHandler = (request, h) => {
  const {bookId} = request.params;
  
  const index = books.findIndex((e) => e.id === bookId);
  
  if (index !== -1) {
    books.splice(index, 1);
  
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
};
