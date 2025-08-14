import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma.js";
import { auth } from "../middleware/auth.js";
import { allow } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";
import { hash } from "../utils/hash.js";

const router = Router();

const emailRule = z.string().email();
const passwordRule = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/)
  .regex(/[!@#$%^&*(),.?":{}|<>_\-\[\]\\\/]/);
const nameRule = z.string().min(20).max(60);
const addressRule = z.string().max(400).optional().or(z.literal(""));

const roleRule = z.enum(["ADMIN", "NORMAL_USER", "STORE_OWNER"]);

router.use(auth, allow("ADMIN"));

// Dashboard counts
router.get("/dashboard", async (_req, res) => {
  const [users, stores, ratings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  res.json({ users, stores, ratings });
});

// Create user (admin can add admins, store owners, or normal users)
router.post(
  "/users",
  validate(
    z.object({
      body: z.object({
        name: nameRule,
        email: emailRule,
        address: addressRule,
        password: passwordRule,
        role: roleRule,
      }),
    })
  ),
  async (req, res) => {
    const { name, email, address, password, role } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "Email already in use" });
    const passwordHash = await hash(password);
    const user = await prisma.user.create({
      data: { name, email, address: address || null, passwordHash, role },
    });
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }
);

// List users (filters + sorting + pagination)
router.get(
  "/users",
  validate(
    z.object({
      query: z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
        role: z.string().optional(),
        sortBy: z
          .enum(["name", "email", "address", "role", "createdAt"])
          .optional(),
        sortDir: z.enum(["asc", "desc"]).optional(),
        page: z.coerce.number().min(1).optional(),
        pageSize: z.coerce.number().min(1).max(100).optional(),
      }),
    })
  ),
  async (req, res) => {
    const {
      name,
      email,
      address,
      role,
      sortBy = "createdAt",
      sortDir = "desc",
      page = 1,
      pageSize = 10,
    } = req.query;

    const where = {
      ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
      ...(email ? { email: { contains: email, mode: "insensitive" } } : {}),
      ...(address
        ? { address: { contains: address, mode: "insensitive" } }
        : {}),
      ...(role ? { role } : {}),
    };

    const [total, data] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { [sortBy]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          role: true,
        },
      }),
    ]);

    res.json({ total, page, pageSize, data });
  }
);

// Get user details (store-owner includes rating summary of owned stores)
router.get("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      stores: { select: { id: true, name: true, averageRating: true } },
    },
  });
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json(user);
});

// Create store
router.post(
  "/stores",
  validate(
    z.object({
      body: z.object({
        name: z.string().min(1).max(60),
        address: z.string().max(400).optional().or(z.literal("")),
        ownerId: z.number().int().optional(),
      }),
    })
  ),
  async (req, res) => {
    const { name, address, ownerId } = req.body;

    if (ownerId) {
      const owner = await prisma.user.findUnique({ where: { id: ownerId } });
      if (!owner || owner.role !== "STORE_OWNER") {
        return res
          .status(400)
          .json({ message: "ownerId must be a valid STORE_OWNER" });
      }
    }
    const store = await prisma.store.create({
      data: { name, address: address || null, ownerId: ownerId || null },
    });
    res.status(201).json(store);
  }
);

// List stores (Admin view)
router.get(
  "/stores",
  validate(
    z.object({
      query: z.object({
        name: z.string().optional(),
        email: z.string().optional(), // not used; kept for spec parity
        address: z.string().optional(),
        sortBy: z.enum(["name", "averageRating", "createdAt"]).optional(),
        sortDir: z.enum(["asc", "desc"]).optional(),
        page: z.coerce.number().min(1).optional(),
        pageSize: z.coerce.number().min(1).max(100).optional(),
      }),
    })
  ),
  async (req, res) => {
    const {
      name,
      address,
      sortBy = "createdAt",
      sortDir = "desc",
      page = 1,
      pageSize = 10,
    } = req.query;
    const where = {
      ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
      ...(address
        ? { address: { contains: address, mode: "insensitive" } }
        : {}),
    };
    const [total, data] = await Promise.all([
      prisma.store.count({ where }),
      prisma.store.findMany({
        where,
        orderBy: { [sortBy]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, name: true, address: true, averageRating: true },
      }),
    ]);
    res.json({ total, page, pageSize, data });
  }
);

export default router;
