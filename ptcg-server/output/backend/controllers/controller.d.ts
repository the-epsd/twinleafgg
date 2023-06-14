import { Application } from 'express';
import { Core } from '../../game/core/core';
import { Storage, User } from '../../storage';
import { UserInfo } from '../interfaces/core.interface';
export interface ControllerClass {
    new (path: string, app: Application, db: Storage, core: Core): Controller;
}
export declare abstract class Controller {
    protected path: string;
    protected app: Application;
    protected db: Storage;
    protected core: Core;
    constructor(path: string, app: Application, db: Storage, core: Core);
    init(): void;
    protected buildUserInfo(user: User): UserInfo;
    protected escapeLikeString(raw: string, escapeChar?: string): string;
}
export declare function Get(path: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Post(path: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
