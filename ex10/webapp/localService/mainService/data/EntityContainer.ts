import type { ODataRequest, Action, KeyDefinitions } from '@sap-ux/ui5-middleware-fe-mockserver';
import { MockEntityContainerContributorClass } from '@sap-ux/ui5-middleware-fe-mockserver';
import type {
  return_BookshopService_getSumBookPrices,
  Books,
  return_BookshopService_refreshCatalog,
  return_BookshopService_generateReport,
  return_BookshopService_createBooksAndChapters,
  ap_BookshopService_createBooksAndChapters_booksData,
} from './ODataTypes';

type EntityContainerAction_getSumBookPricesData = {}
type EntityContainerAction_massHalfPriceData = {
  books?: Books[];
}
type EntityContainerAction_refreshCatalogData = {}
type EntityContainerAction_generateReportData = {
  reportType?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
type EntityContainerAction_createBooksAndChaptersData = {
  booksData?: ap_BookshopService_createBooksAndChapters_booksData[];
}
  ;
export type EntityContainerActionData =
  | {
  _type: 'getSumBookPrices';
}
  | {
  _type: 'massHalfPrice';
} & EntityContainerAction_massHalfPriceData
  | {
  _type: 'refreshCatalog';
}
  | {
  _type: 'generateReport';
} & EntityContainerAction_generateReportData
  | {
  _type: 'createBooksAndChapters';
} & EntityContainerAction_createBooksAndChaptersData;

export default class EntityContainer extends MockEntityContainerContributorClass {

  async getSumBookPrices(_actionDefinition: Action, _actionData: EntityContainerAction_getSumBookPricesData, _keys: KeyDefinitions, _odataRequest: ODataRequest): Promise<return_BookshopService_getSumBookPrices> {
    throw new Error('getSumBookPrices is not implemented');
  }

  async massHalfPrice(_actionDefinition: Action, _actionData: EntityContainerAction_massHalfPriceData, _keys: KeyDefinitions, _odataRequest: ODataRequest): Promise<Books[]> {
    throw new Error('massHalfPrice is not implemented');
  }

  async refreshCatalog(_actionDefinition: Action, _actionData: EntityContainerAction_refreshCatalogData, _keys: KeyDefinitions, _odataRequest: ODataRequest): Promise<return_BookshopService_refreshCatalog> {
    throw new Error('refreshCatalog is not implemented');
  }

  async generateReport(_actionDefinition: Action, _actionData: EntityContainerAction_generateReportData, _keys: KeyDefinitions, _odataRequest: ODataRequest): Promise<return_BookshopService_generateReport> {
    throw new Error('generateReport is not implemented');
  }

  async createBooksAndChapters(_actionDefinition: Action, actionData: EntityContainerAction_createBooksAndChaptersData, _keys: KeyDefinitions, _odataRequest: ODataRequest): Promise<return_BookshopService_createBooksAndChapters> {
    console.log('📚 Processing bulk book creation...');

    // Validate input structure
    if (!actionData.booksData || !Array.isArray(actionData.booksData)) {
      this.throwError('Invalid books data provided', 400, {
        error: {
          code: 'INVALID_BULK_DATA_STRUCTURE',
          message: 'booksData must be an array of book objects',
          target: 'booksData',
          details: [
            {
              code: 'EXPECTED_FORMAT',
              message: 'Expected: { booksData: [{ title, author, price, ... }, ...] }',
              severity: 'info',
            },
          ],
        },
      });
    }

    if (actionData.booksData.length === 0) {
      this.throwError('No books provided for creation', 400, {
        error: {
          code: 'EMPTY_BOOKS_DATA',
          message: 'At least one book must be provided',
          target: 'booksData',
        },
      });
    }

    // Validate each book and collect validation errors
    const validationErrors = [];
    const validatedBooks = [];

    actionData.booksData.forEach((bookData, index) => {
      const bookErrors = [];

      // Required field validation
      if (!bookData.title || bookData.title.trim() === '') {
        bookErrors.push({
          code: 'MISSING_TITLE',
          message: `Book ${index + 1}: Title is required`,
          target: `booksData[${index}].title`,
        });
      }

      if (!bookData.author || bookData.author.trim() === '') {
        bookErrors.push({
          code: 'MISSING_AUTHOR',
          message: `Book ${index + 1}: Author is required`,
          target: `booksData[${index}].author`,
        });
      }

      // Price validation
      const price = parseFloat(bookData.price.toString());
      if (isNaN(price) || price < 0) {
        bookErrors.push({
          code: 'INVALID_PRICE',
          message: `Book ${index + 1}: Price must be a non-negative number`,
          target: `booksData[${index}].price`,
        });
      } else if (price > 1000) {
        bookErrors.push({
          code: 'EXCESSIVE_PRICE',
          message: `Book ${index + 1}: Price exceeds maximum allowed (€1000)`,
          target: `booksData[${index}].price`,
        });
      }

      validationErrors.push(...bookErrors);

      if (bookErrors.length === 0) {
        validatedBooks.push({
          ...bookData,
          price: price,
          index: index,
        });
      }
    });

    // If any validation errors, stop processing
    if (validationErrors.length > 0) {
      this.throwError(
        'Bulk creation validation failed',
        422, // Unprocessable Entity
        {
          error: {
            code: 'BULK_VALIDATION_FAILED',
            message: `${validationErrors.length} validation error(s) found`,
            details: validationErrors,
          },
        }
      );
    }

    // Process validated books
    const createdBooks = [];
    const failedBooks = [];

    validatedBooks.forEach(bookData => {
      try {
        const bookId = `bulk-${Date.now()}-${bookData.index}-${Math.random().toString(36).substring(7)}`;
        const bookEntry = {
          ID: bookId,
          title: bookData.title.trim(),
          author: bookData.author.trim(),
          price: bookData.price,
          currency_code: bookData.currency || 'EUR',
          stock: parseInt(bookData.stock) || 10,
          description: bookData.description || `Book by ${bookData.author}`,
          coverUrl: bookData.coverUrl || '',
          IsActiveEntity: true,
          HasActiveEntity: false,
          HasDraftEntity: false,
          createdAt: new Date().toISOString(),
        };

        // In a real scenario, this would interact with the database
        // For mock purposes, we simulate successful creation
        console.log(`✅ Created book: ${bookEntry.title} by ${bookEntry.author}`);
        createdBooks.push(bookEntry);
      } catch (error) {
        console.error(`❌ Failed to create book at index ${bookData.index}:`, error);
        failedBooks.push({
          index: bookData.index,
          title: bookData.title,
          error: error.message,
        });
      }
    });

    const response = {
      message: `Bulk creation completed: ${createdBooks.length} books created successfully`,
      summary: {
        totalRequested: actionData.booksData.length,
        successful: createdBooks.length,
        failed: failedBooks.length,
        validationErrors: validationErrors.length,
      },
      createdBooks: createdBooks.map(book => ({
        ID: book.ID,
        title: book.title,
        author: book.author,
        price: book.price,
      })),
      processingTime: new Date().toISOString(),
    };

    // Add warnings if any books failed
    if (failedBooks.length > 0) {
      // response.warnings = failedBooks.map(failed => ({
      //   code: 'BOOK_CREATION_FAILED',
      //   message: `Failed to create "${failed.title}": ${failed.error}`,
      //   severity: 'warning',
      // }));
    }

    console.log(`📊 Bulk creation summary: ${createdBooks.length}/${actionData.booksData.length} successful`);
    return response;
  }

  async executeAction(actionDefinition: Action, actionData: EntityContainerActionData, keys: KeyDefinitions, odataRequest: ODataRequest): Promise<unknown> {
    console.log('🌐 Executing unbound action:', actionDefinition.name);
    console.log('📊 Service context:', {
      timestamp: new Date().toISOString(),
      tenant: odataRequest?.tenantId || 'default',
    });
    switch (actionData._type) {
      case 'getSumBookPrices':
        return this.getSumBookPrices(actionDefinition, actionData, keys, odataRequest);
      case 'massHalfPrice':
        return this.massHalfPrice(actionDefinition, actionData, keys, odataRequest);
      case 'refreshCatalog':
        return this.refreshCatalog(actionDefinition, actionData, keys, odataRequest);
      case 'generateReport':
        return this.generateReport(actionDefinition, actionData, keys, odataRequest);
      case 'createBooksAndChapters':
        return this.createBooksAndChapters(actionDefinition, actionData, keys, odataRequest);
      default:
        this.throwError(`Unbound action '${actionDefinition.name}' not implemented`, 501, {
          error: {
            code: 'UNBOUND_ACTION_NOT_FOUND',
            message: `Service-level action '${actionDefinition.name}' is not available`,
            target: actionDefinition.name,
          },
        });
        return;
    }
  }
}