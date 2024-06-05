"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golurk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Golurk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Golett';
        this.attacks = [{
                name: 'Reinforced Punch',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'If this Pokemon has a Pokemon Tool attached, this attack does 90 more damage.'
            }, {
                name: 'Megaton Fall',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 190,
                text: 'This Pokemon also does 30 damage to itself.'
            }];
        this.regulationMark = 'E';
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Golurk';
        this.fullName = 'Golurk CRE';
        this.setNumber = '66';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let pokemonToolCount = 0;
            player.active.cards.forEach(card => {
                if (card instanceof game_1.TrainerCard && card.trainerType === card_types_1.TrainerType.TOOL) {
                    pokemonToolCount++;
                }
            });
            if (pokemonToolCount > 0) {
                effect.damage += 90;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 30);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Golurk = Golurk;
