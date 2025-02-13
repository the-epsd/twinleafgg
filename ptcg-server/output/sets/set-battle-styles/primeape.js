"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primeape = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Primeape extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.evolvesFrom = 'Mankey';
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: P }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: ' Field Crush',
                cost: [C],
                damage: 20,
                text: 'If your opponent has a Stadium in play, discard it.'
            },
            {
                name: 'Steamin\' Mad Strike',
                cost: [F, F],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage for each of your Benched Pokémon that has any damage counters on it.'
            }
        ];
        this.set = 'BST';
        this.name = 'Primeape';
        this.fullName = 'Primeape BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.regulationMark = 'E';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (!stadiumCard) {
                return state;
            }
            //Discard only the opponent's stadium.
            const stadiumCardList = game_1.StateUtils.findCardList(state, stadiumCard);
            const owner = game_1.StateUtils.findOwner(state, stadiumCardList);
            if (owner !== effect.player) {
                prefabs_1.DISCARD_A_STADIUM_CARD_IN_PLAY(state);
                return state;
            }
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            //I check how many Pokémon are on the bench to know how much damage the attack will cause.
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            let benchPokemonWithDamage = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList === player.active) {
                    return;
                }
                if (cardList.damage !== 0) {
                    benchPokemonWithDamage++;
                }
            });
            //The attack needs to be reset; otherwise, it will always cause 50 damage, even without any Pokémon with damage on the bench.
            effect.damage = 0;
            prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 50 * benchPokemonWithDamage);
        }
        return state;
    }
}
exports.Primeape = Primeape;
