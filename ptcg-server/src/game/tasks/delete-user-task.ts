import { Transaction, TransactionManager, EntityManager } from 'typeorm';

import { Match, User, Deck, Replay, Conversation } from '../../storage';

export class DeleteUserTask {

  constructor() { }

  @Transaction()
  private async deleteUserFromDb(userId: number, @TransactionManager() manager?: EntityManager): Promise<void> {
    if (manager === undefined) {
      return;
    }
    // decks
    await manager.delete(Deck, { user: { id: userId } });
    // replays
    await manager.delete(Replay, { user: { id: userId } });
    // conversations
    await manager.delete(Conversation, { user1: { id: userId } });
    await manager.delete(Conversation, { user2: { id: userId } });
    // matches
    await manager.delete(Match, { player1: { id: userId } });
    await manager.delete(Match, { player2: { id: userId } });

    // user
    await manager.delete(User, { id: userId });
  }

  public async deleteUser(userId: number) {
    try {
      await this.deleteUserFromDb(userId);
    } catch (error) {
      // continue regardless of error
    }
  }

}
