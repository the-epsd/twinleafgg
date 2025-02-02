import { Request, Response } from 'express';
import { Controller } from './controller';
import { EntityManager } from 'typeorm';
export declare class Avatars extends Controller {
    onList(req: Request, res: Response): Promise<void>;
    onGet(req: Request, res: Response): Promise<void>;
    onFind(req: Request, res: Response): Promise<void>;
    onAdd(req: Request, res: Response, manager: EntityManager): Promise<void>;
    onDelete(req: Request, res: Response, manager: EntityManager): Promise<void>;
    onRename(req: Request, res: Response): Promise<void>;
    onMarkAsDefault(req: Request, res: Response): Promise<void>;
    private removeAvatarFile;
    private createAvatarFile;
}
