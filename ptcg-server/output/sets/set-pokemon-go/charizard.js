"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charizard = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Charizard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'PGO';
        this.setNumber = '10';
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Charizard PGO';
        this.name = 'Charizard';
        this.cardType = card_types_1.CardType.FIRE;
        this.evolvesFrom = 'Charmeleon';
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.regulationMark = 'F';
        this.powers = [
            {
                name: 'Burn Brightly',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Each basic [R] Energy attached to your Pokémon provides [R][R] Energy. You can\'t apply more than 1 Burn Brightly Ability at a time.'
            }
        ];
        this.attacks = [
            {
                name: 'Flare Blitz',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 170,
                text: 'Discard all [R] Energy from this Pokémon.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = [];
            for (const energyMap of checkProvidedEnergy.energyMap) {
                const energy = energyMap.provides.filter(t => t === card_types_1.CardType.FIRE || t === card_types_1.CardType.ANY);
                if (energy.length > 0) {
                    cards.push(energyMap.card);
                }
            }
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
        }
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect) {
            const player = effect.player;
            let hasCharizardInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasCharizardInPlay = true;
                }
            });
            if (!hasCharizardInPlay) {
                return state;
            }
            if (hasCharizardInPlay) {
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
                        const providedTypes = c.provides.filter(type => type === card_types_1.CardType.FIRE);
                        if (providedTypes.length > 0) {
                            effect.energyMap.push({ card: c, provides: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE] });
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
exports.Charizard = Charizard;
