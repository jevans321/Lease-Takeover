# Web App for Housing Rental Lease Takeovers

## App Description
A platform facilitating the takeover of housing rental leases for tenants seeking early termination. This service connects them with individuals looking for short-term leases, allowing for a smooth transition and lease handover.

![](./src/assets/ls_transfer_ui_preview.png)

## Tech Stack Overview

### Typescript
Adds static typing and manages complexity by catching errors at compile time, enforcing type safety, and improving code readability.

### React.js
Facilitates the development of a fast, responsive, and user-friendly interface via virtual DOM.

### Node.js
Chosen for its efficient handling of asynchronous operations, suitable for the platform's real-time updates, as well as being scalabile for future high-volume data exchange.

### Express
Streamlines the creation of web services and APIs, vital for processing lease transactions and user interactions.

### Postgres
Provides robust and reliable data storage, capable of managing complex and relational data structures.

### Prisma ORM
Simplifies database access and manipulation, ensuring smooth data operations for features like lease transfers and tenant matching.

## Features and Progress
- **UI**: 🔨 In-Progress

### Registration
- **JWT Authentication**: ✅ Complete
- **Sign-in / Register**: ✅ Complete

### Search Functionality
- **Typeahead: City**: 🔨 In-Progress
- **Dropdown: Home Type**: 🔨 In-Progress
- **Dropdown: Bedroom Count**: 🔨 In-Progress

### Members Section
- Message Queue
- Upload Image
- Image Gallery

### Express API
- **Enable Cross-Origin Resource Sharing**: ✅ Complete
- **Registration / Sign-In Endpoints**: ✅ Complete
- **Post and Get Listings Endpoints**: ✅ Complete
- **Post and Get Bookmarks Endpoints**: ✅ Complete
- **City Typeahead Endpoint**: ✅ Complete
- **Send / Receive Messages Endpoints**:
- **Upload / Fetch Images Endpoints**:

### Storage
- **Setup Postgres Development Database**: ✅ Complete
- **Setup Prisma ORM Schema**: ✅ Complete
- **Setup AWS S3 Image store**:

