import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get(
  "/",
  auth, // require login (as per spec: single login system)
  validate(
    z.object({
      query: z.object({
        q: z.string().optional(), // search name or address
        sortBy: z.enum(["name", "averageRating", "createdAt"]).optional(),
        sortDir: z.enum(["asc", "desc"]).optional(),
        page: z.coerce.number().min(1).optional(),
        pageSize: z.coerce.number().min(1).max(100).optional(),
      }),
    })
  ),
  async (req, res) => {
    const {
      q,
      sortBy = "createdAt",
      sortDir = "desc",
      page = 1,
      pageSize = 10,
    } = req.query;

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { address: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const [total, stores] = await Promise.all([
      prisma.store.count({ where }),
      prisma.store.findMany({
        where,
        orderBy: { [sortBy]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          address: true,
          averageRating: true,
          ratings: { where: { userId: req.user.id }, select: { value: true } },
        },
      }),
    ]);

    const data = stores.map((s) => ({
      id: s.id,
      name: s.name,
      address: s.address,
      overallRating: s.averageRating,
      userRating: s.ratings[0]?.value ?? null,
    }));

    res.json({ total, page, pageSize, data });
  }
);

export default router;
