import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
export declare const MoveDamagePromptType = "Move damage";
export declare type MoveDamageResultType = DamageTransfer[];
export interface DamageTransfer {
    from: CardTarget;
    to: CardTarget;
}
export interface DamageMap {
    target: CardTarget;
    damage: number;
}
export interface MoveDamageOptions {
    allowCancel: boolean;
    min: number;
    max: number | undefined;
    blockedFrom: CardTarget[];
    blockedTo: CardTarget[];
    singleSourceTarget: boolean;
    singleDestinationTarget: boolean;
}
export declare class MoveDamagePrompt extends Prompt<DamageTransfer[]> {
    message: GameMessage;
    playerType: PlayerType;
    slots: SlotType[];
    maxAllowedDamage: DamageMap[];
    readonly type: string;
    options: MoveDamageOptions;
    constructor(playerId: number, message: GameMessage, playerType: PlayerType, slots: SlotType[], maxAllowedDamage: DamageMap[], options?: Partial<MoveDamageOptions>);
    decode(result: MoveDamageResultType | null, state: State): DamageTransfer[] | null;
    validate(result: DamageTransfer[] | null, state: State): boolean;
}
