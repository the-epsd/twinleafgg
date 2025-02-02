import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { DamageMap } from './move-damage-prompt';
export declare const PutDamagePromptType = "Put damage";
export interface PutDamageOptions {
    allowCancel: boolean;
    blocked: CardTarget[];
    allowPlacePartialDamage?: boolean | undefined;
    damageMultiple?: number;
}
export declare class PutDamagePrompt extends Prompt<DamageMap[]> {
    message: GameMessage;
    playerType: PlayerType;
    slots: SlotType[];
    damage: number;
    maxAllowedDamage: DamageMap[];
    readonly type: string;
    options: PutDamageOptions;
    constructor(playerId: number, message: GameMessage, playerType: PlayerType, slots: SlotType[], damage: number, maxAllowedDamage: DamageMap[], options?: Partial<PutDamageOptions>);
    decode(result: DamageMap[] | null, state: State): DamageMap[] | null;
    validate(result: DamageMap[] | null, state: State): boolean;
}
