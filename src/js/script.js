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
  };

  const classNames = {
    bookState: {
      favorite: 'favorite',
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

      thisBook.render();
      thisBook.getElements();
      thisBook.initActions();
    }

    getElements() {
      const thisBook = this;

      thisBook.dom = {};

      thisBook.dom.wrapper = thisBook.element;
      thisBook.dom.imageWrapper = thisBook.dom.wrapper.querySelector(select.bookImages.imageWrapper);
      thisBook.dom.booksContainer = document.querySelector(select.containerOf.books);
    }

    render() {
      const thisBook = this;

      const generatedHTML = templates.book(thisBook.data);
      thisBook.element = utils.createDOMFromHTML(generatedHTML);
      const booksContainer = document.querySelector(select.containerOf.books);
      booksContainer.appendChild(thisBook.element);
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

    initActions() {
      const thisBook = this;

      const handleClickEventBound = thisBook.handleClickEvent.bind(thisBook);

      thisBook.dom.booksContainer.addEventListener('click', handleClickEventBound);
    }

    addToFavorite(event) {
      const thisBook = this;

      const clickedElement = event.target.closest(select.bookImages.imageWrapper);

      if (clickedElement) {
        const bookId = clickedElement.getAttribute('data-id');
        const isFavorite = clickedElement.classList.toggle(classNames.bookState.favorite);

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
