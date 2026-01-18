import 'reflect-metadata';
import { Connection, createConnection, EntityManager } from 'typeorm';
import {
  Avatar, Conversation, Deck, DisconnectedSession, Match, Message, Replay, User,
  BattlePassSeason, UserBattlePass, UserUnlockedItem,
  Friend, FriendRequest, CardArtwork, UserFavoriteCard, Sleeve
} from './';

export class Storage {

  private connection: null | Connection = null;

  constructor() { }

  public async connect(): Promise<void> {
    const storageConfig: any = {
      type: process.env.STORAGE_TYPE,
      host: process.env.STORAGE_HOST,
      port: process.env.STORAGE_PORT,
      username: process.env.STORAGE_USERNAME,
      password: process.env.STORAGE_DATABASE_PASSWORD,
      database: process.env.STORAGE_DATABASE
    };

    this.connection = await createConnection({
      ...storageConfig,
      timezone: 'Z',
      entities: [
        Avatar,
        Conversation,
        Deck,
        DisconnectedSession,
        Friend,
        FriendRequest,
        Match,
        Message,
        Replay,
        User,
        BattlePassSeason,
        UserBattlePass,
        UserUnlockedItem,
        CardArtwork,
        UserFavoriteCard,
        Sleeve
      ],
      synchronize: true,
      logging: false
    });
  }

  public async disconnect(): Promise<void> {
    if (this.connection === null) {
      return;
    }
    return this.connection.close();
  }

  public get manager(): EntityManager {
    if (this.connection === null) {
      throw new Error('Not connected to the database.');
    }
    return this.connection.manager;
  }

  public async checkConnection(): Promise<boolean> {
    if (this.connection === null) {
      return false;
    }
    try {
      await this.connection.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

}
