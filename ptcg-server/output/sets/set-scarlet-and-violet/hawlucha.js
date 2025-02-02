"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hawlucha = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Hawlucha extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Flying Entry',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your ' +
                    'Bench during your turn, you may choose 2 of your ' +
                    'opponent\'s Benched Pokémon and put 1 damage counter' +
                    'on each of them.'
            }];
        this.attacks = [
            {
                name: 'Wing Attack',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Hawlucha';
        this.fullName = 'Hawlucha SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
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
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 2, allowCancel: false }), selected => {
                        const targets = selected || [];
                        targets.forEach(target => {
                            target.damage += 10;
                        });
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.Hawlucha = Hawlucha;
