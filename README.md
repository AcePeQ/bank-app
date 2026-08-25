# Infinity Finance

Infinity Finance is a small banking dashboard built as a learning project. Its purpose was to practise writing a larger browser application with **Vanilla JavaScript concepts and TypeScript**, without using a frontend framework.

> [!IMPORTANT]
> This is an educational demo, not a real banking product. It does not provide real authentication, banking operations, security guarantees, or production-ready data handling.

## Project status

**Completed for its intended learning scope.**

The application does not contain every feature that a real bank would need, and some screens are intentionally only partially interactive. I consider the project finished because it gave me the practical experience I wanted: working with the DOM, application state, events, forms, validation, asynchronous requests, mock data, loading and error states, accessibility, and TypeScript in a framework-free application.

Adding more screens at this point would mostly repeat patterns already used in the project, so I am closing this project and moving on to the next learning challenge.

## Implemented features

- Login and registration interfaces with client-side validation, password visibility controls, and form feedback.
- Dashboard populated from a mock REST API, including account information, budgets, recent transactions, spending summaries, and a monthly spending chart.
- Transactions page with searching, filtering, sorting, date grouping, calculated outflow, and loading, empty, and error states.
- Card settings with online-payment and ATM-withdrawal toggles, card freeze/unfreeze, and editable daily-spending and single-payment limits.
- Transfers area with recent recipients and separate views for bank transfer, paying a friend, and requesting a payment.
- Reusable DOM components and helpers for elements such as the sidebar, header, transactions, custom selects, switches, dialogs, and forms.
- Responsive styling and accessibility improvements such as keyboard focus states, status messages, dialog focus management, and semantic labels.

## Technology

- TypeScript
- HTML and CSS
- Vite
- JSON Server
- Chart.js
- Lucide icons

The browser code uses native DOM APIs. TypeScript provides static type checking and is compiled to JavaScript by the build process; no frontend framework is used.

## Running the project

Requirements: a recent version of Node.js and npm.

Install the dependencies:

```bash
npm install
```

Start the mock API in one terminal:

```bash
npm run api
```

Start the frontend in another terminal:

```bash
npm run dev
```

Open the address printed by Vite in the terminal. The mock API runs on `http://localhost:3001`.

To create and preview a production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
bank-app/
|-- card/                  # Card view
|-- dashboard/             # Dashboard view
|-- register/              # Registration view
|-- settings/              # Settings view
|-- transfers/             # Transactions and transfer views
|-- server/                # JSON Server database and notes
|-- src/
|   |-- components/        # Reusable DOM components
|   |-- pages/             # Page entry points and page logic
|   |-- services/          # Fetch requests and data access
|   |-- styles/            # Shared, component, and page styles
|   |-- types/             # TypeScript types
|   `-- utils/             # Validation, formatting, and helpers
`-- index.html             # Login page
```

## What I practised

- Splitting a larger application into pages, components, services, utilities, and types.
- Creating and updating UI with native DOM APIs.
- Handling events, including reusable handlers and event delegation.
- Keeping source data in state and deriving filtered or sorted views from it.
- Fetching, updating, and displaying data from a REST-style mock API.
- Designing optimistic updates and restoring UI state after failed requests.
- Building form validation and communicating errors to users.
- Formatting dates, currencies, and values with the `Intl` APIs.
- Modelling application data and DOM elements with TypeScript.
- Thinking about keyboard navigation, focus management, and screen-reader feedback.

## Known limitations

- The login and registration screens are frontend exercises; their custom authentication endpoints are not implemented by JSON Server.
- Transfer forms and payment requests are primarily UI views and do not yet persist complete operations.
- Actions such as showing a PIN or replacing a card are not implemented.
- The demo uses a fixed account context instead of a real authenticated user session.
- Data is stored in `server/db.json` and is intended only for local development.
- There is no real authorization, encryption, audit trail, transaction consistency, or secure money representation.

These limitations are deliberate consequences of the project's educational scope rather than claims of production readiness.
