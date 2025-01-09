"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sylveonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Sylveonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 270;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Magical Charm',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: 'During your opponent\'s next turn, the Defending Pokemon\'s attacks do 100 less damage (before applying Weakness and Resistance).'
            },
            {
                name: 'Angelite',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING, card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Choose 2 of your opponent\'s Benched Pokémon. They shuffle those Pokémon and all attached cards into their deck. If 1 of your Pokémon used Angelite during your last turn, this attack can\'t be used.'
            }
        ];
        this.set = 'SVP';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '187';
        this.name = 'Sylveon ex';
        this.fullName = 'Sylveon ex SVP';
        this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
        this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
        this.ANGELITE_MARKER = 'ANGELITE_MARKER';
        this.CLEAR_ANGELITE_MARKER = 'CLEAR_ANGELITE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            const opponent = __1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(__1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            });
            console.log('marker removed');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_ANGELITE_MARKER, this)) {
            effect.player.marker.removeMarker(this.ANGELITE_MARKER, this);
            effect.player.marker.removeMarker(this.CLEAR_ANGELITE_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ANGELITE_MARKER, this)) {
            effect.player.marker.addMarker(this.CLEAR_ANGELITE_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            console.log('marker added');
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            if (effect.target.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
                effect.damage -= 100;
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            if (effect.player.marker.hasMarker(this.ANGELITE_MARKER, this)) {
                console.log('attack blocked');
                throw new __1.GameError(__1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ANGELITE_MARKER, this);
            console.log('marker added');
            return store.prompt(state, new __1.ChoosePokemonPrompt(player.id, __1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, __1.PlayerType.TOP_PLAYER, [__1.SlotType.BENCH], { min: 1, max: 2, allowCancel: false }), selected => {
                const targets = selected || [];
                player.marker.addMarker(this.ANGELITE_MARKER, this);
                targets.forEach(target => {
                    target.clearEffects();
                    target.moveTo(opponent.deck);
                    return store.prompt(state, new __1.ShuffleDeckPrompt(opponent.id), order => {
                        opponent.deck.applyOrder(order);
                    });
                });
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Sylveonex = Sylveonex;
