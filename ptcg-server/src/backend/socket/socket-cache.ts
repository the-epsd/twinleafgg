import { CoreInfo, GameInfo } from '../interfaces';

export class SocketCache {
  public gameInfoCache: { [key: string]: GameInfo } = {};
  public lastLogIdCache: { [key: string]: number } = {};
  public lastUserUpdate: number = 0;
  public coreInfo: CoreInfo | null = null;
  public coreInfoTimestamp: number = 0;
}
