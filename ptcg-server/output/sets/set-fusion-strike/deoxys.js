"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deoxys = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Deoxys extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.FUSION_STRIKE, card_types_1.CardTag.SINGLE_STRIKE, card_types_1.CardTag.RAPID_STRIKE];
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Photon Boost',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'If this Pokémon has any Fusion Strike Energy attached, this attack does 80 more damage.'
            },
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.name = 'Deoxys';
        this.fullName = 'Deoxys FST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const pokemon = player.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
            store.reduceEffect(state, checkEnergy);
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard && energyCard.name == 'Fusion Strike Energy')
                    effect.damage += 80;
            });
            return state;
        }
        return state;
    }
}
exports.Deoxys = Deoxys;
