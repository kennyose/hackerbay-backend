## HackerBay Backend

A Microservice with 2 main functions of patching JSON and generating thumbnail.
</br>

## Prerequisites

This project requires nodejs installed on your local machine.
</br>

## Getting started

The following instructions would get this project up and running on you local machine for development and testing purpose
</br>

## Cloning

```sh
  mkdir project-directory
  cd project-directory
  git clone https://github.com/kennyose/hackerbay-backend
```

## Installing

```sh
  cd project-directory
  # run the command
  npm install
```

## Directory Tree

```
project-directory
├── node_modules
├── public
│ └── css
│ │ └── style.css
│ └── js
│ └── custom.js
├── src
│ └── app.js
│ └── controllers.js
│ └── index.js
│ └── middleware.js
│ └── routes.js
| └── utils.js
├── test
│ └── index.test.js
├── views
│ └── error.ejs
│ └── errorPage.ejs
│ └── index.ejs
│ └── login.ejs
├── .dockerignore
├── .editorconfig
├── .env
├── .gitignore
├── access.log
├── Dockerfile
├── LICENSE.md
├── .package-lock.json
├── .package.json
├── README.md
```

## Env

- Create a .env file
- write your secret `JWT_SECRET=yoursecret`

## Starting server

```sh
 npm start
```

Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

## Test

- Don't forget to hardcode a resently signed jwt token for use in `index.test.js Ln 9 Col 1` while testing.

```sh
  npm test
```

## Test Coverage

```sh
  npm run cover
```

## Coding Style

This Project uses [EsLint](https://github.com/eslint/eslint) for coding guide

## Built with

This Project is built with:

- **NodeJS** - Javascript runtime engine
- **ExpressJS** - Web Server Framework
- **Mocha and Supertest** - Unit test

## API route

- **POST** _http://localhost:8080/login_:
  - _Request_ - **username** and **password** in body of request.
  - _Response_ - a JSON containing signed JWT under _token_.
- **POST** _http://localhost:8080/patch_:
  - _Request_ - **json**[should be an object] and **patch**[should be an array of object(s) containing *op*, *path* & *value*] both strigified in body of request.
  - _Response_ - a JSON containing result of patch operation under _patchedObj_
- **POST** _http://localhost:8080/thumbnail_:
  - _Request_ - **url**[containing a URI of public image] in query of request.
  - _Response_ - a binary data in chunks.

## Caveats

- **Test** - JWT is unable to sign when testing,
  - **Fix** - expose **process.env.JWT_SECRET** in `controller.js Ln 27 Col 31` and in `middleware.js Ln 9 Col 25`
