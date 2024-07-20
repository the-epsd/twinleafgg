import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { DamageMap } from './move-damage-prompt';
export declare const RemoveDamagePromptType = "Remove damage";
export interface RemoveDamageOptions {
    allowCancel: boolean;
    blocked: CardTarget[];
    allowPlacePartialDamage?: boolean | undefined;
}
export declare class RemoveDamagePrompt extends Prompt<DamageMap[]> {
    message: GameMessage;
    playerType: PlayerType;
    slots: SlotType[];
    damage: number;
    maxAllowedDamage: DamageMap[];
    readonly type: string;
    options: RemoveDamageOptions;
    constructor(playerId: number, message: GameMessage, playerType: PlayerType, slots: SlotType[], damage: number, maxAllowedDamage: DamageMap[], options?: Partial<RemoveDamageOptions>);
    decode(result: DamageMap[] | null, state: State): DamageMap[] | null;
    validate(result: DamageMap[] | null, state: State): boolean;
}
