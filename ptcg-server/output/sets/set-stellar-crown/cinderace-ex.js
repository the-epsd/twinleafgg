"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cinderaceex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Cinderaceex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.evolvesFrom = 'Raboot';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 320;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Flare Strike',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 280,
                text: 'During your next turn, this Pokémon can\'t use Flare Strike.'
            },
            {
                name: 'Garnet Volley',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIGHTING, card_types_1.CardType.DARK],
                damage: 0,
                text: 'This attack does 180 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Cinderace ex';
        this.fullName = 'Cinderace ex SV7';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH]), selected => {
                const target = selected[0];
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 180);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Cinderaceex = Cinderaceex;
