import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, CardTag } from '../../game/store/card/card-types';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);
    let cards = [];
    if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    yield store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.deck.moveCardsTo(cards, player.hand);
    return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
export class MasterBall extends TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.tags = [CardTag.ACE_SPEC];
        this.trainerType = TrainerType.ITEM;
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '153';
        this.name = 'Master Ball';
        this.fullName = 'Master Ball TEF';
        this.text = 'Search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
