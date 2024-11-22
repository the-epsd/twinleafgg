"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Palafin = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Palafin extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Finizen';
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Zero to Hero',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when this Pokémon moves from the Active Spot to the Bench, you may search your deck for a Palafin ex and switch it with this Pokémon. Any attached cards, damage counters, Special Conditions, turns in play, and any other effects remain on the new Pokémon. If you switched a Pokémon in this way, put this card into your deck. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Wave Splash',
                cost: [W, C],
                damage: 30,
                text: ''
            }];
        this.set = 'TWM';
        this.setNumber = '60';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Palafin TWM';
        this.name = 'Palafin';
        this.ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect && effect.target.cards.includes(this)) {
            const player = state.players[state.activePlayer];
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
            this.movedToActiveThisTurn = false;
        }
        const cardList = game_1.StateUtils.findCardList(state, this);
        const owner = game_1.StateUtils.findOwner(state, cardList);
        const player = state.players[state.activePlayer];
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.movedToActiveThisTurn = false;
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
        }
        if (player === owner && !player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
            if (this.movedToActiveThisTurn == true) {
                player.marker.addMarker(this.ABILITY_USED_MARKER, this);
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
                state = store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === this) {
                                store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: 'Zero to Hero' });
                            }
                        });
                        if (player.deck.cards.length === 0) {
                            return state;
                        }
                        let cards = [];
                        state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: game_1.SuperType.POKEMON, name: 'Palafin ex' }, { min: 0, max: 1, allowCancel: false }), selected => {
                            cards = (selected || []);
                            if (cards.length > 0) {
                                // Move Palafin ex from deck to active
                                player.deck.moveCardTo(cards[0], player.active);
                                // Move this Palafin to deck
                                player.active.moveCardTo(this, player.deck);
                            }
                            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                                player.deck.applyOrder(order);
                            });
                        });
                    }
                });
            }
        }
        return state;
    }
}
exports.Palafin = Palafin;
