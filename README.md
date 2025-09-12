Tutorial for using `@sap-ux/ui5-middleware-fe-mockserver` in SAP Fiori development.

SAP Community Blog Post: [UI5 Middleware FE Mockserver in Practice — New Tutorial from Devtoberfest](https://community.sap.com/t5/technology-blog-posts-by-members/new-tutorial-for-ui5-middleware-fe-mockserver/ba-p/14242854)

Read this tutorial online (GitHub Pages): https://marianfoo.github.io/ui5-fe-mockserver-tutorial/

## 🚀 Two Ways to Use This Tutorial

### Option 1: Run the Tutorial Examples (Clone Required)

If you want to run the complete tutorial examples (`ex1/`, `ex2/`, ... `ex9/`) with all configurations already set up:

```bash
# Clone this tutorial repository
git clone https://github.com/marianfoo/ui5-fe-mockserver-tutorial.git
cd ui5-fe-mockserver-tutorial
npm install

# Also clone and run the CAP backend service
git clone https://github.com/marianfoo/ui5-call-action.git
cd ui5-call-action
npm install
npm run deploy
npm run watch  # Keep running on http://localhost:4004
```

### Option 2: Create Your Own App (No Clone Needed)

If you want to create your own Fiori app and follow the tutorial concepts:

- **No need to clone this repository**
- Just follow the tutorial steps to set up your own app
- You'll still need the CAP backend service for complete testing (clone `ui5-call-action` as shown above)
- Generate your own Fiori Elements app using SAP Fiori Application Generator or EasyUI5 Generator

## Table of Contents

- [Prerequisites](#prerequisites)
- [Exercises](#exercises)
- [1. Basic Setup - Generated Mock Data](#1-basic-setup---generated-mock-data)
- [2. Custom Mock Data Files - Controlled Testing Data](#2-custom-mock-data-files---controlled-testing-data)
- [3. JavaScript-based Mock Data with Custom Logic](#3-javascript-based-mock-data-with-custom-logic)
- [4. Multiple Services Configuration](#4-multiple-services-configuration)
- [5. Cross-Service Communication](#5-cross-service-communication)
- [6. Context-Based Isolation (Tenants)](#6-context-based-isolation-tenants)
- [7. Error Handling and Actions](#7-error-handling-and-actions)
- [8. Offline E2E Testing with wdi5 and Mockserver](#8-offline-e2e-testing-with-wdi5-and-mockserver)
- [9. Recording Live OData Traffic with ui5-middleware-odata-recorder](#9-recording-live-odata-traffic-with-ui5-middleware-odata-recorder)
- [Summary](#summary)

---

## Prerequisites

Before starting this tutorial, ensure you have the following tools and setup:

### Required Tools

- **Node.js** (20 LTS or higher)
- **npm** (comes with Node.js)
- **Git** - for cloning repositories

### CAP Backend Service Setup

This tutorial uses a SAP CAP (Cloud Application Programming) service with multiple OData endpoints and actions. You'll need to run the backend service locally:

1. **Clone and setup the CAP service:**

```bash
git clone https://github.com/marianfoo/ui5-call-action.git
cd ui5-call-action
npm install
npm run deploy             # sets up the SQLite database with sample data
npm run watch              # starts CAP server on http://localhost:4004
```

2. **Verify the service is running:**
   Open <http://localhost:4004> in your browser. You should see:

- **BookshopService**: `/bookshop` - Main service with Books, Chapters, Reviews
- **ReviewsService**: `/reviews` - Dedicated review management service

3. **Keep the service running** throughout this tutorial - the mockserver exercises will connect to these real services.

### Fiori Application Prerequisites

This tutorial is based on **Fiori Elements List Report & Object Page** applications. You can use your already existing app, or generate a new one using the tools below.

#### **Option 1: SAP Fiori Application Generator (Recommended)**

Generate a Fiori Elements app connected to the CAP BookshopService:

- **Service Type**: OData URL
- **Service URL**: `http://localhost:4004/bookshop`
- **Main Entity**: Books
- **Navigation Entity**: chapters (optional)
- **Template**: List Report Page V4

**Tutorial**: [Create App with Fiori Tools](https://developers.sap.com/tutorials/fiori-tools-generate-project.html)

#### **Option 2: EasyUI5 Generator**

Alternative generator for UI5 applications:

**Tutorial**: [Create App with EasyUI5 Generator](https://developers.sap.com/tutorials/cp-cf-sapui5-local-setup.html)

#### **Generated App Structure**

After generation, your app will include:

- `manifest.json` with BookshopService configuration
- `localService/mainService/metadata.xml` (downloaded from CAP service)
- `ui5.yaml` and `ui5-mock.yaml` configurations
- **Important**: Remove backend configuration from `ui5-mock.yaml` for offline development (explained in Exercise 1)

Learn to use **`@sap-ux/ui5-middleware-fe-mockserver`** for offline Fiori development.

### Documentation & Repository

- Repo: [SAP open-ux-odata](https://github.com/SAP/open-ux-odata)
- Docs: [Open UX OData Docs](https://github.com/SAP/open-ux-odata/blob/main/docs)

## Exercises

> 📋 **Before You Start**: If you need your own Fiori application, see [**Fiori Application Prerequisites**](#fiori-application-prerequisites) above for guidance on generating apps with Fiori Tools or EasyUI5 Generator.

### 📁 Exercise Overview

Each `ex{n}/` folder contains a Fiori application demonstrating different mockserver capabilities:

| Exercise | Port | Focus              | Key Files               | Test Command               |
| -------- | ---- | ------------------ | ----------------------- | -------------------------- |
| **ex1/** | 8081 | Generated Data     | `ui5-mock.yaml`         | `npm run start:ex1`        |
| **ex2/** | 8082 | Custom JSON Data   | `data/*.json`           | `npm run start:ex2`        |
| **ex3/** | 8083 | JavaScript Logic   | `data/Books.js`         | `npm run start:ex3`        |
| **ex4/** | 8084 | Multiple Services  | `reviewService/`        | `npm run start:ex4`        |
| **ex5/** | 8085 | Cross-Service Comm | `Books.js + Reviews.js` | `npm run start:ex5`        |
| **ex6/** | 8086 | Tenant Isolation   | `Books-tenant*.json`    | `npm run start:ex6`        |
| **ex7/** | 8087 | Error Handling     | `EntityContainer.js`    | `npm run start:ex7`        |
| **ex8/** | 8088 | wdi5 E2E Testing   | `sample.test.js`        | `npm run test:ex8-e2e`     |
| **ex9/** | 8089 | OData Recorder     | `ui5-record.yaml`       | `npm run start:ex9-record` |

Each exercise runs on its own port.

## 1. Basic Setup - Generated Mock Data

### 1.1 Understanding the Generated App Structure

Exercise 1 shows the basic mockserver setup with auto-generated data. The app in `ex1/` was created using the SAP Fiori Application Generator.

> 💡 **New to Fiori Apps?** If you need to generate your own app, see the [**Fiori Application Prerequisites**](#fiori-application-prerequisites) section above for step-by-step guidance using Fiori Tools or EasyUI5 Generator.

**What's in ex1/:**

- **Fiori Elements app** generated from BookshopService
- **Automatic mock data generation** - no custom data files needed
- **UI5 middleware configuration** for mockserver integration

### 1.2 Key Configuration Files

**📁 `ex1/ui5-mock.yaml` - The Core Mockserver Configuration:**

```yaml
- name: sap-fe-mockserver
  beforeMiddleware: csp
  configuration:
    mountPath: /
    services:
      - urlPath: /bookshop # Intercept calls to /bookshop
        metadataPath: ./webapp/localService/mainService/metadata.xml # Service definition
        mockdataPath: ./webapp/localService/mainService/data # Data folder (empty for now)
        generateMockData: true # Auto-generate mock data
    annotations: []
```

**Key Points:**

- **`generateMockData: true`** - Mockserver creates data automatically based on metadata
- **`urlPath: /bookshop`** - Intercepts all calls to the BookshopService
- **`metadataPath`** - Points to the real service metadata, created on app generation
- **`mockdataPath`** - Directory for custom data files (we'll use this in later exercises)

### 1.3 Important: Removing Backend Configuration for Offline Development

⚠️ **Critical Step for Generated Apps**: When Fiori tools generates an app, it includes backend configuration in `ui5-mock.yaml` that still connects to the real service. For true offline development, you must remove this configuration.

**Generated apps include this in `ui5-mock.yaml` (REMOVE THIS):**

```yaml
# ❌ Remove this section for offline mockserver development
backend:
  - path: /bookshop
    url: http://localhost:4004
```

**Why remove it?**

- With backend configuration present, the app bypasses the mockserver and connects to the real service
- This defeats the purpose of offline development and testing
- Removes the backend dependency that the mockserver is designed to eliminate

**In this tutorial**: All `ui5-mock.yaml` files have been pre-configured for offline development with backend sections removed.

### 1.4 What You'll See When Running

1. **Start the app:**

```bash
npm run start:ex1
```

2. **Explore the generated data:**

   - **List Report**: Shows books with generated titles, authors, prices
   - **Generated variety**: Different data types (strings, numbers, dates, booleans)
   - **Draft entries**: Some rows have blue left border (draft mode simulation)

3. **Test the actions:**
   - **CAP buttons work**: promoteBook, setDiscount, generateReport, refreshCatalog
   - **Parameter dialogs**: Actions with parameters show input forms
   - **No responses**: Actions do not work (we will implement the actions in the next exercises)

### 1.5 Understanding Auto-Generated Data

The mockserver analyzes the metadata and creates mock data:

```javascript
// How the mockserver interprets metadata:
String properties (title, author) → "Generated String 1", "Generated String 2"
Decimal properties (price) → Random numbers with correct precision
Integer properties (stock) → Random whole numbers
Date properties (createdAt) → Current date with variations
Boolean properties (IsActiveEntity) → true/false
UUID properties (ID) → Proper GUID format
```

### 1.6 Key Learning Points

Zero Configuration: Works immediately without any custom setup  
Metadata-Driven: Data structure matches your real service exactly  
Action Support: All OData actions and functions are recognized (even if they fail)  
Draft Simulation: Simulates draft editing

Limitations:

- Data is random and changes on restart
- Actions don't have business logic
- No cross-entity business rules
- Can't simulate specific scenarios consistently

**Next Steps**: Exercise 2 will show how to replace generated data with your own controlled JSON files for predictable testing scenarios.

## 2. Custom Mock Data Files - Controlled Testing Data

### 2.1 Why Custom JSON Data?

Exercise 2 shows how to replace auto-generated data with **controlled, predictable JSON files**. This is essential for:

- **Consistent testing scenarios** - Same data every time
- **Foreign key relationships** between entities
- **Specific test cases** - Data designed for particular UI testing needs

That is the most simple setup for test data. You only need to create the JSON files in the specified folder and name the json files with the name of the entity set like `Books.json`, `Chapters.json`, `Reviews.json`, `Currencies.json`, etc.

### 2.2 Implementing Custom JSON Mock Data

In `ex2/`, we've replaced random generation with custom JSON files.

1. **Create mock data directory and files defined in the `ui5-mock.yaml` file:**

```bash
mkdir -p webapp/localService/mainService/data
```

2. **Create `Books.json` with book data:**

Create `webapp/localService/mainService/data/Books.json`:

```json
[
  {
    "createdAt": "2025-01-01T00:00:00.000Z",
    "createdBy": "admin",
    "modifiedAt": "2025-01-01T00:00:00.000Z",
    "modifiedBy": "admin",
    "ID": "3afb35fa-e2c9-40d0-8e22-90e96ead9944",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "price": 12.99,
    "currency_code": "USD",
    "stock": 50,
    "description": "A classic novel about the American Dream",
    "coverUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg",
    "HasActiveEntity": false,
    "HasDraftEntity": false,
    "IsActiveEntity": true
  },
  {
    "createdAt": "2025-01-01T00:00:00.000Z",
    "createdBy": "admin",
    "modifiedAt": "2025-01-01T00:00:00.000Z",
    "modifiedBy": "admin",
    "ID": "7c8f2a1b-d4e5-4c6a-9b7e-1f3a5c8d2e4b",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "price": 14.5,
    "currency_code": "USD",
    "stock": 35,
    "description": "A gripping tale of racial injustice and childhood innocence",
    "coverUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
    "HasActiveEntity": false,
    "HasDraftEntity": false,
    "IsActiveEntity": true
  }
]
```

3. **Create `Currencies.json`:**

Create `webapp/localService/mainService/data/Currencies.json`:

```json
[
  {
    "code": "EUR",
    "symbol": "€",
    "name": "Euro"
  },
  {
    "code": "USD",
    "symbol": "$",
    "name": "US Dollar"
  }
]
```

4. **Update UI5 configuration to disable generated data:**

In `ui5-mock.yaml`, change `generateMockData: true` to `generateMockData: false`:

```yaml
services:
  - urlPath: /bookshop
    metadataPath: ./webapp/localService/mainService/metadata.xml
    mockdataPath: ./webapp/localService/mainService/data
    generateMockData: false
```

5. **Start the application:**

```bash
# from folder ex2
npm run start-mock
# or from root folder
npm run start:ex2
```

The app shows data from the JSON files; related chapters and reviews appear on the object page.

Custom JSON files provide consistent, predictable data for testing.

## 3. JavaScript-based Mock Data with Custom Logic

### 3.1 Implement JavaScript Mock Data

Now you'll implement JavaScript-based mock data that can generate dynamic data and handle custom actions.  
Here is the same approach as for the JSON files. You can name a javascript file with the name of the entity set like `Books.js`, `Chapters.js`, `Reviews.js`, `Currencies.js`, etc.  
In this file you can implement several methods to control the behavior of the entity set.

Using `getInitialDataSet` you can generate the initial data set dynamically. This is a alternative approach to create mock data with more control over the data and the logic. You can look at the [Mockserver API documentation](https://github.com/SAP/open-ux-odata/blob/main/docs/MockserverAPI.md#getinitialdataset) for more information about the APIs. Just return a array of book objects.

Using `executeAction` you can handle the custom actions. This is the entry point for all actions and functions. You can use a switch statement to handle the different actions like in the example below.  
Also you can use base API methods like `fetchEntries`, `updateEntry`, `addEntry`, etc. to manipulate the data. In these examples you will use `updateEntry` to update the book price.  
More info in the documentation about the [base APIs](https://github.com/SAP/open-ux-odata/blob/main/docs/MockserverAPI.md#base-api)

1. **Create `Books.js` with dynamic data generation:**

Create `webapp/localService/mainService/data/Books.js`:

```javascript
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
```

2. **Start the application:**

```bash
npm run start-mock
# or from root folder
npm run start:ex3
```

The app shows data generated by the JavaScript file.

You can test the actions by clicking on the actions in the action bar.

3. **Debugging:**

You can use the debugger to step through the code and see the data in the console:

- **IDE Debug Terminal**: Create a JavaScript Debug Terminal in VS Code for debugging

**Breakpoint locations:**

- `getInitialDataSet` - Called when application starts and loads initial data
- `executeAction` - Called when user clicks action buttons (setDiscount, promoteBook, etc.)

1. **Watching for changes:**

You can watch for changes in the data and the JavaScript file by setting `watch: true` in the `ui5-mock.yaml` file. This will reload the application when the data or the JavaScript file is changed (it is set in all ui5.yaml, it is there not by default).

JavaScript mock data enables dynamic data generation and custom action implementations.

### 3.2 Simulate Slow Responses (optional)

Add a small wait in action handlers to mimic slower backend responses when testing UI behavior (e.g. busy indicators):

```javascript
// In webapp/localService/mainService/data/Books.js
module.exports = {
  // ...
  executeAction: async function (actionDefinition, actionData, keys) {
    // Simulate latency (e.g., 800ms)
    await new Promise(r => setTimeout(r, 800));

    switch (actionDefinition.name) {
      case 'setDiscount':
        // existing logic
        break;
      default:
        this.throwError(`Action ${actionDefinition.name} not implemented`, 501);
    }
  },
};
```

Remove the delay once you no longer need to simulate latency.

## 4. Multiple Services Configuration

### 4.1 Understanding the Real Services Architecture

In this exercise, you'll configure multiple OData services based on the actual CAP services running on `http://localhost:4004`. We have two services available:

- **BookshopService**: `/bookshop` - Main service with Books, Chapters, and Reviews entities
- **ReviewsService**: `/reviews` - Service for review management

This represents a microservices setup where different domains are handled by separate services.

### 4.2 Setup Multiple Services Configuration

1. **Create directory structure for the reviews service:**

```bash
mkdir -p webapp/localService/reviewService
mkdir -p webapp/localService/reviewService/data
```

2. **Copy the actual reviews service metadata:**

Since we're using a real CAP service, we can copy the metadata directly from the running service:

Create `webapp/localService/reviewService/metadata.xml` by copying the metadata from `http://localhost:4004/reviews/$metadata`.

1. **Create review data (`webapp/localService/reviewService/data/Reviews.json`):**

```json
[
  {
    "ID": "23a6dd83-a75d-41c5-ad57-2314bc67ed2b",
    "reviewer": "John Doe",
    "rating": 5,
    "comment": "A timeless classic that never gets old!",
    "book_ID": "3afb35fa-e2c9-40d0-8e22-90e96ead9944",
    "createdAt": "2024-01-15T10:30:00Z",
    "IsActiveEntity": true,
    "HasActiveEntity": false,
    "HasDraftEntity": false
  },
  {
    "ID": "34b7ee94-f86c-52e6-be58-3425cd78fe3c",
    "reviewer": "Jane Smith",
    "rating": 4,
    "comment": "Great character development and storytelling.",
    "book_ID": "7c8f2a1b-d4e5-4c6a-9b7e-1f3a5c8d2e4b",
    "createdAt": "2024-01-20T14:45:00Z",
    "IsActiveEntity": true,
    "HasActiveEntity": false,
    "HasDraftEntity": false
  },
  {
    "ID": "45c8ff05-097d-63f7-cf69-4536de89df5d",
    "reviewer": "Book Lover",
    "rating": 3,
    "comment": "Decent read, but could be better paced.",
    "book_ID": "3afb35fa-e2c9-40d0-8e22-90e96ead9944",
    "createdAt": "2024-02-01T09:15:00Z",
    "IsActiveEntity": true,
    "HasActiveEntity": false,
    "HasDraftEntity": false
  }
]
```

4. **Create Books reference data (`webapp/localService/reviewService/data/Books.json`):**

```json
[
  {
    "ID": "3afb35fa-e2c9-40d0-8e22-90e96ead9944",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "IsActiveEntity": true,
    "HasActiveEntity": false,
    "HasDraftEntity": false
  },
  {
    "ID": "7c8f2a1b-d4e5-4c6a-9b7e-1f3a5c8d2e4b",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "IsActiveEntity": true,
    "HasActiveEntity": false,
    "HasDraftEntity": false
  }
]
```

5. **Update `ui5-mock.yaml` to include both services:**

```yaml
server:
  customMiddleware:
    - name: sap-fe-mockserver
      beforeMiddleware: csp
      configuration:
        mountPath: /
        debug: true
        watch: true
        services:
          # Main bookshop service
          - urlPath: /bookshop
            alias: bookshop
            metadataPath: ./webapp/localService/mainService/metadata.xml
            mockdataPath: ./webapp/localService/mainService/data
            generateMockData: false
          # Reviews service
          - urlPath: /reviews
            alias: reviews
            metadataPath: ./webapp/localService/reviewService/metadata.xml
            mockdataPath: ./webapp/localService/reviewService/data
            generateMockData: false
        annotations: []
```

Multiple services configuration enables testing complex applications with microservices architecture.

### 4.3 Start the Application

```bash
# from folder ex4
npm run start-mock
# or from root folder
npm run start:ex4
```

Now you should see the in the List Report the Books from the `mainService` defined in the `/webapp/localService/mainService/data` folder.

To see the data from the `reviewService` you request the data with simply opening the url [`http://localhost:8084/reviews/Reviews`](http://localhost:8084/reviews/Reviews) and [`http://localhost:8084/reviews/Books`](http://localhost:8084/reviews/Books) in the browser.

Now you could include the reviews in the App in any way you want.

## 5. Cross-Service Communication

### 5.1 Understanding Cross-Service Scenarios

Cross-service communication simulates real microservices architectures where:

- **BookshopService** handles core business operations (book promotion, inventory)
- **ReviewsService** manages review workflows (approval, moderation, statistics)
- Services need to synchronize data and trigger actions across domains

### 5.2 Implement Cross-Service Communication

1. **Enhanced Books.js with cross-service functionality:**

Update `webapp/localService/mainService/data/Books.js` to demonstrate how book operations can trigger review-related actions:

```javascript
module.exports = {
  getInitialDataSet: function (contextId) {
    // ... existing code from previous exercise ...
  },

  executeAction: function (actionDefinition, actionData, keys) {
    console.log('Executing action:', actionDefinition.name);

    switch (actionDefinition.name) {
      case 'halfPrice':
        // ... existing halfPrice code ...
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
```

2. **Start the application:**

```bash
# from folder ex5
npm run start-mock
# or from root folder
npm run start:ex5
```

If you now start the app, in the List Report the data from the `getInitialDataSet` method of the `Books.js` file is shown.  
If you select now a book in the List Report and press the Button `CAP Promote Book`, the book is promoted and a promotional review is created in the `ReviewsService`.

As we did not integrate the Service in the List Report, we can check the created review by opening the url [`http://localhost:8085/reviews/Reviews`](http://localhost:8085/reviews/Reviews) in the browser.  
There should be now atleast one entry with the comment:  
 `"comment": "📈 PROMOTIONAL: \"Biography Book 1\" has been featured! Don't miss this amazing read.",`

Cross-service communication demonstrates data synchronization between services.

## 6. Context-Based Isolation (Tenants)

### 6.1 Setup Tenant-Specific Data

This exercise shows tenant-specific data handling. Switch tenants using the `?sap-client=` query parameter (for example `?sap-client=tenant001` or `?sap-client=tenant002`). This helps when testing different scenarios without changing data files.

1. **Context-based isolation works automatically**

The mockserver automatically supports tenant-specific data files without requiring any special configuration. Simply create tenant-specific JSON files and access them using the `?sap-client=` query parameter.

**Automatic Fallback Behavior**: When no tenant-specific JSON file exists (e.g., `Chapters-tenant001.json`), the mockserver automatically falls back to the root JSON file (e.g., `Chapters.json`). This means you only need to create tenant-specific files for entities that should have different data per tenant, while other entities can use the shared root JSON files.

2. **Create tenant-specific data files:**

Create `webapp/localService/mainService/data/Books-tenant001.json`:

```json
[
  {
    "ID": "tenant001-book-001",
    "title": "Tenant 1: Enterprise Architecture",
    "author": "Tech Corp Authors",
    "price": 89.99,
    "currency_code": "EUR",
    "stock": 50,
    "description": "Enterprise-specific technical book for Tenant 001.",
    "IsActiveEntity": true,
    "HasActiveEntity": false,
    "HasDraftEntity": false
  }
]
```

Create `webapp/localService/mainService/data/Books-tenant002.json`:

```json
[
  {
    "ID": "tenant002-book-001",
    "title": "Tenant 2: Marketing Strategies",
    "author": "Marketing Gurus",
    "price": 45.0,
    "currency_code": "USD",
    "stock": 25,
    "description": "Marketing-focused content for Tenant 002.",
    "IsActiveEntity": true,
    "HasActiveEntity": false,
    "HasDraftEntity": false
  }
]
```

3. **Update Books.js to handle tenant-specific logic (not needed if you dont have custom logic):**

```javascript
module.exports = {
  executeAction: async function (actionDefinition, actionData, keys, odataRequest) {
    const tenantId = odataRequest.tenantId || 'default';
    console.log(`Executing ${actionDefinition.name} for tenant: ${tenantId}`);

    switch (actionDefinition.name) {
      case 'promoteBook':
        let promoMessage = 'Book promoted!';

        // Tenant-specific promotion logic
        if (tenantId === 'tenant-tenant001') {
          promoMessage = 'Enterprise book promoted with technical review!';
        } else if (tenantId === 'tenant-tenant002') {
          promoMessage = 'Marketing book promoted with campaign boost!';
        }

        const entries = await this.base.fetchEntries(keys);

        await this.base.updateEntry(keys, {
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
```

4. **Test with different tenants:**

- Start app normally: `npm run start-mock`
- Test with tenant001: `http://localhost:8086/index.html?sap-client=tenant001`
- Test with tenant002: `http://localhost:8086/index.html?sap-client=tenant002`

Context-based isolation enables multi-tenant testing with separate datasets per client.

### 6.2 Quick Debugging in VS Code

1. Open a JavaScript Debug Terminal in VS Code.
2. Start the app with mockserver in the debug terminal:

   ```bash
   npm run start:ex6
   ```

3. Set a breakpoint in `webapp/localService/mainService/data/Books.js` (for example in `getInitialDataSet` or `executeAction`).
4. Open the app with a tenant parameter, e.g. `http://localhost:8086/index.html?sap-client=tenant001`.
5. When the service loads or an action is triggered, VS Code pauses at your breakpoint.

## 7. Error Handling and Actions

### 7.1 Basic Error Handling Examples

This exercise shows simple error handling patterns that you can extend for your own applications.

**Update `webapp/localService/mainService/data/Books.js` with basic error examples:**

```javascript
case 'setDiscount':
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
  const currentEntries = await this.base.fetchEntries(keys);
  // ... rest of discount logic
```

### 7.2 Common Error Types

The mockserver supports standard HTTP error codes:

- **400 Bad Request**: Input validation failures
- **404 Not Found**: Entity doesn't exist
- **422 Unprocessable Entity**: Business rule violations
- **500 Internal Server Error**: System failures
- **501 Not Implemented**: Action not supported

### 7.3 Testing Error Scenarios

1. **Test validation error**: Try discount > 90% → Returns 400 error
2. **Test 500 error**: Uncomment simulation code, use percentage = 42
3. **Test 501 error**: Try unimplemented action name

**Start the application:**

```bash
npm run start:ex7
```

Basic error handling patterns for application development.

## 8. Offline E2E Testing with wdi5 and Mockserver

Exercise 8 demonstrates offline E2E testing with wdi5 (WebDriverIO UI5 Service).

### 🛠️ **Setup Instructions**

Exercise 8 (`ex8/`) is a copy of `ex7/` enhanced with wdi5 testing capabilities.

#### **Step 1: Copy Base App**

```bash
# Copy ex7 to ex8 (already done in this tutorial)
cp -r ex7/ ex8/
cd ex8
```

#### **Step 2: Initialize wdi5**

```bash
# Initialize wdi5 with latest version
npm init wdi5@latest

# Install additional UI5 service dependency
npm install --save-dev wdio-ui5-service
```

#### **Step 3: Run the Tests**

**From the ex8 directory:**

```bash
# Start the app with mockserver
npm run start-mock

# In a separate terminal, run e2e tests
npm run wdi5
```

**From the root directory:**

```bash
# Start ex8 with mockserver
npm run start:ex8

# Run e2e tests
npm run test:ex8-e2e
```

### 📋 **Simple Test Architecture**

The test suite (`webapp/test/e2e/sample.test.js`) demonstrates a **simple, reliable approach** to verify mockserver integration:

#### **Core Test Implementation**

```javascript
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
```

#### **What the Test Validates**

1. **App Loading**: Mockserver app loads successfully at `localhost:8088`
2. **UI5 Initialization**: Framework loads and initializes properly
3. **Control Detection**: UI5 table/list controls are rendered
4. **Offline Operation**: Everything works without backend dependencies

### 🔧 **Configuration Details**

The wdi5 configuration (`webapp/test/e2e/wdio.conf.js`) should be working out of the box. Only if you run on a different port, you need to change the baseUrl in the configuration.

```javascript
baseUrl: "http://localhost:8088/index.html",
```

The simple test validates that mockserver provides data to UI5 controls for offline operation.

## 9. Recording Live OData Traffic with ui5-middleware-odata-recorder

**Exercise 9** demonstrates how to use [**ui5-middleware-odata-recorder**](https://github.com/marianfoo/ui5-middleware-odata-recorder) to capture live OData traffic from your backend and automatically generate mockserver-compatible datasets.

Record live OData traffic and convert it to mockserver-compatible JSON files.

You can find the detailed documentation for the recorder [here](https://github.com/marianfoo/ui5-middleware-odata-recorder/blob/main/README.md).

### 🛠️ **How It Works**

The recorder sits between your UI5 app and backend, intercepting OData responses to create mockserver datasets:

```
Recording Phase:
Browser → UI5 Server + Recorder → Backend → Response → JSON Files

Replay Phase:
Browser → UI5 Server + Mockserver → JSON Files (offline)
```

### 🚀 **Quick Start**

Exercise 9 (`ex9/`) includes the recorder middleware pre-configured:

```bash
# 1. Ensure your CAP backend is running
cd ../ui5-call-action
npm run watch  # Backend on http://localhost:4004

# 2. Start recording mode (captures live traffic)
cd ex9
npm run start-record

# 3. Open browser with recording enabled
# http://localhost:8089/index.html?__record=1

# 4. Click through the app - data gets recorded automatically
# Navigate to books, open details, try actions, etc.

# 5. Stop server (Ctrl+C) to save recorded data

# 6. Start mockserver mode (uses recorded data)
npm run start-mock

# 7. Open browser for offline mode
# http://localhost:8089/index.html
```

**From the root directory:**

```bash
# Record live data
npm run start:ex9-record

# Use recorded data offline
npm run start:ex9-mock
```

### 📋 **Configuration Overview**

The recorder uses three UI5 configurations:

#### **1. `ui5-record.yaml` - Recording Mode**

```yaml
server:
  customMiddleware:
    # Proxy requests to live backend
    - name: fiori-tools-proxy
      afterMiddleware: compression
      configuration:
        backend:
          - path: /bookshop
            url: http://localhost:4004

    # Recorder captures responses AFTER proxy
    - name: ui5-middleware-odata-recorder
      beforeMiddleware: fiori-tools-proxy
      configuration:
        services:
          - alias: mainService
            version: v4
            basePath: /bookshop/
            targetDir: webapp/localService/mainService/data
```

#### **2. `ui5-mock.yaml` - Offline Replay Mode**

```yaml
server:
  customMiddleware:
    - name: sap-fe-mockserver
      beforeMiddleware: csp
      configuration:
        services:
          - urlPath: /bookshop
            metadataPath: ./webapp/localService/mainService/metadata.xml
            mockdataPath: ./webapp/localService/mainService/data
            generateMockData: false # Use recorded data only
```

### 🎬 **Recording Process**

#### **Step 1: Start Recording**

```bash
npm run start-record
# Server starts on http://localhost:8089
```

#### **Step 2: Enable Recording Mode**

Open: `http://localhost:8089/index.html?__record=1`

The `?__record=1` parameter tells the recorder to start capturing.

#### **Step 3: Interact With Your App**

- **Navigate**: List Report → Object Page → Sub-pages
- **Filter & Search**: Use filter bar, search fields
- **Execute Actions**: Click CAP action buttons (Promote Book, Set Discount, etc.)
- **Expand Data**: View related entities (chapters, reviews)

**What Gets Recorded:**

- All OData entity responses (Books, Chapters, Reviews, etc.)
- Service metadata (`$metadata`)
- Complete entity data (not just visible fields)
- Relationship data for `$expand` operations

#### **Step 4: Review Recorded Data**

```bash
# Check what was recorded
ls webapp/localService/mainService/data/
# Output: Books.json, Chapters.json, Reviews.json, metadata.xml
```

### 🔧 **Key Features Demonstrated**

#### **1. Complete Entity Capture**

By default, the recorder removes `$select` parameters to capture full entities:

- **UI Request**: `GET /Books?$select=ID,title&$top=10`
- **Modified Request**: `GET /Books?$top=10` (no $select)
- **Result**: Complete entity data including foreign keys, metadata fields

This ensures relationship navigation works offline and UI changes don't break mock data.

#### **2. Smart Deduplication**

Entities are automatically deduplicated by primary key:

```javascript
// Multiple requests for same book only stores once
GET / Books('3afb35fa-e2c9-40d0-8e22-90e96ead9944'); // First time
GET / Books('3afb35fa-e2c9-40d0-8e22-90e96ead9944'); // Deduplicated
```

#### **3. Metadata Integration**

The recorder automatically captures `$metadata` to understand the service.

### 🎯 **Recording Options**

#### **Multi-Tenant Recording**

Record different datasets per SAP client:

```bash
# Record tenant 100 data
http://localhost:8089/index.html?__record=1&sap-client=100
# Creates: Books-100.json, Chapters-100.json

# Record tenant 200 data
http://localhost:8089/index.html?__record=1&sap-client=200
# Creates: Books-200.json, Chapters-200.json
```

## Summary

This tutorial covers the main features of `@sap-ux/ui5-middleware-fe-mockserver` using CAP service integration:

### 🎯 **Exercise Progression Overview**

1. **Basic Setup & Generated Data**

   - **Fiori Elements app** created with SAP Fiori Application Generator
   - **Automatic mock data generation** based on OData metadata
   - **Critical configuration step**: Removing backend proxy for true offline development
   - Understanding the mockserver's automatic data generation capabilities
   - Quick prototyping without backend dependencies

2. **Custom JSON Mock Data**

   - Realistic, controlled test data with proper UUID structures
   - Static data scenarios for consistent testing
   - Integration with real CAP service metadata structure

3. **JavaScript-Based Dynamic Logic**

   - Dynamic data generation with business rules
   - Custom action implementations mirroring real CAP service behavior
   - Data manipulation and validation

4. **Multiple Services Architecture**

   - **Real CAP Integration**: Using actual `BookshopService` (`/bookshop`) and `ReviewsService` (`/reviews`)
   - **Microservices Simulation**: Different domains handled by separate services
   - **Service Actions**: Both services include bound/unbound actions for testing

5. **Cross-Service Communication**

   - **Realistic Integration Patterns**: Book promotions triggering review creation
   - **Audit Trails**: System activities logged across service boundaries
   - **Service Validation**: Cross-service data integrity checks
   - **Error Resilience**: Graceful handling of cross-service failures

6. **Context-Based Isolation (Multi-Tenancy)**

   - **Tenant-Specific Data**: Different datasets per customer/context
   - **Business Logic Variations**: Tenant-specific processing rules
   - **URL-Based Routing**: Multiple access patterns for tenant isolation

7. **Basic Error Handling**

   - **Simple Validation Examples**: Input validation with 400 Bad Request responses
   - **Error Code Patterns**: Common HTTP status codes (400, 404, 422, 500, 501)
   - **Testing Scenarios**: Easy-to-understand error simulation examples

8. **Offline E2E Testing with wdi5** ✅

   - **Simple Test Implementation**: Basic validation that mockserver provides data to UI5 controls
   - **Reliable CI/CD Integration**: 3.7-second test execution without backend dependencies
   - **UI5-Aware Testing**: Uses wdi5 (WebDriverIO UI5 Service) for UI5 control detection
   - **Offline Validation**: Proves complete functionality without network dependencies
   - **Foundation for Extension**: Simple base test ready for enhancement with complex scenarios

9. **Recording Live OData Traffic** ✅
   - **Live Data Capture**: Record real OData responses from backend systems by clicking through apps
   - **Automatic Dataset Generation**: Convert live traffic into mockserver-compatible JSON files
   - **Complete Entity Capture**: Capture full entity data, not just UI-selected fields
   - **Multi-Tenant Recording**: Record different datasets per SAP client for isolated testing
   - **Recording Workflow**: Record from backend → Replay offline for development/testing

### 🔧 **Key Technical Achievements**

- **Real CAP Service Integration**: Working with actual `http://localhost:4004/reviews/$metadata`
- **Action Patterns**: Bound, unbound, collection-bound, and nested actions
- **Basic Error Patterns**: 400, 404, 422, 500, 501 status codes with simple examples
- **Cross-Service Workflows**: Book operations triggering review management actions
- **Simple Validation**: Basic input validation patterns developers can extend
- **Error Simulation**: Simple patterns for testing different error scenarios
- **Simple E2E Testing**: Basic wdi5 integration proving mockserver + UI5 compatibility
- **CI/CD Ready Tests**: 3.7-second test execution without backend dependencies
- **Reliable Test Foundation**: Simple validation approach that always works
- **Live Data Recording**: UI5 middleware that captures real OData traffic and generates mock datasets
- **Complete Entity Capture**: Automatic removal of $select parameters to record full entity data
- **Multi-Tenant Data Isolation**: SAP client-based recording with tenant-specific JSON files

Each exercise builds upon the previous one, creating a mockserver setup for Fiori development and offline testing.
