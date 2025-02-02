"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LilliesRibombee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class LilliesRibombee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Lillie\'s Cutiefly';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.tags = [card_types_1.CardTag.LILLIES];
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [];
        this.powers = [{
                name: 'Inviting Wink',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when you play this card from your hand to evolve 1 of your Pokémon, you may look at your opponent’s hand, choose any number of Basic Pokemon you find there, and put them onto their Bench.'
            }];
        this.attacks = [
            { name: 'Magical Shot', cost: [card_types_1.CardType.PSYCHIC], damage: 50, text: '' }
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Lillie\'s Ribombee';
        this.fullName = 'Lillie\'s Ribombee SV9';
    }
    reduceEffect(store, state, effect) {
        // Inviting Wink
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const slots = opponent.bench.filter(b => b.cards.length === 0);
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    if (opponent.hand.cards.length === 0) {
                        return state;
                    }
                    // Check if bench has open slots
                    const openSlots = opponent.bench.filter(b => b.cards.length === 0);
                    let cards = [];
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.hand, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: openSlots.length, allowCancel: false }), selected => {
                        cards = selected || [];
                        // Operation canceled by the user
                        if (cards.length === 0) {
                            return state;
                        }
                        cards.forEach((card, index) => {
                            opponent.hand.moveCardTo(card, slots[index]);
                            slots[index].pokemonPlayedTurn = state.turn;
                        });
                    });
                }
            });
        }
        return state;
    }
}
exports.LilliesRibombee = LilliesRibombee;
