"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidoqueen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Nidoqueen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Nidorina';
        this.attacks = [{
                name: 'Boyfriends',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Does 20 damage plus 20 more damage for each Nidoking you have in play.'
            },
            {
                name: 'Mega Punch',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Nidoqueen';
        this.fullName = 'Nidoqueen JU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let benchPokemon = [];
            const nidokingInPlay = [];
            if (player.bench.some(b => b.cards.length > 0)) {
                try {
                    benchPokemon = player.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined);
                    nidokingInPlay.push(...benchPokemon.filter(card => card.name === 'Nidoking'));
                }
                catch (_a) {
                    // no Nidoking on bench
                }
            }
            const numberOfNidokings = nidokingInPlay.length;
            effect.damage += numberOfNidokings * 20;
        }
        return state;
    }
}
exports.Nidoqueen = Nidoqueen;
