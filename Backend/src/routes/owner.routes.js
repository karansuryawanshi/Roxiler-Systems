import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma.js";
import { auth } from "../middleware/auth.js";
import { allow } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(auth, allow("STORE_OWNER"));

// list owner stores
router.get("/stores", async (req, res) => {
  const stores = await prisma.store.findMany({
    where: { ownerId: req.user.id },
    select: { id: true, name: true, averageRating: true },
  });
  res.json(stores);
});

// list ratings for a store (owned by owner)
router.get(
  "/stores/:id/ratings",
  validate(
    z.object({ params: z.object({ id: z.coerce.number().int().positive() }) })
  ),
  async (req, res) => {
    const id = req.params.id;
    const store = await prisma.store.findUnique({ where: { id } });
    if (!store || store.ownerId !== req.user.id)
      return res.status(404).json({ message: "Not found" });

    const ratings = await prisma.rating.findMany({
      where: { storeId: id },
      select: {
        id: true,
        value: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ averageRating: store.averageRating, ratings });
  }
);

export default router;
