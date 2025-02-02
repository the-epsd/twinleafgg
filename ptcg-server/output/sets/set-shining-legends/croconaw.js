"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Croconaw = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Croconaw extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Totodile';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Plunge',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, you may move all Energy from your Active Pokémon to this Pokémon. If you do, switch it with your Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Bite',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Croconaw';
        this.fullName = 'Croconaw SLG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const source = player.active;
            if (player.active.cards[0] == this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            if (checkProvidedEnergy.energyMap.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            checkProvidedEnergy.energyMap.forEach((energyMap) => {
                const card = energyMap.card;
                const index = player.active.cards.indexOf(card);
                if (index !== -1) {
                    player.active.cards.splice(index, 1);
                }
            });
            source.cards.push(...checkProvidedEnergy.energyMap.map(energyMap => energyMap.card));
            const benchIndex = player.bench.indexOf(source);
            [player.active, player.bench[benchIndex]] = [player.bench[benchIndex], player.active];
        }
        return state;
    }
}
exports.Croconaw = Croconaw;
