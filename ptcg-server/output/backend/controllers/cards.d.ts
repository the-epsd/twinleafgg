import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Cards extends Controller {
    onAll(req: Request, res: Response): Promise<void>;
}
