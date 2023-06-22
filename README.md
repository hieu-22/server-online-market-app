# The emarket web app (server)

This project is a simple e-commerce web app with core features are posting product, real-time chating which are built using popular technologies such as ReactJS, NodeJS, SocketIo, PostgreSQL, etc.

The app uses Node.js v18 as development environment.

Source:

-   [Client](https://github.com/hieu-22/client-online-market-app.git)
-   [Server](https://github.com/hieu-22/server-online-market-app.git)

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [API Routes](#api-routes)
-   [Technologies Used](#technologies-used)
-   [License](#license)

## Installation

Note: The app uses Node.js v18 as development environment.

Clone the repository

```sh
$git clone https://github.com/hieu-22/server-online-market-app.git
```

Install dependencies by running npm install

```sh
npm install
```

## Usage

### 1. Set up .env file

Modify these variables to match your local dev environment:

```sh
PORT=3001
NODE_ENV=development
URL_REACT=http://localhost:3000

# JSON WEB TOKEN
JWT_SECRET_KEY=yourSecretKey

# POSTGRES DATABASE
DB_HOST=yourDBhost
DB_NAME=public
DB_USERNAME=postgres
DB_PASSWORD=password
DB_PORT=5432
DB_DIALECT=postgres
DB_SCHEMA=yourSchema
```

You can use my Cloudinary or your own for image storage:

```sh
# CLOUDINARY
CLOUDINARY_URL=cloudinary://538598325694588:4G_C6DuitOSGSQsRa88MElQoH6Y@duhbzyhtj
CLOUDINARY_NAME=duhbzyhtj
CLOUDINARY_KEY=538598325694588
CLOUDINARY_SECRET=4G_C6DuitOSGSQsRa88MElQoH6Y
```

If you use your own Cloudinary, you will need to update your Cloudinary configuration in the [Client](https://github.com/hieu-22/client-online-market-app/tree/master#usage) as well.
For more information:

-   [Multer Storage Cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary)
-   [Node SDK](https://cloudinary.com/documentation/node_quickstart)

### 2. Run the server

Run server once:

```sh
npm start
```

Run with nodemon:

```sh
# Make sure that you have nodemon installed
npm install -g nodemon
```

```sh
npm run dev
```

## API Routes

Check [emarket-api](https://www.postman.com/maintenance-saganist-21460907/workspace/nmhieu191/documentation/25292509-97a03a47-f4a0-4cdb-9dc3-94e6f1a8bb1c) on postman.

## Technologies Used

-   NodeJS
-   ExpressJS
-   SocketIO
-   Database: PostgreSQL (Sequelize)

## License

I'm happy that someone appreciates my project and use it for their studying or any purposes. It's free to use this project.
