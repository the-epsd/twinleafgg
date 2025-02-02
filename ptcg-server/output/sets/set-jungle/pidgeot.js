"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgeot = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Pidgeot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Pidgeotto';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.attacks = [{
                name: 'Wing Attack',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Hurricane',
                cost: [C, C, C],
                damage: 30,
                text: 'Unless this attack Knocks Out the Defending Pokémon, return the Defending Pokémon and all cards attached to it to your opponent\'s hand.'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Pidgeot';
        this.fullName = 'Pidgeot JU';
        this.BOUNCE_ACTIVE_MARKER = 'BOUNCE_ACTIVE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.BOUNCE_ACTIVE_MARKER, this);
        }
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.player.active.marker.hasMarker(this.BOUNCE_ACTIVE_MARKER, this)) {
            const player = effect.player;
            const cardList = effect.player.active;
            const pokemons = cardList.getPokemons();
            cardList.moveCardsTo(pokemons, player.hand);
            cardList.moveTo(player.hand);
            cardList.clearEffects();
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.BOUNCE_ACTIVE_MARKER, this)) {
            effect.player.active.marker.removeMarker(this.BOUNCE_ACTIVE_MARKER, this);
        }
        return state;
    }
}
exports.Pidgeot = Pidgeot;
