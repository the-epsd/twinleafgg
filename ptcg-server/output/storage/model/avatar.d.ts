import { BaseEntity } from 'typeorm';
import { User } from './user';
export declare class Avatar extends BaseEntity {
    id: number;
    user: User;
    name: string;
    fileName: string;
}
