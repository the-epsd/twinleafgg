import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Replays extends Controller {
    onList(req: Request, res: Response): Promise<void>;
    onFind(req: Request, res: Response): Promise<void>;
    onMatchGet(req: Request, res: Response): Promise<void>;
    onGet(req: Request, res: Response): Promise<void>;
    onSave(req: Request, res: Response): Promise<void>;
    onDelete(req: Request, res: Response): Promise<void>;
    onRename(req: Request, res: Response): Promise<void>;
    onImport(req: Request, res: Response): Promise<void>;
    private syncReplayPlayer;
    private buildUserMap;
    private buildReplayInfo;
}
