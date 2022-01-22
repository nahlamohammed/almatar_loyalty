# Almatar Loyalty

AlmatarLoyalty is a simple web application that allows users to transfer their loyalty
points to each other.


## Table of Contents

* [Framework](#framework)

* [Technologies](#technologies)

* [Installation](#installation)

* [Configuration](#configuration)

* [Execution](#execution)

* [Routes](#routes)


## Framework

[Nest](https://docs.nestjs.com/) (NestJS) is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript 



## Technologies

Node.js, TypeScrpt and MongoDB


## Installation

```bash
$ npm install
```


## Configuration

Create .env file in the project root directory. A sample .env file looks something like [this](https://docs.google.com/document/d/1oCHL-XKeyekATPFrcyUUUT7ZV6dRx2IgiF_jJ86rNYw/edit?usp=sharing).


## Execution

```bash
$ npm run start
```


## Routes

[RESTful API Postman Collection](https://drive.google.com/file/d/1Lp0NJGZnDeSjtsIgRyhwKyt2iErfbTx3/view?usp=sharing)

| Feature                             | Route                                                       | Method |
|-------------------------------------|-------------------------------------------------------------|--------|
| User registration                   | {{url}}/users                                               | Post   |
| User sign in                        | {{url}}/users/actions/auth                                  | Post   |
| Get user by id (To get user points) | {{url}}/users/:userId                                       | Get    |
| Me                                  | {{url}}/users/actions/me                                    | Get    |
| Transfer points                     | {{url}}/users/:userId/transfers                             | Post   |
| Confirm transfer                    | {{url}}/users/:userId/transfers/:transferId/actions/confirm | Post   |
| Get user transfers                  | {{url}}/users/:userId/transfers                             | Get    |
