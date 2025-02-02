import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { DamageMap, DamageTransfer } from './move-damage-prompt';
export declare const RemoveDamagePromptType = "Remove damage";
export declare type RemoveDamageResultType = DamageTransfer[];
export interface RemoveDamageOptions {
    allowCancel: boolean;
    min: number;
    max: number | undefined;
    blockedFrom: CardTarget[];
    blockedTo: CardTarget[];
    sameTarget: boolean;
}
export declare class RemoveDamagePrompt extends Prompt<DamageTransfer[]> {
    message: GameMessage;
    playerType: PlayerType;
    slots: SlotType[];
    maxAllowedDamage: DamageMap[];
    readonly type: string;
    options: RemoveDamageOptions;
    constructor(playerId: number, message: GameMessage, playerType: PlayerType, slots: SlotType[], maxAllowedDamage: DamageMap[], options?: Partial<RemoveDamageOptions>);
    decode(result: RemoveDamageResultType | null, state: State): DamageTransfer[] | null;
    validate(result: DamageTransfer[] | null, state: State): boolean;
}
