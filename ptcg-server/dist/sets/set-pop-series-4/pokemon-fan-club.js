import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, Stage } from '../../game/store/card/card-types';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';
export class PokemonFanClub extends TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = TrainerType.SUPPORTER;
        this.set = 'P4';
        this.name = 'Pokémon Fan Club';
        this.fullName = 'Pokémon Fan Club P4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.text = 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            if (player.deck.cards.length === 0) {
                throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (player.supporterTurn > 0) {
                throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, { superType: SuperType.POKEMON, stage: Stage.BASIC }, { min: 0, max: 2 });
            player.supporter.moveCardTo(this, player.discard);
        }
        return state;
    }
}
