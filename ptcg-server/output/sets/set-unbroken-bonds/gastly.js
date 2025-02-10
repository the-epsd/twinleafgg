"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gastly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gastly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 40;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Swelling Spite',
                powerType: game_1.PowerType.ABILITY,
                text: 'When this Pokémon is Knocked Out, search your deck for up to 2 Haunter and put them onto your Bench. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Will-O-Wisp',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Gastly';
        this.fullName = 'Gastly UNB';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            // i love checking for ability lock woooo
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0 || openSlots.length === 0) {
                return state;
            }
            store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, card: this.name });
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    const maxPokemons = Math.min(openSlots.length, 2);
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, name: 'Haunter' }, { min: 0, max: Math.min(2, maxPokemons), allowCancel: false }), selectedCards => {
                        const cards = selectedCards || [];
                        cards.forEach((card, index) => {
                            player.deck.moveCardTo(card, openSlots[index]);
                            openSlots[index].pokemonPlayedTurn = state.turn;
                        });
                        prefabs_1.SHUFFLE_DECK(store, state, player);
                    });
                }
            });
        }
        return state;
    }
}
exports.Gastly = Gastly;
