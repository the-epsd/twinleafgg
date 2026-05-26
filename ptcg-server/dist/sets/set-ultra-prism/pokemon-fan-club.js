import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, Stage } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);
    let cards = [];
    if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    yield store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: SuperType.POKEMON, stage: Stage.BASIC }, { min: 0, max: 2, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
export class PokemonFanClub extends TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = TrainerType.SUPPORTER;
        this.set = 'UPR';
        this.name = 'Pokémon Fan Club';
        this.fullName = 'Pokémon Fan Club UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '133';
        this.text = 'Search your deck for up to 2 Basic Pokémon, reveal them, ' +
            'and put them into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
