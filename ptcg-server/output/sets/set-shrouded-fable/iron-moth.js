"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronMoth = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class IronMoth extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.FIRE;
        this.hp = 120;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.tags = [game_1.CardTag.FUTURE];
        this.attacks = [
            {
                name: 'Suction',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 30,
                text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
            },
            {
                name: 'Anachronism Repulsor',
                cost: [game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.COLORLESS],
                damage: 120,
                text: 'During your next turn, prevent all damage done to this Pokémon by attacks from Ancient Pokémon.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SFA';
        this.name = 'Iron Moth';
        this.fullName = 'Iron Moth SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.WILD_REJECTOR_MARKER = 'WILD_REJECTOR_MARKER';
        this.CLEAR_WILD_REJECTOR_MARKER = 'CLEAR_WILD_REJECTOR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Absorption
            if (effect.damage > 0) {
                const target = game_1.StateUtils.getTarget(state, player, effect.target);
                const healEffect = new game_effects_1.HealEffect(player, target, effect.damage);
                state = store.reduceEffect(state, healEffect);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.WILD_REJECTOR_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_WILD_REJECTOR_MARKER, this);
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.WILD_REJECTOR_MARKER)) {
            const card = effect.source.getPokemonCard();
            const ancientPokemon = card && card.tags.includes(game_1.CardTag.ANCIENT);
            if (ancientPokemon) {
                effect.preventDefault = true;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.marker.hasMarker(this.CLEAR_WILD_REJECTOR_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_WILD_REJECTOR_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.WILD_REJECTOR_MARKER, this);
                });
            }
        }
        return state;
    }
}
exports.IronMoth = IronMoth;
