"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shiinotic = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Shiinotic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = Y;
        this.hp = 100;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.evolvesFrom = 'Morelull';
        this.powers = [{
                name: 'Tasting',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may search your deck for a [Y] Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Flickering Spores',
                cost: [Y, C],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            }];
        this.set = 'UPR';
        this.name = 'Shiinotic';
        this.fullName = 'Shiinotic UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.ILLUMINATE_MARKER = 'ILLUMINATE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.ILLUMINATE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check to see if anything is blocking our Ability
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
            if (player.marker.hasMarker(this.ILLUMINATE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, cardType: Y }, { min: 0, max: 1, allowCancel: true }), selected => {
                cards = selected || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    return state;
                }
                player.marker.addMarker(this.ILLUMINATE_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, player.hand);
                });
                if (cards.length > 0) {
                    state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => {
                    });
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Shiinotic = Shiinotic;
