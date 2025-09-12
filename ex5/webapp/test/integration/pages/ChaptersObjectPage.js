sap.ui.define(['sap/fe/test/ObjectPage'], function (ObjectPage) {
  'use strict';

  var CustomPageDefinitions = {
    actions: {},
    assertions: {},
  };

  return new ObjectPage(
    {
      appId: 'com.devtoberfest.mockserver.ex5',
      componentId: 'ChaptersObjectPage',
      contextPath: '/Books/chapters',
    },
    CustomPageDefinitions
  );
});
