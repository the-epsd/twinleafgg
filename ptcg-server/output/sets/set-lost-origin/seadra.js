"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seadra = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Seadra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Horsea';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Swim Freely',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
            },
            {
                name: 'Hydro Jet',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'This attack does 20 damage to 1 of your opponent\'s Pokémon for each [W] Energy attached to this Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Seadra';
        this.fullName = 'Seadra LOR';
        this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
        this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                let energyCount = 0;
                checkProvidedEnergyEffect.energyMap.forEach(em => {
                    energyCount += em.provides.filter(cardType => cardType === card_types_1.CardType.WATER || cardType === card_types_1.CardType.ANY).length;
                });
                const damage = energyCount * 20;
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    player.active.marker.addMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
                    opponent.marker.addMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
                }
            });
            return state;
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect
            && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
            });
        }
        return state;
    }
}
exports.Seadra = Seadra;
