# Emarket Server
The simple server for an e-commerce website utilizes the MVC structure to build routes and provide, user management, post management, and real-time chat with socketIO.
## Installation
```sh
$git clone https://github.com/hieu-22/server-online-market-app.git
npm install
```
## Usage
### 1. Set up .env file
You can customize these variables to match your local dev environment:
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
You can use my Cloudinary for image storage or your own:
```sh
# CLOUDINARY
CLOUDINARY_URL=cloudinary://538598325694588:4G_C6DuitOSGSQsRa88MElQoH6Y@duhbzyhtj
CLOUDINARY_NAME=duhbzyhtj
CLOUDINARY_KEY=538598325694588
CLOUDINARY_SECRET=4G_C6DuitOSGSQsRa88MElQoH6Y
```
Note: If you use your own Cloudinary, you will need to update your Cloudinary configuration in the [Emarket Client](https://github.com/hieu-22/client-online-market-app) as well.
For more information:
- [Multer Storage Cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary)
- [Node SDK](https://cloudinary.com/documentation/node_quickstart)
- [React SDK](https://cloudinary.com/documentation/react_integration)

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
You can check and test on [postman](https://www.postman.com/maintenance-saganist-21460907/workspace/nmhieu191/collection/25292509-97a03a47-f4a0-4cdb-9dc3-94e6f1a8bb1c?action=share&creator=25292509)
```sh
allowOrigins: [process.env.URL_REACT, undefined]
```
- `/api/register` - to register a new account
- `/api/login` - to login
- /api/user/:userId
```sh
# To get information of the user by userId (1)
fetch('https://emarket-server.onrender.com/api/user/1')
  .then((response) => response.json())
  .then((json) => console.log(json));
```
- `/api/user/:userId/get-relative-users`
```sh
# to get followers and followedUsers information of the user by userId (1)
fetch('https://emarket-server.onrender.com/api/user/1/get-relative-users')
  .then((response) => response.json())
  .then((json) => console.log(json));
```
- `/api/user/get-other-users`
```sh
# to get followers and followedUsers information, and other recommended users of the user with userId is 1
fetch('https://emarket-server.onrender.com/api/user/get-other-users?userId=1')
  .then((response) => response.json())
  .then((json) => console.log(json));
```
- `/api/user/get-saved-posts`
```sh
# to get posts that the user with userId is 1 have saved
fetch('https://emarket-server.onrender.com/api/user/get-saved-posts?userId=1')
  .then((response) => response.json())
  .then((json) => console.log(json));
```
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
