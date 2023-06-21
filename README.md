# EMARKET SERVER
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
- [/api/register] - to register a new account
- [/api/login] - to login
- [/api/user/:userId](https://emarket-server.onrender.com/api/user/1) - to get information of a specific user
- [/api/user/:userId/get-relative-users](https://emarket-server.onrender.com/api/user/1/get-relative-users) - to get followers and followedUsers information of a specific user
- [/api/user/get-other-users?userId=1] - to get followers and followedUsers information, and other recommended users of a specific user
- [/api/user/get-saved-posts?userId=1] - to get posts that the user have saved 
- [/api/user/:id/update-user-information] - to update user's information (except for 'avatar')
- [/api/user/:id/changeAvatar] - to update user's avatar
- [/api/user/:id/update-password] - to update user's password
- [/api/user/:id/update-status] - to update user's status which show user is online or offline
- [/api//user/:id/add-relationship] - to follow the other user
- [/api/user/:id/remove-relationship] - to unfollow the other user
- [/api/user/:userId/save-post] - to save the specified post, the user can see saved posts in their `SavedPosts`
- [/api/user/delete-saved-post] - to delete a specified saved post from a specified user's `savedPosts`
- [/api/posts/add-post] - to create a post
- [/api/posts/first] - to get limit newest posts
- [/api/posts/next/] - to get second limit newest posts based on a lasted fetched post timestamp
- [/api/posts/getByUserId] - to get all posts which created by a specified user 
- [/api/posts/search] - to get posts that pass the search query algorithm
- [api/posts/:post_url] - to get post by its url
- [/api/posts/:postId/update] - to update a specific post
- [/api/posts/:postId/delete] - to delete a specific post
- [/api/conversations/create] - to create a conversation by a specifed post
- [/api/conversations/createByUserId] - to create a conversation without post

## Technologies Used
- NodeJS
- ExpressJS
- SocketIO
- DATABASE: PostgreSQL (SEQUELIZE)
