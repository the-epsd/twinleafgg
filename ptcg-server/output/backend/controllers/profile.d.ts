import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Profile extends Controller {
    onMe(req: Request, res: Response): Promise<void>;
    onGet(req: Request, res: Response): Promise<void>;
    onMatchHistory(req: Request, res: Response): Promise<void>;
    onChangePassword(req: Request, res: Response): Promise<void>;
    onChangeEmail(req: Request, res: Response): Promise<void>;
}
