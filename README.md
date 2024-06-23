# curve-ali-jahankah-test

## Overview

This project sets up an Express server connected to a MongoDB database. It reads data from an Excel file and processes it to check for existing records before saving new entries. It uses Mocha and Assert for testing.

## Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v18 or higher, Node 20 recommended)
- npm (v10)
- MongoDB (running in the background) - You can use MongoDB Compass to see the cllections and data.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ali-Jahankah/curve-ali-jahankah-test
cd curve-ali-jahankah-test
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Make Sure of the npm and Node Version

Ensure you are using Node 18 or higher and npm 10.

### 4. Running the Project

You will see that the project will run on port 4001. Make sure your port 4001 is not in use. To start the server in development mode:

```bash
npm run dev
```

### Explanation of the Project

For this project:

- We are using Node and Express for the server.
- We are using dotenv to read the environment variables.
- We are using cross-env and the environment variables are set in the package.json scripts. As it's a local environment and local DB, the DB URI is not in the environment files but in the constants files.- We are using exceljs to extract data from the xlsx file.
- We are using mongoose for creating data models, interacting with MongoDB, and ingesting data.
- We are using mocha and assert for simple testing.
- We are using nodemon to run the server during the development environment.

### -------Project aim-------

After running the project, it extracts the data from the xlsx file as rows. Data starts from row 3 as the first and second rows are headers. If there is any error during data ingestion, it shows the line numbers starting from 3 along with error details.

1. Happy path:
   If a track in the data file:

- Has a contract name and that contract name exists in the contract collection, the track will be saved in the 'track' collection with the contract id related to its contract in the 'contract' collection.
- Does not have any contract value, it will be saved again but without a contract id.

2. Unhappy path:
   You will see error messages if:

- A track with its artist, version, and title already exists in the DB/track collection.
- A track has a contract name, and the track does not exist in the DB/track collection, but the contract name does not exist in the DB/contract collection.

### Running Tests

It runs the tests using Mocha. To run the tests, make sure you have installed all the dependencies, then run:

```bash
npm test
```

### --------Contact--------

If you have any questions, feel free to contact me via email or phone:

- Phone: 07576790138
- Email: alijahankhah8@gmail.com

Also, feel free to find me on GitHub, Medium, and LinkedIn:

- GitHub: https://github.com/Ali-Jahankah
- LinkedIn: https://www.linkedin.com/in/uaral/
- Medium: https://medium.com/@ali-jahankah

Thanks!
Ali Jahankah
