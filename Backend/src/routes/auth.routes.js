import { Router } from "express";
import { z } from "zod";
import prisma from "../config/prisma.js";
import { hash, compareHash } from "../utils/hash.js";
import { signJWT } from "../utils/jwt.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const passwordRule = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(
    /[!@#$%^&*(),.?":{}|<>_\-\[\]\\\/]/,
    "Must include at least one special character"
  );

const emailRule = z.string().email();

const nameRule = z.string().min(20).max(60);
const addressRule = z.string().max(400).optional().or(z.literal(""));

router.post(
  "/signup",
  validate(
    z.object({
      body: z.object({
        name: nameRule,
        email: emailRule,
        address: addressRule,
        password: passwordRule,
      }),
    })
  ),
  async (req, res) => {
    const { name, email, address, password } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await hash(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        address: address || null,
        passwordHash,
        role: "NORMAL_USER",
      },
    });
    const token = signJWT({ id: user.id, role: user.role });
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

router.post(
  "/login",
  validate(
    z.object({
      body: z.object({
        email: emailRule,
        password: z.string().min(1),
      }),
    })
  ),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await compareHash(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = signJWT({ id: user.id, role: user.role });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

router.post(
  "/change-password",
  auth,
  validate(
    z.object({
      body: z.object({
        oldPassword: z.string().min(1),
        newPassword: passwordRule,
      }),
    })
  ),
  async (req, res) => {
    const me = await prisma.user.findUnique({ where: { id: req.user.id } });
    const ok = await compareHash(req.body.oldPassword, me.passwordHash);
    if (!ok) return res.status(400).json({ message: "Old password incorrect" });

    const newHash = await hash(req.body.newPassword);
    await prisma.user.update({
      where: { id: me.id },
      data: { passwordHash: newHash },
    });
    res.json({ message: "Password updated" });
  }
);

export default router;
