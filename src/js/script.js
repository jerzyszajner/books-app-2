/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {

    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      books: '.books-list',
    },
    bookImages: {
      imageWrapper: '.book__image',
    },
    form: {
      filters: '.filters',
    },
  };

  const classNames = {

    bookState: {
      favorite: 'favorite',
      hidden: 'hidden',
    },
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  class Book {
    constructor(id, data) {
      const thisBook = this;

      thisBook.id = id;
      thisBook.data = data;

      thisBook.favoriteBooks = [];
      thisBook.filters = [];

      thisBook.render();
      thisBook.getElements();
      thisBook.initActions();
    }

    getElements() {
      const thisBook = this;

      thisBook.dom = {};

      thisBook.dom.wrapper = thisBook.element;
      thisBook.dom.imageWrapper = thisBook.dom.wrapper.querySelector(select.bookImages.imageWrapper);
      thisBook.dom.imageWrappers = thisBook.dom.wrapper.querySelectorAll(select.bookImages.imageWrapper);
      thisBook.dom.booksList = document.querySelector(select.containerOf.books);
      thisBook.dom.booksFilter = document.querySelector(select.form.filters);
    }

    render() {
      const thisBook = this;

      const generatedHTML = templates.book(thisBook.data);
      thisBook.element = utils.createDOMFromHTML(generatedHTML);
      const booksList = document.querySelector(select.containerOf.books);
      booksList.appendChild(thisBook.element);
    }

    initActions() {
      const thisBook = this;

      thisBook.dom.booksList.addEventListener('click', function (event) {
        thisBook.handleClickEvent(event);
      });

      thisBook.dom.booksFilter.addEventListener('change', function (event) {
        thisBook.handleFilterChange(event);
      });
    }

    handleClickEvent(event) {
      const thisBook = this;

      if (event.target.closest(select.bookImages.imageWrapper)) {
        event.preventDefault();
        if (event.detail === 2) {
          thisBook.addToFavorite(event);
        }
      }
    }

    handleFilterChange(event) {
      const thisBook = this;

      const clickedElement = event.target;

      if (clickedElement.tagName === 'INPUT' && clickedElement.type === 'checkbox' && clickedElement.name === 'filter') {
        if (clickedElement.checked) {
          thisBook.filters.push(clickedElement.value);
        } else {
          const index = thisBook.filters.indexOf(clickedElement.value);
          if (index !== -1) {
            thisBook.filters.splice(index, 1);
          }
        }
        thisBook.filterBooks();
      }
    }

    filterBooks() {
      const thisBook = this;

      const books = thisBook.dom.imageWrappers;
      const filters = thisBook.filters;

      for (let book of books) {
        const bookId = book.getAttribute('data-id');
        const bookData = dataSource.books.find(book => book.id == bookId);
        let shouldBeHidden = false;

        for (let filter of filters) {
          if (!bookData.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }

        if (shouldBeHidden) {
          book.classList.add(classNames.bookState.hidden);
        } else {
          book.classList.remove(classNames.bookState.hidden);
        }
      }
    }

    addToFavorite(event) {
      const thisBook = this;

      const clickedImage = event.target.closest(select.bookImages.imageWrapper);

      if (clickedImage) {
        const bookId = clickedImage.getAttribute('data-id');
        const isFavorite = clickedImage.classList.toggle(classNames.bookState.favorite);

        if (isFavorite) {
          if (!thisBook.favoriteBooks.includes(bookId)) {
            thisBook.favoriteBooks.push(bookId);
          }
        } else {
          thisBook.favoriteBooks = thisBook.favoriteBooks.filter(id => id != bookId);
        }
      }
    }

  }

  const app = {

    initBooks: function () {
      const thisApp = this;

      for (let bookData of thisApp.data.books) {
        new Book(bookData.id, bookData);

      }
    },

    initData: function () {
      const thisApp = this;

      thisApp.data = {};
      thisApp.data.books = dataSource.books;
    },

    init: function () {
      const thisApp = this;

      thisApp.initData();
      thisApp.initBooks();
    },
  };

  app.init();
}
