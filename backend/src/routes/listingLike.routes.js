// src/routes/listingLike.routes.js

import { Router } from "express";
import { listingLikeController } from "../controllers/listingLike.controller.js";

const router = Router();

// like/unlike listing
router.post("/:id/like", listingLikeController.like);
router.delete("/:id/like", listingLikeController.unlike);

// who liked this listing
router.get("/:id/likes", listingLikeController.getListingLikes);

export default router;
