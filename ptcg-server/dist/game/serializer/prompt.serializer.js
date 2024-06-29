import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
import { AlertPrompt } from '../store/prompts/alert-prompt';
import { AttachEnergyPrompt } from '../store/prompts/attach-energy-prompt';
import { ChooseAttackPrompt } from '../store/prompts/choose-attack-prompt';
import { ChooseCardsPrompt } from '../store/prompts/choose-cards-prompt';
import { ChooseEnergyPrompt } from '../store/prompts/choose-energy-prompt';
import { ChoosePokemonPrompt } from '../store/prompts/choose-pokemon-prompt';
import { ChoosePrizePrompt } from '../store/prompts/choose-prize-prompt';
import { CoinFlipPrompt } from '../store/prompts/coin-flip-prompt';
import { ConfirmPrompt } from '../store/prompts/confirm-prompt';
import { InvitePlayerPrompt } from '../store/prompts/invite-player-prompt';
import { MoveDamagePrompt } from '../store/prompts/move-damage-prompt';
import { MoveEnergyPrompt } from '../store/prompts/move-energy-prompt';
import { OrderCardsPrompt } from '../store/prompts/order-cards-prompt';
import { PutDamagePrompt } from '../store/prompts/put-damage-prompt';
import { SelectPrompt } from '../store/prompts/select-prompt';
import { ShowCardsPrompt } from '../store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../store/prompts/shuffle-prompt';
import { ShuffleHandPrompt } from '../store/prompts/shuffle-hand-prompt';
import { RemoveDamagePrompt } from '../store/prompts/remove-damage-prompt';
import { DiscardEnergyPrompt } from '../store/prompts/discard-energy-prompt';
import { ConfirmCardsPrompt } from '../store/prompts/confirm-cards-prompt';
export class PromptSerializer {
    constructor() {
        this.rows = [
            { classValue: AlertPrompt, type: 'AlertPrompt' },
            { classValue: AttachEnergyPrompt, type: 'AttachEnergyPrompt' },
            { classValue: ChooseAttackPrompt, type: 'ChooseAttackPrompt' },
            { classValue: ChooseCardsPrompt, type: 'ChooseCardsPrompt' },
            { classValue: ChooseEnergyPrompt, type: 'ChooseEnergyPrompt' },
            { classValue: ChoosePokemonPrompt, type: 'ChoosePokemonPrompt' },
            { classValue: ChoosePrizePrompt, type: 'ChoosePrizePrompt' },
            { classValue: CoinFlipPrompt, type: 'CoinFlipPrompt' },
            { classValue: ConfirmPrompt, type: 'ConfirmPrompt' },
            { classValue: InvitePlayerPrompt, type: 'InvitePlayerPrompt' },
            { classValue: MoveDamagePrompt, type: 'MoveDamagePrompt' },
            { classValue: MoveEnergyPrompt, type: 'MoveEnergyPrompt' },
            { classValue: OrderCardsPrompt, type: 'OrderCardsPrompt' },
            { classValue: PutDamagePrompt, type: 'PutDamagePrompt' },
            { classValue: SelectPrompt, type: 'SelectPrompt' },
            { classValue: ShowCardsPrompt, type: 'ShowCardsPrompt' },
            { classValue: ShuffleDeckPrompt, type: 'ShuffleDeckPrompt' },
            { classValue: ShuffleHandPrompt, type: 'ShuffleHandPrompt' },
            { classValue: RemoveDamagePrompt, type: 'RemoveDamagePrompt' },
            { classValue: DiscardEnergyPrompt, type: 'DiscardEnergyPrompt' },
            { classValue: ConfirmCardsPrompt, type: 'ConfirmCardsPrompt' },
        ];
        this.types = this.rows.map(p => p.type);
        this.classes = this.rows.map(p => p.classValue);
    }
    serialize(prompt) {
        const data = Object.assign({}, prompt);
        const row = this.rows.find(r => prompt instanceof r.classValue);
        if (row === undefined) {
            throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown prompt type '${prompt.type}'.`);
        }
        return Object.assign(Object.assign({}, data), { _type: row.type });
    }
    deserialize(data, context) {
        const row = this.rows.find(p => p.type === data._type);
        if (row === undefined) {
            throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown prompt type '${data._type}'.`);
        }
        const prompt = Object.create(row.classValue.prototype);
        delete data._type;
        return Object.assign(prompt, data);
    }
}
