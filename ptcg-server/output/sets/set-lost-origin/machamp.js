"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Machamp = void 0;
const __1 = require("../..");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Machamp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Machoke';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Crisis Muscles',
                powerType: __1.PowerType.ABILITY,
                text: 'If your opponent has 3 or fewer Prize cards remaining, this Pokémon gets +150 HP.'
            }];
        this.attacks = [{
                name: 'Strong-Arm Lariat',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 100,
                damageCalculation: '+',
                text: 'You may do 100 more damage. If you do, during your next turn, this Pokémon can\'t attack.'
            }];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.regulationMark = 'F';
        this.name = 'Machamp';
        this.fullName = 'Machamp LOR';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                throw new __1.GameError(__1.GameMessage.BLOCKED_BY_EFFECT);
            }
            state = store.prompt(state, new __1.ConfirmPrompt(effect.player.id, __1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    effect.damage += 100;
                    effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
                }
            });
        }
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, effect.player);
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: __1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (opponent.getPrizeLeft() <= 3) {
                effect.hp += 100;
            }
            return state;
        }
        return state;
    }
}
exports.Machamp = Machamp;
