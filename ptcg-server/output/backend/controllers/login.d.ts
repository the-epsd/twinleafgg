import { Request, Response, NextFunction } from 'express';
import { Controller } from './controller';
export declare class Login extends Controller {
    private rateLimit;
    onRegister(req: Request, res: Response, next: NextFunction): Promise<void>;
    onLogin(req: Request, res: Response): Promise<void>;
    onRefreshToken(req: Request, res: Response): Promise<void>;
    onLogout(req: Request, res: Response): void;
    onInfo(req: Request, res: Response): void;
    private getServerConfig;
}
