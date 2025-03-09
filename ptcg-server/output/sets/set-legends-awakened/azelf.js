"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Azelf = void 0;
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Azelf extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC, value: +20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Time Walk',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Azelf from your hand onto your Bench, you may look at all of your face-down Prize cards. If you do, you may choose 1 Pokémon you find there, show it to your opponent, and put it into your hand. Then, choose 1 card in your hand and put it as a Prize card face down.'
            }];
        this.attacks = [
            {
                name: 'Lock Up',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 20,
                text: 'The Defending Pokémon can\’t retreat during your opponent\’s next turn.'
            }
        ];
        this.set = 'LA';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Azelf';
        this.fullName = 'Azelf LA';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEPOWER,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            return store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    const prizes = player.prizes.filter(p => p.isSecret);
                    prizes.forEach(p => { p.isSecret = false; });
                    const cardList = new game_1.CardList();
                    prizes.forEach(prizeList => {
                        cardList.cards.push(...prizeList.cards);
                    });
                    // Prompt the player to choose a Pokémon from their prizes
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, cardList, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false }), chosenPrize => {
                        if (chosenPrize.length > 0) {
                            state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, chosenPrize), () => { });
                            player.prizes.forEach(p => {
                                if (p.cards[0] === chosenPrize[0]) {
                                    p.moveCardsTo(chosenPrize, player.supporter);
                                }
                            });
                            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARDS_TO_RETURN_TO_PRIZES, player.hand, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                                player.supporter.moveCardsTo(chosenPrize, player.hand);
                                player.prizes.forEach(p => {
                                    if (p.cards.length === 0) {
                                        player.hand.moveCardsTo(selected, p);
                                    }
                                });
                            });
                        }
                        player.prizes.forEach(p => {
                            p.isSecret = true;
                        });
                        return state;
                    });
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        return state;
    }
}
exports.Azelf = Azelf;
