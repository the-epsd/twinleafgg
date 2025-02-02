import { Player, State, Action, Prompt } from '../game';
import { Client } from '../game/client/client.interface';
import { SimpleBotOptions } from './simple-bot-options';
export declare class SimpleTacticsAi {
    private client;
    private deck;
    private tactics;
    private resolvers;
    constructor(client: Client, options: SimpleBotOptions, deck: string[] | null);
    decodeNextAction(state: State): Action | undefined;
    private decodePlayerTurnAction;
    resolvePrompt(player: Player, state: State, prompt: Prompt<any>): Action;
    private isValidAction;
}
