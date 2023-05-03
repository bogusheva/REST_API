## My steps:

1. Make a folder for project
2. npm init -y - create package.json with default options
3. npm i -D typescript - install TS
4. npm i -D ts-node - ts-node is a tool for running TypeScript code directly from the command line or scripts without prior compilation to JavaScript.
5. npm i -D nodemon - nodemon is a tool that helps in the development process by automatically restarting a Node.js application when file changes in the directory are detected. It eliminates the need to manually stop and restart the server every time a change is made
6. create a file tsconfig.json in root directory:
   -in the "compilerOptions" option, TypeScript compiler settings are specified, which determine how TypeScript code will be transpiled into JavaScript code.
   - "module": "NodeNext" - in compilerOptions specifies the module system used in the generated JavaScript files. In this case, "NodeNext" refers to the experimental ECMAScript module support in Node.js, which allows for using the import/export syntax instead of require/module.exports.
   - "baseUrl": "src" specifies the root directory for resolving non-relative module names.
   - "outDir": "dist" specifies the output directory for compiled files.
   - "sourceMap": true generates source map files which allow debugging of the TypeScript code directly in the browser or in a code editor.
   - "noImplicitAny": true flags an error if TypeScript infers an any type for a variable that has no type annotation.
7. create a file nodemon.json, which is used to configure the nodemon runtime parameters, which is a tool used for automatically restarting the server when changes are made to project files.
8. create folder src and file index.ts in it
9. in package.json create script "start": "nodemon" and after that run in terminal command "npm start"
10. npm i express body-parser cookie-parser compression cors
11. set up express server importing such modules in index.ts:
    - "express" is a module that provides functionality for creating and configuring a server based on Express.js.
    - "http" is a Node.js module that is used to create an HTTP server.
    - "body-parser" is a module that allows parsing request bodies in JSON format, forms, and other data types.
    - "cookie-parser" is a module used for parsing and setting cookies.
    - "compression" is a module that provides data compression before sending it to the client.
    - "cors" is a module that allows configuring a security policy to allow requests from other domains.
12. in index.ts
    - const app = express(); - creates an instance of an Express application, which acts as a server. After creating we can configure how it handles routes and then start the server on a specific port.
    - app.use(cors({credentials: true,})); - the server allows requests to be sent from other domains and passes cookies along with requests if they exist. This is necessary, for example, for user authorization, when the server needs to know that the request was sent by an authenticated user.
    - const server = http.createServer(app); - HTTP server is created and the server starts listening for incoming requests on the specified port.
    - server.listen(8080) - it is set on localhost:8080
13. Register on https://cloud.mongodb.com/, create database "Cluster0", click "Connect", choose "Drivers", add your connection string into index.ts
14. npm i mongoose - library mongoose for working with MongoDB
    npm i -D @types/mongoose
15. in index.ts import mongoose from "mongoose" and set it up.
    mongoose.Promise = Promise;
    mongoose.connect(MONGO_URL);
    mongoose.connection.on("error", (error: Error) => console.log(error));
16. Create in src folder db and file users.ts in it, make UserSchema in users.ts users mongoose schema.
    The part with the authentication parameters defines fields for user authentication:
    - password: the user's password, which will be stored in encrypted form. It is required to be filled in (required: true), but will not be returned in database queries (select: false).
    - salt: a random character set that will be used to hash the password. It will also not be returned in database queries (select: false).
    - sessionToken: the user's session token, which will be used to authorize the user. It will also not be returned in database queries (select: false).
17. Then create UserModel using UserSchema and different function to deal with usual operations: getUsers, gerUserById, getUserByEmail, getUserBySessionToken, deleteUserById, updateUserById.
18. Then new user is being created by calling the createUser function, which takes an object values as a parameter.
    export const createUser = (values: Record) =>
    new UserModel(values).save().then((user) => user.toObject());
    The function creates a new instance of the UserModel model with the provided values and saves it to the database using the save() method. Once the user is saved to the database, the toObject() method is called on the user object, which returns a plain JavaScript object that can be used as a response to an API call or manipulated as needed.
19. Create in src folder 'helpers' and a file index.ts in it. Here we use authentication helpers that help us encrypt the password or to create a random token.
    random = () => crypto.randomBytes(128).toString("base64");

    - function uses the crypto module of Node.js to generate 128 random bytes and converts the resulting buffer to a base64 encoded string. The crypto.randomBytes() method generates cryptographically strong pseudo-random data that can be used for security-related purposes such as generating session tokens, password salts, and cryptographic keys.

    authentication = (salt: string, password: string) => { return crypto.createHmac("sha256", [salt, password].join("/")).update(SECRET);};

    - it creates a hash-based message authentication code (HMAC) using the createHmac method from the built-in crypto module in Node.js. It uses the SHA-256 hashing algorithm and a secret key, which is formed by concatenating the salt and password strings with a forward slash separator. The SECRET constant is used as the message to be authenticated. The function returns the HMAC result. The purpose of this function is likely to provide a secure way to authenticate user passwords by using a combination of the password and a random salt to generate a unique key for each user.

20. Create in src folder 'controllers' and file authentication.ts. If it's not enough info about user or user exists then we return status 400. If it is new user with all information then we create new user in database using functions from helpers
21. Create authentication router. Create in src folder 'router' and file index.ts in it.
    const router = express.Router();
    export default (): express.Router => {
    return router;
    };
    -instance of a router is created from Express.js using the express.Router() method. Then the router instance is exported from the module as a function that returns the created router. This allows importing the router into other modules and adding routes to it.
22. Create a file authentication.ts in 'router'.
    export default (router: express.Router) => {
    router.post("/auth/register", register);
    };  
    -register function is defined as a route handler for user registration. The route "/auth/register" for this handler is added to the passed router using the router.post() method.
23. Adding app.use('/', router()); in index.ts in src.
    The call to router() returns an instance of a router, which is then passed to app.use() as a handler for routes that begin with the root path. Thus, any requests sent to the server at the root path will be handled by the router router.
24. Create login controller in authentication.ts in controllers. Here we create
    const user = await getUserByEmail(email).select(
    "+authentication.salt +authentication.password"
    );
    ! The purpose of adding .select('+authentication.salt +authentication.password') is to include these fields in the query result, even though they are not included by default due to their select: false setting in the UserSchema. This is useful if you need to compare the password entered by the user with the hashed password stored in the database.
    const salt = random(); - because we need to create new sessionToken for existing user (it gives more security)
    user.authentication.sessionToken = authentication(
    salt,
    user.\_id.toString()
    ); - \_id creates by MongoDB automatically during adding new user in database.
25. Adding in router/authentication.ts => router.post('/auth/login', login)
26. Create users routes. Create folder 'middlewares' in src and file index.ts in it.
27. npm i lodash
    npm i -D @types/lodash
28. Create users.ts in controllers folder. Make getAllUsers controller.
29. Create in folder router file users.ts, create additional router.get("/users", isAuthenticated, getAllUsers) and after that adding to router/index.ts - users(router). So we can deal with this GET-request. If user is noy authenticated then request will end with 'Forbidden' due to the middleware work.
30. Add controller for delete user operation in users.ts, after that add in router/users => router.delete("/users/:id", deleteUser);
31. Create another middleware isOwner - because only user should be allowed to delete himself, not every user has access to make such operation
