import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, SlotType, CoinFlipPrompt, StateUtils, GameError, GameMessage } from '../../game';
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);
    const hasBench = opponent.bench.some(b => b.cards.length > 0);
    if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let coinResult = false;
    yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        coinResult = result;
        next();
    });
    if (coinResult === false) {
        return state;
    }
    yield store.prompt(state, new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH, PlayerType.TOP_PLAYER, [SlotType.BENCH], { allowCancel: false }), result => {
        const cardList = result[0];
        opponent.switchPokemon(cardList);
    });
}
export class PokemonCatcher extends TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = TrainerType.ITEM;
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '187';
        this.name = 'Pokémon Catcher';
        this.fullName = 'Pokemon Catcher SVI';
        this.text = 'Flip a coin. If heads, switch 1 of your opponent\'s Benched Pokemon ' +
            'with their Active Pokemon.';
    }
    canPlay(store, state, player) {
        const opponent = StateUtils.getOpponent(state, player);
        const hasBench = opponent.bench.some(b => b.cards.length > 0);
        if (!hasBench) {
            return false;
        }
        return true;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
