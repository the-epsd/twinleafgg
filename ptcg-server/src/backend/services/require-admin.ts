import { Request, Response } from 'express';
import { User } from '../../storage';
import { ApiErrorEnum } from '../common/errors';

export const ADMIN_ROLE_ID = 4;

export async function requireAdmin(req: Request, res: Response): Promise<User | null> {
  const userId: number = req.body.userId;
  const user = await User.findOne(userId);
  if (!user || user.roleId !== ADMIN_ROLE_ID) {
    res.status(403);
    res.send({ error: ApiErrorEnum.AUTH_INVALID_PERMISSIONS });
    return null;
  }
  return user;
}
