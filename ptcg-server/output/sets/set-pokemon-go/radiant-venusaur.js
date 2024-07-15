"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiantVenusaur = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class RadiantVenusaur extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.RADIANT];
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 150;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Sunny Bloom',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once at the end of your turn (after your attack), you may use this Ability. Draw cards until you have 4 cards in your hand.'
            }];
        this.attacks = [{
                name: 'Pollen Hazard',
                cost: [game_1.CardType.GRASS, game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 90,
                text: 'Your opponent\'s Active Pokémon is now Burned, Confused, and Poisoned.'
            }];
        this.regulationMark = 'F';
        this.set = 'PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Radiant Venusaur';
        this.fullName = 'Radiant Venusaur PGO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.BURNED, game_1.SpecialCondition.CONFUSED, game_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialCondition);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            let hasVenusaurInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasVenusaurInPlay = true;
                }
            });
            if (!hasVenusaurInPlay) {
                return state;
            }
            if (hasVenusaurInPlay) {
                if (player.hand.cards.length < 4) {
                    state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                        if (wantToUse) {
                            const player = effect.player;
                            while (player.hand.cards.length < 4) {
                                if (player.deck.cards.length === 0) {
                                    break;
                                }
                                player.deck.moveTo(player.hand, 1);
                            }
                            return state;
                        }
                    });
                }
                return state;
            }
        }
        return state;
    }
}
exports.RadiantVenusaur = RadiantVenusaur;
