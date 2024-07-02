"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venusaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Venusaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Ivysaur';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Jungle Totem',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each basic [G] Energy attached to your Pokémon provides [G][G] Energy. You can\'t apply more than 1 Jungle Totem Ability at a time.'
            }];
        this.attacks = [
            {
                name: 'Solar Beam',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: '',
            }
        ];
        this.set = 'SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Venusaur';
        this.fullName = 'Venusaur SLG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
            const player = effect.player;
            let hasVenusaurInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasVenusaurInPlay = true;
                }
            });
            if (!hasVenusaurInPlay) {
                return state;
            }
            if (hasVenusaurInPlay) {
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                effect.source.cards.forEach(c => {
                    if (c instanceof game_1.EnergyCard && !effect.energyMap.some(e => e.card === c)) {
                        const providedTypes = c.provides.filter(type => type === card_types_1.CardType.GRASS);
                        if (providedTypes.length > 0) {
                            effect.energyMap.push({ card: c, provides: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS] });
                        }
                    }
                });
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Venusaur = Venusaur;
