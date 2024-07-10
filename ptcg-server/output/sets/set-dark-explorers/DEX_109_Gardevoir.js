"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gardevoir = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Gardevoir extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Psychic Mirage',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Each basic [P] Energy attached to your [P] Pokémon provides [P][P] Energy. You can\'t apply more than 1 [P] Mirage Ability at a time.'
            }];
        this.attacks = [{
                name: 'Mind Shock',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance. '
            }];
        this.set = 'DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.name = 'Gardevoir';
        this.fullName = 'Gardevoir DEX';
    }
    reduceEffect(store, state, effect) {
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
                        powerType: pokemon_types_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                effect.source.cards.forEach(c => {
                    if (c instanceof game_1.EnergyCard && !effect.energyMap.some(e => e.card === c)) {
                        const providedTypes = c.provides.filter(type => type === card_types_1.CardType.PSYCHIC);
                        if (providedTypes.length > 0) {
                            effect.energyMap.push({ card: c, provides: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC] });
                        }
                    }
                });
                return state;
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreWeakness = true;
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Gardevoir = Gardevoir;
