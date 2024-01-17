"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegielekiVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
// import mappings from '../../sets/card-mappings.json';
class RegielekiVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Regieleki V';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Transistor',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your Basic [L] Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Max Thunder and Lightning',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 220,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Regieleki VMAX';
        this.fullName = 'Regieleki VMAX SIT';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        // const changes: any = mappings[this.setNumber];
        // if(changes) {
        //   this.set2 = changes.set2;
        //   this.name = changes.name;
        //   this.fullName = changes.fullName;
        // }
        var _a, _b;
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) == card_types_1.Stage.BASIC && ((_b = player.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.cardType) == card_types_1.CardType.LIGHTNING) {
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    effect.damage += 30;
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.RegielekiVMAX = RegielekiVMAX;
