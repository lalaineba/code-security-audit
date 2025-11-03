## PROJECT OVERVIEW 

# Employee Directory & Branch Management API is a REST API implemented in TypeScript using Express and Firestore. It provides endpoints for CRUD operations for Employees and Branches and filtering employees by branch or department. This is useful for managing the information of the employees and branches for a company. This API also has secure management of connection and configuration information and OpenAPI documentation. 
Architecture highlights:
- src/api/v1/controllers - HTTP controllers
- src/api/v1/services - business logic
- src/api/v1/repositories - Firestore access layer (single place to mock for tests)
- src/api/v1/validations - Joi schemas used for request validation and OpenAPI components
- config/ - app configuration (Firebase, Swagger, Helmet, CORS)
- test/ - Jest unit tests

## INSTALLATION INSTRUCTIONS

# Requirements
- Node.js 
- npm (comes with Node) 
- Firebase service account 
- Environment Variables

Run the following npm installations:
npm install (install dependencies defined in package.json).
npm start (start the local server)
By default the app listens on the port defined by `PORT` (3000 if not set). Open `http://localhost:3000` for a quick health check. 
npm test (to run tests using Jest)

## ENVIRONMENT VARIABLE SETUP

npm install dotenv (This installs the dotenv package that loads environment variables from a .env file into process.env to keep sensitive information like API keys out of your codebase.)
Create a `.env` file in the project root (do not commit it to the source control). The app expects at least the following variables:
- NODE_ENV= `development` or `production` (defaults to development behavior)
- PORT= port to run the server (defaults to `3000`)
- FIREBASE_PROJECT_ID= your Firebase project id
- FIREBASE_PRIVATE_KEY=the private key from the service account 
- FIREBASE_CLIENT_EMAIL=the client email from the service account
- SWAGGER_SERVER_URL — (optional) server URL used in generated swagger (default: `http://localhost:3000/api/v1`)

## GENERATE OPENAPI DOCS

This project includes a small script (generate-openapi.ts) to generate `openapi.json` from the JSDoc annotations and an npm script to build static HTML via Redocly:
npm install -D @redocly/cli
npm run generate-docs (Run the script to make sure it works)
The command runs `scripts/generate-openapi.ts` (which writes `openapi.json`) and then runs `@redocly/cli` to build `docs/index.html`. Alternatively, while running the server locally you can visit `/api-docs` (swagger UI) to view the same generated spec.

## API REQUEST EXAMPLES (POSTMAN)

# Code snippets from Postman (JavaScript: Fetch) 

# getAllEmployees endpoint:
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/employees", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

# createEmployee endpoint:
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "name": "Lalaine Balmediano",
  "position": "Security Analyst",
  "department": "IT",
  "email": "lalaine.balmediano@pixell-river.com",
  "phone": "777-777-777",
  "branchId": 1
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/employees/", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

# getAllBranchEmployees endpoint:
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("http://localhost:3000/api/v1/employees/branch/1", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

## LINK TO PUBLIC DOCUMENTATION

Public API documentation deployed to GitHub Pages:
https://lalaineba.github.io/bed_assignment2/

## LOCAL DOCUMENTATION ACCESS

To access the OpenAPI documentation locally when running the application:
run “npm run generate-docs” to create a “docs/index.html”  file with the API documentation
Then head to the local Swagger UI (when server running): http://localhost:3000/api-docs

## SECURITY CONFIGURATION DOCUMENTATION

# CORS
For my API’s cors configuration, I implemented Environment-Based CORS Configuration because I wanted something that is not too strict on security and access controls so I can test easily on Postman while in development phase. The origins and credentials are set to true, to allow tools like Postman call the API locally without restriction.

# HELMET
For my API’s helmet configuration, I used the environment-based configuration and set the NODE_ENV as “development” so the function treats the app as in development mode. This will automatically that the security settings to be looser and more relaxed. I also disabled the HTTPS enforcement so that the server can work with HTTP, or my local HTTP doesn’t get blocked. The max age for this security will be 3153600 seconds (1 year), then after that period, the browser will enforce HTTPS.

Reference:
https://www.npmjs.com/package/cors
https://www.npmjs.com/package/helmet
