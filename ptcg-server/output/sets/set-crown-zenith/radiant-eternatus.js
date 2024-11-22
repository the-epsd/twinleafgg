"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiantEternatus = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class RadiantEternatus extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.RADIANT];
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.DRAGON;
        this.hp = 170;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Climactic Gate',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may search your deck for up to 2 Pokémon VMAX and put them onto your Bench. Then, shuffle your deck. If you use this Ability, your turn ends.'
            }];
        this.attacks = [{
                name: 'Power Beam',
                cost: [game_1.CardType.FIRE, game_1.CardType.DARK, game_1.CardType.COLORLESS],
                damage: 200,
                text: '',
            }];
        this.set = 'CRZ';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Radiant Eternatus';
        this.fullName = 'Radiant Eternatus CRZ';
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
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: 'Climactic Gate' });
                        }
                    });
                    const slots = player.bench.filter(b => b.cards.length === 0);
                    if (player.deck.cards.length === 0) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                    }
                    // Check if bench has open slots
                    const openSlots = player.bench.filter(b => b.cards.length === 0);
                    if (openSlots.length === 0) {
                        // No open slots, throw error
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                    }
                    const maxPokemons = Math.min(openSlots.length, 2);
                    let cards = [];
                    const blocked = [];
                    player.deck.cards.forEach((c, index) => {
                        if (c instanceof game_1.PokemonCard && !c.tags.includes(game_1.CardTag.POKEMON_VMAX)) {
                            blocked.push(index);
                        }
                    });
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: game_1.SuperType.POKEMON }, { min: 0, max: maxPokemons, allowCancel: false, blocked }), selected => {
                        cards = selected || [];
                        // Operation canceled by the user
                        if (cards.length === 0) {
                            return state;
                        }
                        cards.forEach((card, index) => {
                            player.deck.moveCardTo(card, slots[index]);
                            slots[index].pokemonPlayedTurn = state.turn;
                            return state;
                        });
                        state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                        const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                        store.reduceEffect(state, endTurnEffect);
                        return state;
                    });
                }
            });
        }
        return state;
    }
}
exports.RadiantEternatus = RadiantEternatus;
