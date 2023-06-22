# emarket server
## Introduction
The simple server for an e-commerce website utilizes the MVC structure to build routes and provide, user management, post management, and real-time chat with socketIO.
## Installation
```sh
$git clone https://github.com/hieu-22/server-online-market-app.git
npm install
```
## Usage
### 1. Set up .env file
```sh
PORT=3001
NODE_ENV=development
URL_REACT=http://localhost:3000

# JSON WEB TOKEN
JWT_SECRET_KEY=yourSecretKey

# CLOUDINARY
CLOUDINARY_URL=cloudinary://538598325694588:4G_C6DuitOSGSQsRa88MElQoH6Y@duhbzyhtj
CLOUDINARY_NAME=duhbzyhtj
CLOUDINARY_KEY=538598325694588
CLOUDINARY_SECRET=4G_C6DuitOSGSQsRa88MElQoH6Y

# POSTGRES DATABASE
DB_HOST=db.grnvjtxnwkdlbvxtvbsz.supabase.co
DB_NAME=postgres
DB_USERNAME=postgres
DB_PASSWORD=@Email123hieu123
DB_PORT=5432
DB_DIALECT=postgres
DB_SCHEMA=onlineMarketDB
```
You can customize these variables to match your requirements:
```sh
PORT=3001
NODE_ENV=development
URL_REACT=http://localhost:3000

# JSON WEB TOKEN
JWT_SECRET_KEY=yourSecretKey

# POSTGRES DATABASE
DB_HOST=db.grnvjtxnwkdlbvxtvbsz.supabase.co
DB_NAME=postgres
DB_USERNAME=postgres
DB_PASSWORD=@Email123hieu123
DB_PORT=5432
DB_DIALECT=postgres
DB_SCHEMA=onlineMarketDB
```
It's more conveninent to use the same configuration for CLOUDINARY.

```sh
# CLOUDINARY
CLOUDINARY_URL=cloudinary://538598325694588:4G_C6DuitOSGSQsRa88MElQoH6Y@duhbzyhtj
CLOUDINARY_NAME=duhbzyhtj
CLOUDINARY_KEY=538598325694588
CLOUDINARY_SECRET=4G_C6DuitOSGSQsRa88MElQoH6Y
```
For more information:
- [https://www.npmjs.com/package/multer-storage-cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary)
- [https://cloudinary.com/documentation/node_quickstart](https://cloudinary.com/documentation/node_quickstart)

### 2.To run the server
```sh
npm start
```
To run with nodemon
Note: make sure that you have nodemon installed globally
```sh
npm install -g nodemon
```
```sh
npm run dev
```
## API Routes
[/api/register](https://emarket-server.onrender.com/api/register) -  to register a new account
[/api/login](https://emarket-server.onrender.com/api/login) - to login
Read Users:
[/api/user/:userId](https://emarket-server.onrender.com/api/user/1) - to get information of a specific user by userId
[/api/user/:userId/get-relative-users](https://emarket-server.onrender.com/api/user/1/get-relative-users) - to get followers and followedUsers information of a specific user by userId
router.get("/user/get-other-users", handleGetOtherUsers)
[/api/user/:userId/get-relative-users](https://emarket-server.onrender.com/api/user/1/get-relative-users)
[/api/user/get-other-users?userId=1]
[/api/user/get-saved-posts?userId=1]
[/api/user/:id/update-user-information]
[/api/user/:id/changeAvatar]
[/api/user/:id/update-password]
[/api/user/:id/update-status]
[/api/user/:id/remove-relationship]
[/api/user/delete-saved-post]



