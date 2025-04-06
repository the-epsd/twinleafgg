"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonsMagnemite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class HolonsMagnemite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.HOLONS];
        this.cardType = M;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Special Energy Effect',
                powerType: game_1.PowerType.HOLONS_SPECIAL_ENERGY_EFFECT,
                useFromHand: true,
                text: 'You may attach this as an Energy card from your hand to 1 of your Pokémon. While attached, this card is a Special Energy card and provides [C] Energy. [Click this effect to use it.]'
            }];
        this.attacks = [{
                name: 'Linear Attack',
                cost: [M],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Holon\'s Magnemite';
        this.fullName = 'Holon\'s Magnemite DS';
        this.provides = [card_types_1.CardType.COLORLESS];
    }
    reduceEffect(store, state, effect) {
        // The Special Energy Stuff
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.energyPlayedTurn === state.turn) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.energyPlayedTurn = state.turn;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                // Moving it onto the pokemon
                effect.preventDefault = true;
                player.hand.moveCardTo(this, targets[0]);
                // Reposition it to be with energy cards (at the beginning of the card list)
                targets[0].cards.unshift(targets[0].cards.splice(targets[0].cards.length - 1, 1)[0]);
                // Register this card as energy in the PokemonCardList
                targets[0].addPokemonAsEnergy(this);
            });
        }
        // Provide energy when attached as energy and included in CheckProvidedEnergyEffect
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect
            && effect.source.cards.includes(this)) {
            // Check if this card is registered as an energy card in the PokemonCardList
            const pokemonList = effect.source;
            if (pokemonList.energyCards.includes(this)) {
                effect.energyMap.push({ card: this, provides: this.provides });
            }
        }
        // Reset the flag when the card is discarded
        if (effect instanceof attack_effects_1.DiscardCardsEffect && effect.target.cards.includes(this)) {
            effect.target.removePokemonAsEnergy(this);
        }
        // Linear Attack
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_2.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state);
        }
        return state;
    }
}
exports.HolonsMagnemite = HolonsMagnemite;
