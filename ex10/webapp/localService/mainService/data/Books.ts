import type {
  ODataRequest,
  Action,
  NavigationProperty,
  PartialReferentialConstraint,
} from '@sap-ux/ui5-middleware-fe-mockserver';
import { MockDataContributorClass } from '@sap-ux/ui5-middleware-fe-mockserver';
import type {
  Books,
  BooksKeys,
  return_BookshopService_Books_promoteBook,
  return_BookshopService_Books_setDiscount,
  return_BookshopService_Books_addChapter,
  return_BookshopService_Books_halfPrice,
  return_BookshopService_Books_showCoverPicture,
  return_BookshopService_Books_getCurrentPrice,
} from './ODataTypes';

type BooksAction_promoteBookData = {
  in?: Books;
}
type BooksAction_setDiscountData = {
  in?: Books;
  percentage?: number;
  reason?: string;
}
type BooksAction_addChapterData = {
  in?: Books;
  title?: string;
  pageNumber?: number;
  content?: string;
}
type BooksAction_halfPriceData = {
  in?: Books;
}
type BooksAction_showCoverPictureData = {
  in?: Books;
}
type BooksAction_massHalfPriceData = {
  books?: Books[];
}
type BooksAction_similarBooksData = {
  book?: Books;
}
type BooksAction_getCurrentPriceData = {
  in?: Books;
}
  ;
export type BooksActionData =
  | {
  _type: 'promoteBook';
} & BooksAction_promoteBookData
  | {
  _type: 'setDiscount';
} & BooksAction_setDiscountData
  | {
  _type: 'addChapter';
} & BooksAction_addChapterData
  | {
  _type: 'halfPrice';
} & BooksAction_halfPriceData
  | {
  _type: 'showCoverPicture';
} & BooksAction_showCoverPictureData
  | {
  _type: 'massHalfPrice';
} & BooksAction_massHalfPriceData
  | {
  _type: 'similarBooks';
} & BooksAction_similarBooksData
  | {
  _type: 'getCurrentPrice';
} & BooksAction_getCurrentPriceData;

export default class BooksContributor extends MockDataContributorClass<Books> {
  getInitialDataSet(contextId: string): Books[] {
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
  }

  async promoteBook(_actionDefinition: Action, _actionData: BooksAction_promoteBookData, keys: BooksKeys, odataRequest: ODataRequest): Promise<return_BookshopService_Books_promoteBook> {
    const entry = await this.base.fetchEntries(keys, odataRequest); // expecting only one entry
    const firstEntry = entry[0];
    // Mark book as promoted
    await this.base.updateEntry(keys, {
      description: 'PROMOTED: ' + firstEntry.description,
      stock: firstEntry.stock + 10,
    }, odataRequest);
    return {
      message: 'Book has been promoted successfully!',
      promoted: true,
    };
  }

  async setDiscount(_actionDefinition: Action, actionData: BooksAction_setDiscountData, keys: BooksKeys, odataRequest: ODataRequest): Promise<return_BookshopService_Books_setDiscount> {
    // Simple validation example - discount cannot exceed 90%
    if (actionData.percentage > 90) {
      this.throwError('Discount cannot exceed 90%', 400, {
        error: {
          code: 'INVALID_DISCOUNT',
          message: 'Company policy: Maximum discount is 90%',
        },
      });
    }

    // Simple 500 error simulation - uncomment to test
    // if (actionData.percentage === 42) {
    //   this.throwError('Simulated server error', 500);
    // }

    // Normal business logic continues...
    const currentEntries = await this.base.fetchEntries(keys, odataRequest);
    if (currentEntries.length > 0) {
      const currentBook = currentEntries[0];
      const discountPercentage = actionData.percentage || 10; // Default 10% if not provided
      const discountMultiplier = (100 - discountPercentage) / 100;
      const newPrice = Math.round(currentBook.price * discountMultiplier * 100) / 100;

      // Update the book with new price
      await this.base.updateEntry(keys, { price: newPrice }, odataRequest);

      return {
        message: `${discountPercentage}% discount applied to "${currentBook.title}"`,
        newPrice: newPrice,
        // originalPrice: currentBook.price,
        // reason: actionData.reason || 'Mock discount applied',
      };
    }
  }

  async addChapter(_actionDefinition: Action, _actionData: BooksAction_addChapterData, _keys: BooksKeys, _odataRequest: ODataRequest): Promise<return_BookshopService_Books_addChapter> {
    throw new Error('addChapter is not implemented');
  }

  async halfPrice(_actionDefinition: Action, _actionData: BooksAction_halfPriceData, _keys: BooksKeys, _odataRequest: ODataRequest): Promise<return_BookshopService_Books_halfPrice> {
    throw new Error('halfPrice is not implemented');
  }

  async showCoverPicture(_actionDefinition: Action, _actionData: BooksAction_showCoverPictureData, _keys: BooksKeys, _odataRequest: ODataRequest): Promise<return_BookshopService_Books_showCoverPicture> {
    throw new Error('showCoverPicture is not implemented');
  }

  async massHalfPrice(_actionDefinition: Action, _actionData: BooksAction_massHalfPriceData, _keys: BooksKeys, _odataRequest: ODataRequest): Promise<Books[]> {
    throw new Error('massHalfPrice is not implemented');
  }

  async similarBooks(_actionDefinition: Action, _actionData: BooksAction_similarBooksData, _keys: BooksKeys, _odataRequest: ODataRequest): Promise<Books[]> {
    throw new Error('similarBooks is not implemented');
  }

  async getCurrentPrice(_actionDefinition: Action, _actionData: BooksAction_getCurrentPriceData, _keys: BooksKeys, _odataRequest: ODataRequest): Promise<return_BookshopService_Books_getCurrentPrice> {
    throw new Error('getCurrentPrice is not implemented');
  }

  async executeAction(actionDefinition: Action, actionData: BooksActionData, keys: BooksKeys, odataRequest: ODataRequest): Promise<object | undefined> {
    switch (actionData._type) {
      case 'promoteBook':
        return this.promoteBook(actionDefinition, actionData, keys, odataRequest);
      case 'setDiscount':
        return this.setDiscount(actionDefinition, actionData, keys, odataRequest);
      case 'addChapter':
        return this.addChapter(actionDefinition, actionData, keys, odataRequest);
      case 'halfPrice':
        return this.halfPrice(actionDefinition, actionData, keys, odataRequest);
      case 'showCoverPicture':
        return this.showCoverPicture(actionDefinition, actionData, keys, odataRequest);
      case 'massHalfPrice':
        return this.massHalfPrice(actionDefinition, actionData, keys, odataRequest);
      case 'similarBooks':
        return this.similarBooks(actionDefinition, actionData, keys, odataRequest);
      case 'getCurrentPrice':
        return this.getCurrentPrice(actionDefinition, actionData, keys, odataRequest);
      default:
        this.throwError(`Action ${actionDefinition.name} not implemented`, 501);
        return;
    }
  }
}
