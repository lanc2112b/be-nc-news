# NC News API / Project week

A simple RESTful API built with Node.js & Express. See the example below to see the current endpoints available & their descriptions.  

#### Example [https://api.muninn.co.uk/api](https://api.muninn.co.uk/api)

#### Requirements:
Node  (^19.x)   
Postgresql (^14.x) *(It may work on earlier versions, YMMV).*   
  
#### Basic Dependancies.  
```
"dotenv": "^16.0.0",
"express": "^4.18.2",
"pg": "^8.7.3"
```

#### Testing Dependancies:  
```
"husky": "^8.0.2",
"jest": "^27.5.1",
"jest-extended": "^2.0.0",
"jest-sorted": "^1.0.14",
"pg-format": "^1.0.4",
"supertest": "^6.3.3"
```  

#### Initial Setup

`git clone` this repo with your favourite https/ssh method.  

Create `.env.test` & `.env.development`  
With `PGDATABASE=name_of_test_db` & `PGDATABASE=name_of_development_db` respectively.  

Run `npm install` (fetch & install all Node / project dependancies).  

Create the databases `npm run setup-dbs`  
Seed the database(s)  `npm run seed`  

#### Production Setup  

Create `.env.production`  
With `DATABASE_URL=path/to/database`  
E.G.: `postgres://somedbuser:somepass@somedbserver.com/somedbname`  (Or your localhost postgresql socket).  

`npm seed-prod` - creates & seeds the production db with some basic data.  


#### Running tests  
`npm test` - runs all test suites.  
`npm test utils` - runs tests on ancillary functions required for db seeding.  
`npm test app` - runs integration and error handling tests for the main api.  


#### Running The Server  
cd into the cloned repository.  (`cd /path/to/repo`).  
`npm run start`  to start the app listening.  







