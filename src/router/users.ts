import express from "express";

import { deleteUser, updateUser, getAllUsers } from "../controllers/users";
import { isOwner, isAuthenticated } from "../middlewares";

/*The function adds a route to the router using the get method. The route is /users, and it is associated with the getAllUsers function, which is presumably defined elsewhere. This means that when a client sends an HTTP GET request to the /users route, the getAllUsers function will be called to handle the request.*/

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  router.patch("/users/:id", isAuthenticated, isOwner, updateUser);
};
