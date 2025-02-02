"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moltres = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Moltres extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 80;
        this.weakness = [];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Dry Up',
                cost: [R, R],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon and flip a coin until you get tails. For each heads, discard 1 Water Energy card attached to that Pokémon, if any.'
            },
            {
                name: 'Fire Wing',
                cost: [R, R, R, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'VS2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Moltres';
        this.fullName = 'Moltres VS2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let numFlips = 0;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    numFlips++;
                    return this.reduceEffect(store, state, effect);
                }
                if (numFlips === 0) {
                    return state;
                }
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                    targets.forEach(target => {
                        return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, target, // Card source is target Pokemon
                        { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { min: 0, max: numFlips, allowCancel: false }), selected => {
                            const cards = selected || [];
                            if (cards.length > 0) {
                                targets.forEach(target => {
                                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                                    discardEnergy.target = target;
                                    store.reduceEffect(state, discardEnergy);
                                });
                            }
                            return state;
                        });
                    });
                });
            });
            return state;
        }
        return state;
    }
}
exports.Moltres = Moltres;
