"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Noctowl = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Noctowl extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hoothoot';
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 100;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Jewel Seeker',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when you play this Pokémon from your hand to evolve 1 of your Pokémon, if you have any Tera Pokémon in play, you may search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Speed Wing',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.name = 'Noctowl';
        this.fullName = 'Noctowl SV7';
        this.JEWEL_HUNT_MARKER = 'JEWEL_HUNT_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.JEWEL_HUNT_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                return state;
            }
            if (player.marker.hasMarker(this.JEWEL_HUNT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            let teraPokemonCount = 0;
            if ((_b = (_a = player.active) === null || _a === void 0 ? void 0 : _a.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(game_1.CardTag.POKEMON_TERA)) {
                teraPokemonCount++;
            }
            player.bench.forEach(benchSpot => {
                var _a;
                if ((_a = benchSpot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(game_1.CardTag.POKEMON_TERA)) {
                    teraPokemonCount++;
                }
            });
            if (teraPokemonCount == 0) {
                return state;
            }
            if (teraPokemonCount >= 1) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_c) {
                    return state;
                }
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
                        state = store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.TRAINER }, { min: 0, max: 2, allowCancel: false }), selected => {
                            const cards = selected || [];
                            store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                                player.deck.moveCardsTo(cards, player.hand);
                                player.marker.addMarker(this.JEWEL_HUNT_MARKER, this);
                            });
                            return state;
                        });
                    }
                });
            }
        }
        return state;
    }
}
exports.Noctowl = Noctowl;
