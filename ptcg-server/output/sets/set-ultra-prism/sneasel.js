"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sneasel = void 0;
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Sneasel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.resistance = [{ type: game_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Sneaky Smash',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'You can use this attack only if you go second, and only on your first turn. Discard an Energy from 1 of your opponent\'s Pokémon.'
            },
            {
                name: 'Ambush',
                cost: [game_1.CardType.DARK],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }
        ];
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.name = 'Sneasel';
        this.fullName = 'Sneasel UPR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP),
            ], heads => {
                if (heads) {
                    effect.damage += 20;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Opponent has no energy cards attached
            if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard) && !opponent.bench.some(c => c.cards.some(c => c instanceof game_1.EnergyCard))) {
                return state;
            }
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (!cardList.cards.some(c => c instanceof game_1.EnergyCard)) {
                    blocked.push(target);
                }
            });
            let targets = [];
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), results => {
                targets = results || [];
                if (targets.length === 0) {
                    return state;
                }
                return store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, targets[0], { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                    targets[0].moveCardTo(selected[0], opponent.discard);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.Sneasel = Sneasel;
