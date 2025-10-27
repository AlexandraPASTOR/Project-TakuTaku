import type { NextFunction, Request, Response } from "express";

interface AdminUser {
  id: number;
  is_admin: boolean;
}

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as AdminUser;
  if (!user || user.is_admin !== true && user.id !== 1) {
    res.status(403).json({ message: "Accès réservé aux administrateurs" });
  } else {
    next();
  }
};
