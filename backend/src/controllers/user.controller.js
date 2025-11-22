import { userService } from "../services/user.service.js";
import { listingLikeService } from "../services/listingLike.service.js";

export async function getUsers(req, res) {
  const users = await userService.getAll();
  res.json(users);
}

export async function createUser(req, res) {
  const { telegramId, name, username } = req.body;
  const user = await userService.create({ telegramId, name, username });
  res.json(user);
}

// GET /users/:id/likes  -> saved listings for this user
export async function getLikedListings(req, res) {
  try {
    const userId = Number(req.params.id);
    const listings = await listingLikeService.getUserLikedListings(userId);
    return res.json(listings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch liked listings" });
  }
}
