"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonsVoltorb = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class HolonsVoltorb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.HOLONS];
        this.cardType = L;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Special Energy Effect',
                powerType: game_1.PowerType.HOLONS_SPECIAL_ENERGY_EFFECT,
                useFromHand: true,
                text: 'You may attach this as an Energy card from your hand to 1 of your Pokémon. While attached, this card is a Special Energy card and provides [C] Energy. [Click this effect to use it.]'
            }];
        this.attacks = [{
                name: 'Thundershock',
                cost: [L],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Holon\'s Voltorb';
        this.fullName = 'Holon\'s Voltorb DS';
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
        // Thundershock
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result => {
                if (result) {
                    attack_effects_2.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
                }
            }));
        }
        return state;
    }
}
exports.HolonsVoltorb = HolonsVoltorb;
