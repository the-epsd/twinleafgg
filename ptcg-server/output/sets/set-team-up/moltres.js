"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moltres = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Moltres extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Top Burner',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: 'Discard all [R] Energy from this Pokémon. Then, discard a card from the top of your opponent\'s deck for each Energy you discarded in this way.'
            },
            {
                name: 'Fire Spin',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'Discard 3 Energy from this Pokémon. '
            }];
        this.set = 'TEU';
        this.setNumber = '19';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Moltres';
        this.fullName = 'Moltres TEU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const totalFirenergy = checkProvidedEnergy.energyMap.reduce((sum, energy) => {
                return sum + energy.provides.filter(type => type === card_types_1.CardType.FIRE || type === card_types_1.CardType.ANY).length;
            }, 0);
            let totalDiscarded = 0;
            //Puts all fire energy into cards
            const cards = [];
            for (const energyMap of checkProvidedEnergy.energyMap) {
                const energy = energyMap.provides.filter(t => t === card_types_1.CardType.FIRE || t === card_types_1.CardType.ANY);
                if (energy.length > 0) {
                    cards.push(energyMap.card);
                }
            }
            //Discards all cards in cards array
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            //Number of cards discarded
            totalDiscarded += totalFirenergy;
            store.reduceEffect(state, discardEnergy);
            opponent.deck.moveTo(opponent.discard, totalDiscarded);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.COLORLESS, 3);
        }
        return state;
    }
}
exports.Moltres = Moltres;
