"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianZoroarkVSTAR = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class HisuianZoroarkVSTAR extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Hisuian Zoroark V';
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 270;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Phantom Star',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'During your turn, you may discard your hand and draw 7 cards. (You can\'t use more than 1 VSTAR Power in a game.)'
            }];
        this.attacks = [
            {
                name: 'Ticking Curse',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                damageCalculator: 'x',
                text: 'This attack does 50 damage for each of your Pokémon that has any damage counters on it.'
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '147';
        this.name = 'Hisuian Zoroark VSTAR';
        this.fullName = 'Hisuian Zoroark VSTAR LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.discard);
            player.deck.moveTo(player.hand, 7);
            player.usedVSTAR = true;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            let benchPokemonWithDamage = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage !== 0) {
                    benchPokemonWithDamage++;
                }
            });
            effect.damage = benchPokemonWithDamage * 50;
        }
        return state;
    }
}
exports.HisuianZoroarkVSTAR = HisuianZoroarkVSTAR;
