import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class ResetPassword extends Controller {
    private rateLimit;
    private mailer;
    private tokens;
    onSendMail(req: Request, res: Response): Promise<void>;
    onChangePassword(req: Request, res: Response): Promise<void>;
    private generateToken;
    private validateToken;
}
