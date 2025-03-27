<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">This project is a simple REST API built with NestJS, TypeORM, and PostgreSQL. It includes user authentication with JWT provided by Passport and CRUD operations for library management, also used Bull for queue heavy task, and caching using redis. This project purpose is for test to <a href="https://career.dot.co.id/" target="_blank">Backend Typescript Hiring Test</a></p>

## 📐 Design Pattern

In this project, several design patterns are applied to improve the structure, flexibility, and maintainability of the code. These design patterns include:

### 📚 Modular Architecture

The project is divided into several modules, each with specific responsibilities. This approach makes code management easier, increases scalability, and allows new features to be added without disrupting other modules.

### 🗃️ Repository Pattern

The Repository Pattern separates data access logic from business logic. The repository is responsible for interacting with the database and provides methods for CRUD, making the code cleaner and more organized.

### 🎯 Dependency Injection

NestJS has a built-in Dependency Injection system that allows separating dependency creation from business logic. This makes unit testing easier, as well as increasing code flexibility and reusability.

### 📦 DTO (Data Transfer Object)

DTOs are used to define the structure of data sent or received by an API. This ensures data validation and integrity, and helps in the documentation and understanding of the data structures used.

### 🔑 Strategy Pattern

This pattern is used in authentication strategies using passport, making it easy to add or change authentication strategies without having to change the main logic of the application.

## 📖 Documentation

### 📮 Postman Collection

Postman collection can be downloaded from [here](/.postman/lunarlib.postman_collection.json) and its env from [here](/.postman/lunarlib_env.postman_environment.json).

## 📖 Demo

Demo endpoint can be accessed in [here](https://dothiringtest.okifirsyah.my.id/).

## 🚀 Setup

Install required dependency

```bash
$ yarn install
```

Copy environment project. Then add configuration into .env

```bash
$ cp .env.example .env
```

Migrate the database

```bash
$ yarn run db:migrate:run
```

Seed the data

```bash
$ yarn run db:seed
```

## 🏃 Running the app

Development

```bash
$ yarn run start
```

Development - watch

```bash
$ yarn run dev
```

Production

```bash
$ yarn run prod
```

## 💻 Authors Link

- [Github](https://github.com/okifirsyah404/)
- [Linkedin](https://www.linkedin.com/in/oki-firdaus-syah-putra-738308206/)

## 😻 Thanks To NestJS Creator

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

Nest is [MIT licensed](LICENSE).
