export type NavPropTo<T> = T;// ====== Entity Types ======

// Type definitions for Books
export type Books = {
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  ID: string;
  title?: string;
  author?: string;
  price?: number;
  currency_code?: string;
  stock?: number;
  description?: string;
  coverUrl?: string;
  IsActiveEntity: boolean;
  HasActiveEntity: boolean;
  HasDraftEntity: boolean;
  currency?: NavPropTo<Currencies>;
  chapters?: NavPropTo<Chapters[]>;
  reviews?: NavPropTo<Reviews[]>;
  DraftAdministrativeData?: NavPropTo<DraftAdministrativeData>;
  SiblingEntity?: NavPropTo<Books>;
}
export type BooksKeys = {
  ID: string;
  IsActiveEntity: boolean;
}

// Type definitions for Chapters
export type Chapters = {
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  ID: string;
  title?: string;
  content?: string;
  pageNumber?: number;
  book_ID?: string;
  IsActiveEntity: boolean;
  HasActiveEntity: boolean;
  HasDraftEntity: boolean;
  book?: NavPropTo<Books>;
  DraftAdministrativeData?: NavPropTo<DraftAdministrativeData>;
  SiblingEntity?: NavPropTo<Chapters>;
}
export type ChaptersKeys = {
  ID: string;
  IsActiveEntity: boolean;
}

// Type definitions for Reviews
export type Reviews = {
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  ID: string;
  reviewer?: string;
  rating?: number;
  comment?: string;
  book_ID?: string;
  IsActiveEntity: boolean;
  HasActiveEntity: boolean;
  HasDraftEntity: boolean;
  book?: NavPropTo<Books>;
  DraftAdministrativeData?: NavPropTo<DraftAdministrativeData>;
  SiblingEntity?: NavPropTo<Reviews>;
}
export type ReviewsKeys = {
  ID: string;
  IsActiveEntity: boolean;
}

// Type definitions for Currencies
export type Currencies = {
  name?: string;
  descr?: string;
  code: string;
  symbol?: string;
  minorUnit?: number;
  texts?: NavPropTo<Currencies_texts[]>;
  localized?: NavPropTo<Currencies_texts>;
}
export type CurrenciesKeys = {
  code: string;
}

// Type definitions for DraftAdministrativeData
export type DraftAdministrativeData = {
  DraftUUID: string;
  CreationDateTime?: string;
  CreatedByUser?: string;
  DraftIsCreatedByMe?: boolean;
  LastChangeDateTime?: string;
  LastChangedByUser?: string;
  InProcessByUser?: string;
  DraftIsProcessedByMe?: boolean;
}
export type DraftAdministrativeDataKeys = {
  DraftUUID: string;
}

// Type definitions for Currencies_texts
export type Currencies_texts = {
  locale: string;
  name?: string;
  descr?: string;
  code: string;
}
export type Currencies_textsKeys = {
  locale: string;
  code: string;
}

// ====== Complex Types ======

// Type definitions for return_BookshopService_Books_promoteBook
export type return_BookshopService_Books_promoteBook = {
  message?: string;
  promoted?: boolean;
}

// Type definitions for return_BookshopService_Books_setDiscount
export type return_BookshopService_Books_setDiscount = {
  message?: string;
  newPrice?: number;
}

// Type definitions for return_BookshopService_Books_addChapter
export type return_BookshopService_Books_addChapter = {
  ID?: string;
  title?: string;
  pageNumber?: number;
  content?: string;
}

// Type definitions for return_BookshopService_Books_halfPrice
export type return_BookshopService_Books_halfPrice = {
  ID?: string;
  title?: string;
  price?: number;
}

// Type definitions for return_BookshopService_Books_showCoverPicture
export type return_BookshopService_Books_showCoverPicture = {
  value?: string;
}

// Type definitions for return_BookshopService_Books_getCurrentPrice
export type return_BookshopService_Books_getCurrentPrice = {
  price?: number;
}

// Type definitions for return_BookshopService_refreshCatalog
export type return_BookshopService_refreshCatalog = {
  message?: string;
  refreshedAt?: string;
}

// Type definitions for return_BookshopService_generateReport
export type return_BookshopService_generateReport = {
  message?: string;
  reportUrl?: string;
}

// Type definitions for return_BookshopService_createBooksAndChapters
export type return_BookshopService_createBooksAndChapters = {
  message?: string;
  createdBooks?: return_BookshopService_createBooksAndChapters_createdBooks[];
}

// Type definitions for return_BookshopService_createBooksAndChapters_createdBooks
export type return_BookshopService_createBooksAndChapters_createdBooks = {
  ID?: string;
  title?: string;
  author?: string;
  price?: number;
  currency?: string;
  stock?: number;
  description?: string;
  coverUrl?: string;
  chapters?: return_BookshopService_createBooksAndChapters_createdBooks_chapters[];
}

// Type definitions for return_BookshopService_createBooksAndChapters_createdBooks_chapters
export type return_BookshopService_createBooksAndChapters_createdBooks_chapters = {
  ID?: string;
  title?: string;
  content?: string;
  pageNumber?: number;
}

// Type definitions for ap_BookshopService_createBooksAndChapters_booksData
export type ap_BookshopService_createBooksAndChapters_booksData = {
  title?: string;
  author?: string;
  price?: number;
  currency?: string;
  stock?: number;
  description?: string;
  coverUrl?: string;
  chapters?: ap_BookshopService_createBooksAndChapters_booksData_chapters[];
}

// Type definitions for ap_BookshopService_createBooksAndChapters_booksData_chapters
export type ap_BookshopService_createBooksAndChapters_booksData_chapters = {
  title?: string;
  content?: string;
  pageNumber?: number;
}

// Type definitions for return_BookshopService_getSumBookPrices
export type return_BookshopService_getSumBookPrices = {
  totalPrice?: number;
}

