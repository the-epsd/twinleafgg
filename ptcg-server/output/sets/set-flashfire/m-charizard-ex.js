"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCharizardEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class MCharizardEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.MEGA;
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.MEGA];
        this.evolvesFrom = 'Charizard EX';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Wild Blaze',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 300,
                text: 'Discard the top 5 cards of your deck.'
            }
        ];
        this.set = 'FLF';
        this.name = 'M Charizard EX';
        this.fullName = 'M Charizard EX FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof game_effects_1.EvolveEffect) && effect.pokemonCard === this) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && cardList.tool && cardList.tool.name === 'Charizard Spirit Link') {
                    return state;
                }
                else {
                    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                    store.reduceEffect(state, endTurnEffect);
                    return state;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard 2 cards from opponent's deck 
            opponent.deck.moveTo(opponent.discard, 5);
        }
        return state;
    }
}
exports.MCharizardEX = MCharizardEX;
