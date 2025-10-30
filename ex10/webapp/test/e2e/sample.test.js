const { wdi5 } = require('wdio-ui5-service');

describe('Ex8: Offline E2E Testing with Mockserver & wdi5', () => {
  const logger = wdi5.getLogger('📚 BookshopTest');

  it('should load the app and display mockserver data', async () => {
    logger.info('🚀 Starting simple mockserver data test...');

    // Wait a moment for data to load
    await browser.pause(3000);

    // Find table with id com.devtoberfest.mockserver.ex8::BooksList--fe::table::Books::LineItem-innerTable
    const table = await browser.asControl({
      selector: {
        interaction: 'root',
        controlType: 'sap.m.Table',
      },
      timeout: 10000,
    });
    logger.info('✅ Found table control');

    logger.info(`📊 Found metadata for ${name}`);
    // Get data from table
    const items = await table.getItems();
    logger.info(`📊 Found ${items.length} items in table`);

    // table should be 2 rows with books titles "The Great Gatsby" and "To Kill a Mockingbird"
    expect(items.length).toBe(2);

    // Get the book titles from the items
    const bookTitles = [];
    for (const item of items) {
      const cells = await item.getCells();
      if (cells && cells.length > 0) {
        // Assuming the title is in the first cell
        const titleText = (await cells[0].getText) ? await cells[0].getText() : await cells[0].getProperty('text');
        bookTitles.push(titleText);
      }
    }

    logger.info(`📚 Book titles found: ${bookTitles.join(', ')}`);

    // Assert the expected books are present
    expect(bookTitles).toContain('The Great Gatsby');
    expect(bookTitles).toContain('To Kill a Mockingbird');

    logger.info('🎉 SUCCESS: Mockserver provided expected book data offline!');
  });
});
