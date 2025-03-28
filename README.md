# How to run the app?

## Posgres DB
1. Install and run the db using the [link](https://postgresapp.com/)
2. Initialize the db.
3. Connect to posgres server and run the command to create a database.
```create database kiddolife_db;```
4. In node_server/config/database.js provide credentials

## Frontend
1. Check that node.js in installed on your machine.
2. In terminal go to Angualr app directory. Install the packages, then run the app.
```console
cd angular-app
npm install
ng serve
```
3. Open promted address in your browser. This should be [this address](http://localhost:4200)

### If you would like to run all supported locales at a time to make internationalization work, you need to use another set of commands.
```console
cd angular-app
ng build
npm run start-locales
```

### Running the tests
```console
cd angular-app
ng test
```

## REST API
1. Check that node.js in installed on your machine.
2. In terminal go to Node app directory. Install the packages, then run the app.
```console
cd node_server
npm install
node index.js
```
3. Open promted address in your browser. This should be [this address](http://localhost:3000)

To run the tests type the command
npm test
```console
npm test
```

## SQL Client
As a PosgresSQL client - a PG admin can be used [link](https://www.postgresql.org/ftp/pgadmin/pgadmin4/v9.0/macos/). 
