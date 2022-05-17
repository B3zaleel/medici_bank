# Medici Bank API

![Yarn Version](https://img.shields.io/badge/yarn-v1.22.15-brightgreen "Yarn Version")
![MongoDB Version](https://img.shields.io/badge/MongoDB-v5.0.7-blue "MongoDB Version")
<!-- [![Coverage Status](https://coveralls.io/repos/gitlab/B3zaleel/medici_bank/badge.svg?branch=main)](https://coveralls.io/gitlab/B3zaleel/medici_bank?branch=main) -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

Medici bank is a simple fictitious banking API that is built with NestJs, and uses MongoDB as a data storage system. The API uses a GraphQL querying system for system simplicity and to give you (the client) control over the data you want from the server.

## Installation

```powershell
$ yarn install
```

## Environment Variables

Create a `.env` file with the following information in the format `Name=Value`:

| Name | Description |
|:--|:--|
| MONGO_DB_URI | The development/production URI for the MongoDB database. |
| MONGO_DB_URI_TEST | The testing URI for the MongoDB database. |
| JWT_SECRET | The secret key for signing JSON Web Tokens. |
| ARGON2_SALT | A 32 byte salt for password hashing with [argon2](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjrr87Ngub3AhU0hv0HHSJ9AjYQFnoECB8QAQ&url=https%3A%2F%2Fargon2.online%2F&usg=AOvVaw04rPHdA-_i7g5aueRQV7x2). |

## Running The API

```powershell
# start the database server
$ sudo service mongodb start

# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Running The Test Suites

```powershell
# start the database server
$ sudo service mongodb start

# Run the test script
$ yarn test
```

[![A preview of the Medici bank's API testing results](assets/Medici_Bank_API_Testing_Preview.png)](https://youtu.be/DOLGIQrma8g "A preview of the Medici bank's API testing results")
