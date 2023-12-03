"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianBasculin = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class HisuianBasculin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Gather the Crew',
                cost: [],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
            }
        ];
        this.set = 'ASR';
        this.set2 = 'astralradiance';
        this.setNumber = '43';
        this.name = 'Hisuian Basculin';
        this.fullName = 'Hisuian Basculin ASR';
        // public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
        //   if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        //     const player = effect.player;
        //     const slots = player.bench.filter(b => b.cards.length === 0);
        //     return store.prompt(state, new ChooseCardsPrompt(
        //       player.id,
        //       GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        //       player.deck,
        //       { superType: SuperType.POKEMON, stage: Stage.BASIC },
        //       { min: 0, max: slots.length < 2 ? slots.length : 2, allowCancel: true }
        //     ), selected => {
        //       const cards = selected || [];
        //       cards.forEach((card, index) => {
        //         player.deck.moveCardTo(card, slots[index]);
        //         slots[index].pokemonPlayedTurn = state.turn;
        //       });
        //     }); 
        //   }
        //   return state;
        // }
    }
}
exports.HisuianBasculin = HisuianBasculin;
