"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moltres = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Moltres extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: 30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Wildfire',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: 'You may discard any number of [R] Energy cards attached to Moltres when you use this attack. If you do, discard that many cards from the top of your opponent\'s deck.'
            },
            {
                name: 'Dive Bomb',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 80,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Moltres';
        this.fullName = 'Moltres FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const active = player.active;
            // Filter metal energies from the active Pokémon
            const energies = active.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY).length;
            const min = 1;
            const max = energies;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, active, { superType: card_types_1.SuperType.ENERGY }, { min: min, max: max, allowCancel: false }), energy => {
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, energy);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
                state = prefabs_1.MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: energy.length });
                // opponent.deck.moveTo(opponent.discard, energy.length);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === false) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Moltres = Moltres;
