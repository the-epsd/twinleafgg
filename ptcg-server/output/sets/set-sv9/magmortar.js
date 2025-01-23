"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magmortar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Magmortar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magmar';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Magma Surge',
                powerType: game_1.PowerType.ABILITY,
                text: 'During Pokémon Checkup, put 3 more damage counters on your opponent’s Burned Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Searing Flame',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'Flip a coin. If heads, your opponent’s Active Pokémon is now Burned.'
            }
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Magmortar';
        this.fullName = 'Magmortar SV9';
    }
    reduceEffect(store, state, effect) {
        // Magma Surge
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let magmortarOwner = null;
            [player, opponent].forEach(p => {
                p.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card === this) {
                        magmortarOwner = p;
                    }
                });
            });
            if (!magmortarOwner) {
                return state;
            }
            try {
                const stub = new game_effects_1.PowerEffect(magmortarOwner, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const magmortarOpponent = game_1.StateUtils.getOpponent(state, magmortarOwner);
            if (effect.player === magmortarOpponent && magmortarOpponent.active.specialConditions.includes(card_types_1.SpecialCondition.BURNED)) {
                effect.burnDamage += 30;
                console.log('magmortar:', effect.burnDamage);
            }
        }
        // Searing Flame
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.BURNED]);
                    return store.reduceEffect(state, specialCondition);
                }
            });
        }
        return state;
    }
}
exports.Magmortar = Magmortar;
