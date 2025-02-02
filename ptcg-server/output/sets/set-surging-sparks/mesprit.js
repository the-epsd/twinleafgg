"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mesprit = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Mesprit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Heart Fulfilment',
                cost: [C],
                damage: 0,
                text: 'Attach up to 2 Basic P Energy from your hand to your Pokémon in any way you like.'
            }, {
                name: 'Legendary Burst',
                cost: [P, P],
                damage: 160,
                text: 'You can only use this attack if you have Uxie and Azelf on your Bench.'
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '79';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mesprit';
        this.fullName = 'Mesprit SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.PSYCHIC);
            });
            if (!hasEnergyInHand) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH, play_card_action_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Psychic Energy' }, { min: 0, max: 2, allowCancel: false }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const energyCard = transfer.card;
                    const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                    store.reduceEffect(state, attachEnergyEffect);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let isUxieInPlay = false;
            let isAzelfInPlay = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Uxie') {
                    isUxieInPlay = true;
                }
                if (card.name === 'Azelf') {
                    isAzelfInPlay = true;
                }
            });
            if (!isUxieInPlay) {
                effect.damage = 0;
                return state;
            }
            if (!isAzelfInPlay) {
                effect.damage = 0;
                return state;
            }
            if (!isUxieInPlay && !isAzelfInPlay) {
                effect.damage = 0;
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Mesprit = Mesprit;
