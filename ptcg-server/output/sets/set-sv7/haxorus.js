"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haxorus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Haxorus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Fraxure';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 170;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Axe Down',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 0,
                text: 'If your opponent\'s Active Pokémon has any Special Energy attached, it is Knocked Out.'
            },
            {
                name: 'Dragon Pulse',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL],
                damage: 230,
                text: 'Discard the top 3 cards of your deck'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SV6a';
        this.name = 'Haxorus';
        this.fullName = 'Haxorus SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const pokemon = opponent.active;
            let specialEnergyCount = 0;
            pokemon.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard) {
                    if (c.energyType === card_types_1.EnergyType.SPECIAL) {
                        specialEnergyCount++;
                    }
                }
            });
            if (specialEnergyCount > 0) {
                if (pokemon) {
                    const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, opponent.active);
                    dealDamage.target = opponent.active;
                    store.reduceEffect(state, dealDamage);
                }
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            player.deck.moveTo(player.discard, 3);
        }
        return state;
    }
}
exports.Haxorus = Haxorus;
