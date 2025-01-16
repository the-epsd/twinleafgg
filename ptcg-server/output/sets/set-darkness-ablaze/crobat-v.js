"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrobatV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const card_types_2 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class CrobatV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Dark Asset',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may draw cards until you have 6 cards in your hand. You can\'t use more than 1 Dark Asset Ability each turn.'
            }];
        this.attacks = [
            {
                name: 'Venomous Fang',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }
        ];
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'Crobat V';
        this.fullName = 'Crobat V DAA';
        this.DARK_ASSET_MARKER = 'DARK_ASSET_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DARK_ASSET_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.DARK_ASSET_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if (player.marker.hasMarker(this.DARK_ASSET_MARKER, this)) {
                return state;
            }
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
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    player.marker.addMarker(this.DARK_ASSET_MARKER, this);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        }
                    });
                    while (player.hand.cards.length < 6) {
                        if (player.deck.cards.length === 0) {
                            break;
                        }
                        player.deck.moveTo(player.hand, 1);
                    }
                }
                if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.POISONED]);
                    state = store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        return state;
    }
}
exports.CrobatV = CrobatV;
