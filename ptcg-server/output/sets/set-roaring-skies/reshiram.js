"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reshiram = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Reshiram extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.hp = 130;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Turboblaze',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may attach a [R] Energy card from your hand to 1 of your [N] Pokémon.'
            }
        ];
        this.attacks = [
            {
                name: 'Bright Wing',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: 'Discard a [R] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'ROS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Reshiram';
        this.fullName = 'Reshiram ROS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.FIRE], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Reshiram = Reshiram;
