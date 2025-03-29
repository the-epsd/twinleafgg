"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonsMagneton = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class HolonsMagneton extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Holon\'s Magnemite';
        this.tags = [card_types_1.CardTag.HOLONS];
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Special Energy Effect',
                powerType: game_1.PowerType.HOLONS_SPECIAL_ENERGY_EFFECT,
                useFromHand: true,
                text: 'You may attach this as an Energy card from your hand to 1 of your Pokémon that already has an Energy card attached to it. When you attach this card, return an Energy card attached to that Pokémon to your hand. While attached, this card is a Special Energy card and provides every type of Energy but 2 Energy at a time. (Has no effect other than providing Energy.) [Click this effect to use it.]'
            }];
        this.attacks = [{
                name: 'Extra Ball',
                cost: [M, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is Pokémon-ex, this attack does 30 damage plus 20 more damage.'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Holon\'s Magneton';
        this.fullName = 'Holon\'s Magneton DS';
        // Which energies this provides when attached as an energy
        this.provides = [card_types_1.CardType.ANY, card_types_1.CardType.ANY];
    }
    reduceEffect(store, state, effect) {
        // The Special Energy Stuff
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.energyPlayedTurn === state.turn) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.energyPlayedTurn = state.turn;
            let isEnergyOnBench = false;
            let isEnergyOnActive = false;
            const activeEnergyCount = player.active.cards.filter(card => card instanceof game_1.EnergyCard).length;
            if (activeEnergyCount > 0) {
                isEnergyOnActive = true;
            }
            const blockedTo = [];
            if (!isEnergyOnActive) {
                const target = {
                    player: game_1.PlayerType.BOTTOM_PLAYER,
                    slot: game_1.SlotType.ACTIVE,
                    index: 0
                };
                blockedTo.push(target);
            }
            player.bench.forEach((bench, index) => {
                if (bench.cards.length === 0) {
                    return;
                }
                const basicEnergyCount = bench.cards.filter(card => card instanceof game_1.EnergyCard).length;
                if (basicEnergyCount > 0) {
                    isEnergyOnBench = true;
                }
                else {
                    const target = {
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: game_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            if (!isEnergyOnActive && !isEnergyOnBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked: blockedTo }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, targets[0]);
                state = store.reduceEffect(state, checkProvidedEnergy);
                return store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_HAND, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                    const cards = (energy || []).map(e => e.card);
                    store.log(state, game_1.GameLog.LOG_PLAYER_CHOOSES, { name: player.name, string: '' + cards[0].name });
                    targets[0].moveCardsTo(cards, player.hand);
                    // Moving it onto the pokemon
                    effect.preventDefault = true;
                    player.hand.moveCardTo(this, targets[0]);
                    // Reposition it to be with energy cards (at the beginning of the card list)
                    targets[0].cards.unshift(targets[0].cards.splice(targets[0].cards.length - 1, 1)[0]);
                    // Register this card as energy in the PokemonCardList
                    targets[0].addPokemonAsEnergy(this);
                });
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
        // Extra Ball
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG(effect, state, 20, card_types_1.CardTag.POKEMON_ex);
        }
        return state;
    }
}
exports.HolonsMagneton = HolonsMagneton;
