sap.ui.define(
  [
    'sap/fe/test/JourneyRunner',
    'com/devtoberfest/mockserver/ex9/test/integration/pages/BooksList',
    'com/devtoberfest/mockserver/ex9/test/integration/pages/BooksObjectPage',
    'com/devtoberfest/mockserver/ex9/test/integration/pages/ChaptersObjectPage',
  ],
  function (JourneyRunner, BooksList, BooksObjectPage, ChaptersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
      launchUrl: sap.ui.require.toUrl('com/devtoberfest/mockserver/ex9') + '/index.html',
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
