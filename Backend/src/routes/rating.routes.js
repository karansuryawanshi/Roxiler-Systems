import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma.js";
import { auth } from "../middleware/auth.js";
import { allow } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// submit rating
router.post(
  "/:storeId",
  auth,
  allow("NORMAL_USER"),
  validate(
    z.object({
      params: z.object({ storeId: z.coerce.number().int().positive() }),
      body: z.object({ value: z.coerce.number().int().min(1).max(5) }),
    })
  ),
  async (req, res) => {
    const { storeId } = req.params;
    const { value } = req.body;

    // upsert (insert if not exists)
    const rating = await prisma.rating.upsert({
      where: { userId_storeId: { userId: req.user.id, storeId } },
      create: { userId: req.user.id, storeId, value },
      update: { value },
    });

    // recalc average rating
    const agg = await prisma.rating.aggregate({
      where: { storeId },
      _avg: { value: true },
    });
    await prisma.store.update({
      where: { id: storeId },
      data: { averageRating: Number(agg._avg.value?.toFixed(2) || 0) },
    });

    res.status(201).json({ message: "Rating submitted", rating });
  }
);

// modify rating explicitly (alias to upsert)
router.put(
  "/:storeId",
  auth,
  allow("NORMAL_USER"),
  validate(
    z.object({
      params: z.object({ storeId: z.coerce.number().int().positive() }),
      body: z.object({ value: z.coerce.number().int().min(1).max(5) }),
    })
  ),
  async (req, res) => {
    const { storeId } = req.params;
    const { value } = req.body;

    const existing = await prisma.rating.findUnique({
      where: { userId_storeId: { userId: req.user.id, storeId } },
    });
    if (!existing)
      return res.status(404).json({ message: "No existing rating to modify" });

    const updated = await prisma.rating.update({
      where: { userId_storeId: { userId: req.user.id, storeId } },
      data: { value },
    });

    const agg = await prisma.rating.aggregate({
      where: { storeId },
      _avg: { value: true },
    });
    await prisma.store.update({
      where: { id: storeId },
      data: { averageRating: Number(agg._avg.value?.toFixed(2) || 0) },
    });

    res.json({ message: "Rating updated", rating: updated });
  }
);

export default router;
