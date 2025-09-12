module.exports = {
  getInitialDataSet: function (contextId) {
    // ... existing code from previous exercise ...
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
        HasDraftEntity: Math.random() > 0.8,
      });
    }
    return books;
  },

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

          // Update the book with new price using await
          await this.base.updateEntry(keys, { price: newPrice });

          return {
            message: `${discountPercentage}% discount applied to "${currentBook.title}"`,
            newPrice: newPrice,
            originalPrice: currentBook.price,
            reason: actionData.reason || 'Cross-service discount applied',
          };
        }
        break;

      case 'promoteBook':
        console.log('📚 Starting book promotion with cross-service integration...');

        // Step 1: Update book in main service
        const bookEntries = await this.base.fetchEntries(keys);
        const bookData = bookEntries[0];
        if (!bookData) {
          this.throwError('Book not found', 404);
          return;
        }

        // Update the book with promotion status
        await this.base.updateEntry(keys, {
          description: 'PROMOTED: ' + bookData.description,
          stock: bookData.stock + 10, // Add promotional inventory
        });

        console.log('✅ Book updated in BookshopService');

        // Step 2: Cross-service communication to ReviewsService
        // Add a promotional review via the reviews service
        this.base
          .getEntityInterface('Reviews', 'reviews')
          .then(function (reviewService) {
            if (reviewService) {
              console.log('🔄 Connecting to ReviewsService...');

              return reviewService.addEntry({
                ID: `promo-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                book_ID: keys.ID, // Link to the promoted book
                reviewer: 'Marketing Team',
                rating: 5, // Promotional reviews are always 5-star
                comment: `📈 PROMOTIONAL: "${bookData.title}" has been featured! Don't miss this amazing read.`,
                createdAt: new Date().toISOString(),
                createdBy: 'system',
                modifiedAt: new Date().toISOString(),
                modifiedBy: 'system',
                IsActiveEntity: true,
                HasActiveEntity: false,
                HasDraftEntity: false,
              });
            }
          })
          .then(function () {
            console.log('✅ Cross-service promotional review added to ReviewsService');
          })
          .catch(function (error) {
            console.error('❌ Failed to add cross-service review:', error);
            // Don't fail the whole operation if review creation fails
          });

        return {
          message: 'Book promoted successfully with cross-service review integration!',
          promoted: true,
          crossServiceIntegration: 'Reviews service notified',
        };

      default:
        this.throwError(`Action ${actionDefinition.name} not implemented`, 501);
    }
  },
};
