"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChienPaoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class ChienPaoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Shivery Chill',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active ' +
                    'Spot, you may search your deck for up to 2 Basic [W] Energy ' +
                    'cards, reveal them, and put them into your hand. Then, ' +
                    'shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Hail Blade',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 60,
                text: 'You may discard any amount of W Energy from your ' +
                    'Pokémon. This attack does 60 damage for each card you ' +
                    'discarded in this way.'
            }
        ];
        this.set = 'PAL';
        this.name = 'Chien-Pao ex';
        this.fullName = 'Chien-Pao ex PAL';
    }
    // Implement power
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.active.cards[0] !== this) {
                return state; // Not active
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { min: 0, max: 2, allowCancel: true }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        //    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        //
        //      const player = effect.player;
        //    
        //      const checkEnergy = new CheckProvidedEnergyEffect(player);
        //      store.reduceEffect(state, checkEnergy);
        //    
        //      const waterEnergies = checkEnergy.energyMap.filter(em => 
        //        Array.isArray(em.provides) && em.provides.some(p => {
        //          if (p instanceof EnergyCard) {
        //            return p.energyType === EnergyType.BASIC && p.superType === SuperType.ENERGY && p.name === 'Water Energy';
        //          }
        //          return false;
        //        })
        //
        //      );
        //    
        //      
        //      return store.prompt(state, new ChooseCardsPrompt(
        //        player.id,
        //        GameMessage.CHOOSE_CARD_TO_DISCARD,
        //        PlayerType.BOTTOM_PLAYER,
        //        [ SlotType.ACTIVE, SlotType.BENCH ],
        //        waterEnergies.map(em => em.card),
        //      ), cards => {
        //    
        //        const discardEffect = new DiscardCardsEffect(effect, cards);
        //        discardEffect.target = player.active;
        //        store.reduceEffect(state, discardEffect);
        //    
        //        effect.damage = cards.length * 60;
        //    
        //      });
        //    
        //    }
        return state;
    }
}
exports.ChienPaoex = ChienPaoex;
