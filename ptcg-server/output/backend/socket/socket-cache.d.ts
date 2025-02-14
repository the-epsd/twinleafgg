import { CoreInfo, GameInfo } from '../interfaces';
export declare class SocketCache {
    gameInfoCache: {
        [key: string]: GameInfo;
    };
    lastLogIdCache: {
        [key: string]: number;
    };
    lastUserUpdate: number;
    coreInfo: CoreInfo | null;
    coreInfoTimestamp: number;
}
