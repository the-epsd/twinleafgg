"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crobat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Crobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [];
        this.evolvesFrom = 'Golbat';
        this.powers = [{
                name: 'Drastic Draw',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokemon from your hand to evolve 1 of your Pokemon during your turn, you may draw 3 cards.'
            }];
        this.attacks = [{
                name: 'Wing Attack',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Crobat';
        this.fullName = 'Crobat BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    player.deck.moveTo(player.hand, 3);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Crobat = Crobat;
