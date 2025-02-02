"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frogadier = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Frogadier extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 80;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.evolvesFrom = 'Froakie';
        this.powers = [{
                name: 'Gale Shuriken',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put 2 damage counters on 1 of your opponent\'s Pokémon.'
            }];
        this.attacks = [{
                name: 'Water Drip',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: ''
            }];
        this.set = 'FLI';
        this.name = 'Frogadier';
        this.fullName = 'Frogadier FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    // Try to reduce PowerEffect, to check if something is blocking our ability
                    try {
                        const stub = new game_effects_1.PowerEffect(player, {
                            name: 'test',
                            powerType: pokemon_types_1.PowerType.ABILITY,
                            text: ''
                        }, this);
                        store.reduceEffect(state, stub);
                    }
                    catch (_a) {
                        return state;
                    }
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                        const targets = selected || [];
                        targets.forEach(target => {
                            target.damage += 20;
                        });
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.Frogadier = Frogadier;
