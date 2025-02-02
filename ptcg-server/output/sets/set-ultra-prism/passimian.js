"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassimianUPR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class PassimianUPR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Power Huddle',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is on your Bench, your Passimian\'s attacks do 30 more damage to your opponent\'s Active Evolution Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Rock Hurl',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }];
        this.set = 'UPR';
        this.setNumber = '70';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Passimian';
        this.fullName = 'Passimian UPR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // checking if this pokemon is in the active
            if (player.active.getPokemonCard() === this) {
                return state;
            }
            // checking if this pokemon is in play
            let isThisInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            // somehow make this so it only affects the active passimian and not the opponent's pokemon
            const oppActive = opponent.active.getPokemonCard();
            const damageSource = effect.source.getPokemonCard();
            const stage = oppActive !== undefined ? oppActive.stage : undefined;
            if (damageSource && damageSource.name === 'Passimian' && (stage === card_types_1.Stage.STAGE_1 || stage === card_types_1.Stage.STAGE_2) && damageSource !== oppActive) {
                effect.damage += 30;
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.PassimianUPR = PassimianUPR;
