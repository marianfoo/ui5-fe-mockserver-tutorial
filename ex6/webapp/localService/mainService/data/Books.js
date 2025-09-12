module.exports = {
  // getInitialDataSet: function (contextId) {
  //   console.log('Loading data for tenant:', contextId);

  //   // Default data if no tenant-specific file exists
  //   if (!contextId) {
  //     const books = [];
  //     const authors = ['Jane Austen', 'Mark Twain', 'Charles Dickens', 'Ernest Hemingway', 'Virginia Woolf'];
  //     const genres = ['Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Biography'];

  //     for (let i = 0; i < 20; i++) {
  //       const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
  //       const randomGenre = genres[Math.floor(Math.random() * genres.length)];

  //       books.push({
  //         ID: `550e8400-e29b-41d4-a716-44665544${String(i).padStart(4, '0')}`,
  //         title: `${randomGenre} Book ${i + 1}`,
  //         author: randomAuthor,
  //         price: Math.floor(Math.random() * 50) + 10,
  //         currency_code: Math.random() > 0.5 ? 'EUR' : 'USD',
  //         stock: Math.floor(Math.random() * 100),
  //         description: `A compelling ${randomGenre.toLowerCase()} story by ${randomAuthor}.`,
  //         coverUrl: `https://picsum.photos/300/400?random=${i}`,
  //         createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  //         createdBy: 'admin',
  //         modifiedAt: new Date().toISOString(),
  //         modifiedBy: 'admin',
  //         IsActiveEntity: true,
  //         HasActiveEntity: false,
  //         HasDraftEntity: Math.random() > 0.8, // 20% chance of being in draft
  //       });
  //     }
  //     return books;
  //   }

  //   // Tenant-specific logic can be added here
  //   // The mockserver will automatically load tenant-specific JSON files
  //   return null; // Let mockserver handle file loading
  // },

  executeAction: async function (actionDefinition, actionData, keys, odataRequest) {
    const tenantId = odataRequest.tenantId || 'default';
    console.log(`Executing ${actionDefinition.name} for tenant: ${tenantId}`);

    switch (actionDefinition.name) {
      case 'promoteBook':
        let promoMessage = 'Book promoted!';

        const entries = await this.base.fetchEntries(keys);

        // Tenant-specific promotion logic
        if (tenantId === 'tenant-tenant001') {
          promoMessage = 'Enterprise book promoted with technical review!';
        } else if (tenantId === 'tenant-tenant002') {
          promoMessage = 'Marketing book promoted with campaign boost!';
        }

        this.base.updateEntry(keys, {
          description: `[${tenantId.toUpperCase()}] PROMOTED: ` + entries[0].description,
        });

        return {
          message: promoMessage,
          promoted: true,
          tenant: tenantId,
        };

      default:
        return this.base.executeAction(actionDefinition, actionData, keys);
    }
  },
};
