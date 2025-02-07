"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysGyarados = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MistysGyarados extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Misty\'s Magikarp';
        this.tags = [game_1.CardTag.MISTYS];
        this.cardType = W;
        this.hp = 180;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Splashing Panic',
                cost: [W],
                damage: 70,
                damageCalculation: 'x',
                text: 'Discard the top 7 cards of your deck. This attack does 70 damage times the amount of Misty\'s Pokémon you find there.',
            },
            { name: 'Waterfall', cost: [W, C, C], damage: 120, text: '' },
        ];
        this.set = 'SV9a';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Misty\'s Gyarados';
        this.fullName = 'Misty\'s Gyarados SV9a';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 7);
            let mistysPokemon = 0;
            deckTop.cards.forEach(c => {
                if (c.tags.includes(game_1.CardTag.MISTYS) && c.superType === game_1.SuperType.POKEMON)
                    mistysPokemon++;
            });
            deckTop.moveCardsTo(deckTop.cards, player.discard);
            effect.damage = 70 * mistysPokemon;
        }
        return state;
    }
}
exports.MistysGyarados = MistysGyarados;
