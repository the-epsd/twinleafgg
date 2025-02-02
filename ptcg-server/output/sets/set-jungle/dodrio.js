"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dodrio = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Dodrio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Doduo';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Retreat Aid',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'As long as Dodrio is Benched, pay C less to retreat your Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Rage',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Does 10 damage plus 10 more damage for each damage counter on Dodrio.',
            }
        ];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Dodrio';
        this.fullName = 'Dodrio JU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            let isDodrioInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isDodrioInPlay = true;
                }
            });
            if (!isDodrioInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEMON_POWER,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index !== -1) {
                    effect.cost.splice(index, 1);
                }
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage += effect.player.active.damage;
            return state;
        }
        return state;
    }
}
exports.Dodrio = Dodrio;
