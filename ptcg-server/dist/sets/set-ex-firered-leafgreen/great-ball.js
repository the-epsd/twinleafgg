import { PokemonCard } from '../../game';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, TrainerType, CardTag } from '../../game/store/card/card-types';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
export class GreatBall extends TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = TrainerType.ITEM;
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Great Ball';
        this.fullName = 'Great Ball RG';
        this.text = 'Search your deck for a Basic Pokémon (excluding Pokémon-ex) and put it onto your Bench. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (c instanceof PokemonCard && c.tags.includes(CardTag.POKEMON_ex)) {
                    blocked.push(index);
                }
            });
            SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, { stage: Stage.BASIC }, { min: 0, max: 1, blocked });
            return state;
        }
        return state;
    }
}
