sap.ui.define(['sap/fe/test/ObjectPage'], function (ObjectPage) {
  'use strict';

  var CustomPageDefinitions = {
    actions: {},
    assertions: {},
  };

  return new ObjectPage(
    {
      appId: 'com.devtoberfest.mockserver.ex4',
      componentId: 'ChaptersObjectPage',
      contextPath: '/Books/chapters',
    },
    CustomPageDefinitions
  );
});
