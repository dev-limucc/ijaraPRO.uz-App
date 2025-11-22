import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import listingLikeRoutes from "./routes/listingLike.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// main routers
app.use("/users", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings", listingLikeRoutes);

export default app;
