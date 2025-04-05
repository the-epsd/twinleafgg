"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delcatty = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Delcatty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Skitty';
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING, value: +20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Power Circulation',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may search your discard pile for up to 2 basic Energy cards, show them to your opponent, and put those cards on top of your deck in any order. If you do, put 2 damage counters on Delcatty. This power can\'t be used if Delcatty is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Power Heal',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Does 10 damage plus 10 more damage for each damage counter on Delcatty. Then, remove 2 damage counters from Delcatty.'
            },
            {
                name: 'Rear Kick',
                cost: [C, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Delcatty';
        this.fullName = 'Delcatty PL';
        this.POWER_CIRCULATION_MARKER = 'POWER_CIRCULATION_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.POWER_CIRCULATION_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.HAS_MARKER(this.POWER_CIRCULATION_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (!player.discard.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.POKEPOWER,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const deckTop = new game_1.CardList();
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 2, allowCancel: false }), selected => {
                        if (selected.length === 0)
                            return;
                        selected.forEach(card => {
                            store.log(state, game_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
                            player.discard.moveCardTo(card, deckTop);
                        });
                        store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, deckTop, { allowCancel: false }), order => {
                            if (order === null)
                                return state;
                            deckTop.applyOrder(order);
                            deckTop.moveToTopOfDestination(player.deck);
                            store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => { });
                            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                                if (cardList.getPokemonCard() === this) {
                                    cardList.damage += 20;
                                }
                            });
                            prefabs_1.ADD_MARKER(this.POWER_CIRCULATION_MARKER, player, this);
                            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                                if (cardList.getPokemonCard() === this) {
                                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                                }
                            });
                        });
                    });
                }
            });
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const delcattyDamage = effect.player.active.damage;
            effect.damage += (delcattyDamage * 10 / 10);
            attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(20, effect, store, state);
            return state;
        }
        return state;
    }
}
exports.Delcatty = Delcatty;
