"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blastoise = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Blastoise extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Wartortle';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Deluge',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn (before your attack), ' +
                    'you may attach a W Energy card from your hand to 1 of your Pokemon.'
            }];
        this.attacks = [
            {
                name: 'Hydro Pump',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Does 10 more damage for each W Energy attached to this Pokemon.'
            }
        ];
        this.set = 'BCR';
        this.name = 'Blastoise';
        this.fullName = 'Blastoise BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.WATER || cardType === card_types_1.CardType.ANY;
                }).length;
            });
            effect.damage += energyCount * 10;
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.WATER);
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: true }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const energyCard = transfer.card;
                    const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                    store.reduceEffect(state, attachEnergyEffect);
                }
            });
        }
        return state;
    }
}
exports.Blastoise = Blastoise;
