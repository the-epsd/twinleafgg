"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianPerrserker = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class GalarianPerrserker extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Galarian Meowth';
        this.powers = [{
                name: 'Steely Spirit',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your [M] Pokémon\'s attacks do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Metal Claw',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }];
        this.set = 'SSH';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '128';
        this.name = 'Galarian Perrserker';
        this.fullName = 'Galarian Perrserker SSH';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const hasPerrserkerInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
            let numberOfPerrserkersInPlay = 0;
            if (hasPerrserkerInPlay) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList.cards.includes(this)) {
                        numberOfPerrserkersInPlay++;
                    }
                });
            }
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.METAL) && effect.target === opponent.active) {
                effect.damage += 20 * numberOfPerrserkersInPlay;
            }
        }
        return state;
    }
}
exports.GalarianPerrserker = GalarianPerrserker;
