module.exports = {
  // Generate initial dataset dynamically
  getInitialDataSet: function (contextId) {
    const books = [];
    const authors = ['Jane Austen', 'Mark Twain', 'Charles Dickens', 'Ernest Hemingway', 'Virginia Woolf'];
    const genres = ['Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Biography'];

    for (let i = 0; i < 20; i++) {
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];

      books.push({
        ID: `550e8400-e29b-41d4-a716-44665544${String(i).padStart(4, '0')}`,
        title: `${randomGenre} Book ${i + 1}`,
        author: randomAuthor,
        price: Math.floor(Math.random() * 50) + 10,
        currency_code: Math.random() > 0.5 ? 'EUR' : 'USD',
        stock: Math.floor(Math.random() * 100),
        description: `A compelling ${randomGenre.toLowerCase()} story by ${randomAuthor}.`,
        coverUrl: `https://picsum.photos/300/400?random=${i}`,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'admin',
        modifiedAt: new Date().toISOString(),
        modifiedBy: 'admin',
        IsActiveEntity: true,
        HasActiveEntity: false,
        HasDraftEntity: Math.random() > 0.8, // 20% chance of being in draft
      });
    }
    return books;
  },

  // Handle custom actions
  executeAction: async function (actionDefinition, actionData, keys) {
    console.log('Executing action:', actionDefinition.name);

    switch (actionDefinition.name) {
      case 'setDiscount':
        // Get current entry and apply discount based on parameters
        const currentEntries = await this.base.fetchEntries(keys);
        if (currentEntries.length > 0) {
          const currentBook = currentEntries[0];
          const discountPercentage = actionData.percentage || 10; // Default 10% if not provided
          const discountMultiplier = (100 - discountPercentage) / 100;
          const newPrice = Math.round(currentBook.price * discountMultiplier * 100) / 100;

          // Update the book with new price
          await this.base.updateEntry(keys, { price: newPrice });

          return {
            message: `${discountPercentage}% discount applied to "${currentBook.title}"`,
            newPrice: newPrice,
            originalPrice: currentBook.price,
            reason: actionData.reason || 'Mock discount applied',
          };
        }
        break;

      case 'promoteBook':
        const entry = await this.base.fetchEntries(keys); // expecting only one entry
        const firstEntry = entry[0];
        // Mark book as promoted
        await this.base.updateEntry(keys, {
          description: 'PROMOTED: ' + firstEntry.description,
          stock: firstEntry.stock + 10,
        });
        return {
          message: 'Book has been promoted successfully!',
          promoted: true,
        };

      default:
        this.throwError(`Action ${actionDefinition.name} not implemented`, 501);
    }
  },
};
