"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VictiniV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class VictiniV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'V Bullet',
                cost: [card_types_1.CardType.FIRE],
                damage: 10,
                text: 'If your opponent’s Active Pokémon is a Pokémon V, this ' +
                    'attack does 50 more damage.'
            },
            {
                name: 'Dragon Burst',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Discard all Energy from this Pokémon.'
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Victini V';
        this.fullName = 'Victini V BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defending = opponent.active.getPokemonCard();
            if (defending && (defending.tags.includes(card_types_1.CardTag.POKEMON_V) ||
                defending.tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
                defending.tags.includes(card_types_1.CardTag.POKEMON_VSTAR))) {
                effect.damage += 50;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.VictiniV = VictiniV;
