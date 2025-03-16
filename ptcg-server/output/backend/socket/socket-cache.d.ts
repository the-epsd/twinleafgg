import { GameInfo } from '../interfaces';
export declare class SocketCache {
    gameInfoCache: {
        [id: number]: GameInfo;
    };
    lastLogIdCache: {
        [id: number]: number;
    };
}
