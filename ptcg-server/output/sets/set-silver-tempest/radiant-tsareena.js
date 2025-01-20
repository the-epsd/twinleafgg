"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiantTsareena = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class RadiantTsareena extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.RADIANT];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Elegant Heal',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may heal 20 damage from each of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Aroma Shot',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'This Pokémon recovers from all Special Conditions.'
            }];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Radiant Tsareena';
        this.fullName = 'Radiant Tsareena SIT';
        this.ELEGANT_HEAL_MARKER = 'ELEGANT_HEAL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.ELEGANT_HEAL_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.ELEGANT_HEAL_MARKER, this);
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 20);
                state = store.reduceEffect(state, healEffect);
                return state;
            });
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                const player = effect.player;
                const removeSpecialCondition = new attack_effects_1.RemoveSpecialConditionsEffect(effect, undefined);
                removeSpecialCondition.target = player.active;
                state = store.reduceEffect(state, removeSpecialCondition);
                return state;
            }
        }
        return state;
    }
}
exports.RadiantTsareena = RadiantTsareena;
