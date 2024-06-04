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

    initActions() {
      const thisBook = this;

      thisBook.dom.booksContainer.addEventListener('dblclick', function (event) {
        thisBook.addToFavorite(event);
      });
    }

    simulateDoubleClick() {
      const thisBook = this;

      function triggerClick() {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        thisBook.dom.imageWrapper.dispatchEvent(clickEvent);
      }

      thisBook.dom.imageWrapper.addEventListener('click', function (event) {
        event.preventDefault();
        console.log(event);
      });

      triggerClick();
      triggerClick();
    }

    addToFavorite(event) {
      const thisBook = this;

      const clickedElement = event.target;

      if (clickedElement && clickedElement.offsetParent.classList.contains('book__image')) {
        const bookImage = clickedElement.offsetParent;
        const bookId = bookImage.getAttribute('data-id');
        const isFavorite = bookImage.classList.toggle(classNames.bookState.favorite);

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
        const book = new Book(bookData.id, bookData);
        book.simulateDoubleClick();
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
