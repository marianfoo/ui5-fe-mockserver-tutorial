sap.ui.define(
  [
    'sap/fe/test/JourneyRunner',
    'project1/test/integration/pages/BooksList',
    'project1/test/integration/pages/BooksObjectPage',
    'project1/test/integration/pages/ChaptersObjectPage',
  ],
  function (JourneyRunner, BooksList, BooksObjectPage, ChaptersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
      launchUrl: sap.ui.require.toUrl('project1') + '/test/flp.html#app-preview',
      pages: {
        onTheBooksList: BooksList,
        onTheBooksObjectPage: BooksObjectPage,
        onTheChaptersObjectPage: ChaptersObjectPage,
      },
      async: true,
    });

    return runner;
  }
);
