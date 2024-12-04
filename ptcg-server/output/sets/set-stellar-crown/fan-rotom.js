"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanRotom = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class FanRotom extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Fan Call',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your first turn, you may search your deck for up to 3 [C] Pokémon with 100 HP or less, reveal them, and put them into your hand. Then, shuffle your deck. You can\'t use more than 1 Fan Call Ability during your turn.'
            }];
        this.attacks = [
            {
                name: 'Assault Landing',
                cost: [game_1.CardType.COLORLESS],
                damage: 70,
                text: 'If there is no Stadium in play, this attack does nothing.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Fan Rotom';
        this.fullName = 'Fan Rotom SV7';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.usedFanCall = false;
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.usedFanCall == true) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (state.turn > 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            else {
                let pokemons = 0;
                const blocked = [];
                player.deck.cards.forEach((c, index) => {
                    if (c instanceof game_1.PokemonCard && c.cardType === game_1.CardType.COLORLESS && c.hp <= 100) {
                        pokemons += 1;
                    }
                    else {
                        blocked.push(index);
                    }
                });
                const maxPokemons = Math.min(pokemons, 3);
                state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.POKEMON }, { min: 0, max: 3, allowCancel: false, blocked, maxPokemons }), selected => {
                    const cards = selected || [];
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(game_1.BoardEffect.ABILITY_USED);
                        }
                    });
                    if (cards.length > 0) {
                        store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                            player.deck.moveCardsTo(cards, player.hand);
                            player.usedFanCall = true;
                        });
                    }
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard == undefined) {
                effect.damage = 0;
            }
            else {
                effect.damage = 70;
            }
        }
        return state;
    }
}
exports.FanRotom = FanRotom;
