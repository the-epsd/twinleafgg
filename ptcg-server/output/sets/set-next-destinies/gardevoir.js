"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gardevoir = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gardevoir extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Psychic Mirage',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each basic [P] Energy attached to your [P] Pokémon provides [P][P] Energy. You can\'t apply more than 1 Psychic Mirage Ability at a time.'
            }];
        this.attacks = [
            {
                name: 'Mind Shock',
                cost: [P, P, C, C],
                damage: 60,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.',
            }
        ];
        this.set = 'NXD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Gardevoir';
        this.fullName = 'Gardevoir NXD';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
        }
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
            const player = effect.player;
            let hasGardevoirInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasGardevoirInPlay = true;
                }
            });
            if (!hasGardevoirInPlay) {
                return state;
            }
            if (hasGardevoirInPlay) {
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
exports.Gardevoir = Gardevoir;
