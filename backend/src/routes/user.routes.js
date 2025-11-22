import { Router } from "express";
import { getUsers, createUser, getLikedListings } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);            // GET /users
router.post("/", createUser);         // POST /users
router.get("/:id/likes", getLikedListings); // GET /users/:id/likes

export default router;
