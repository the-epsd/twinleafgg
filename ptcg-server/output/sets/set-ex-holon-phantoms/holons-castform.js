"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolonsCastform = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class HolonsCastform extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.HOLONS];
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Special Energy Effect',
                powerType: game_1.PowerType.HOLONS_SPECIAL_ENERGY_EFFECT,
                useFromHand: true,
                text: 'You may attach this as an Energy card from your hand to 1 of your Pokémon that already has an Energy card attached to it. When you attach this card, return an Energy card attached to that Pokémon to your hand. While attached, this card is a Special Energy card and provides every type of Energy but 2 Energy at a time. (Has no effect other than providing Energy.) [Click this effect to use it.]'
            }];
        this.attacks = [{
                name: 'Delta Draw',
                cost: [C],
                damage: 0,
                text: 'Count the number of Pokémon you have in play that has δ on its card. Draw up to that many cards.'
            }];
        this.set = 'HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Holon\'s Castform';
        this.fullName = 'Holon\'s Castform HP';
        this.energyEffectActivated = false;
    }
    reduceEffect(store, state, effect) {
        // The Special Energy Stuff
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.energyPlayedTurn === state.turn) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
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
                    // moving it onto the pokemon
                    effect.preventDefault = true;
                    player.hand.moveCardTo(this, targets[0]);
                    // moving it to the back so it doesn't affect any evolution/name interactions 
                    // this unfortunately doesn't make it show up as energy, but it works
                    targets[0].cards.unshift(targets[0].cards.splice(targets[0].cards.length - 1, 1)[0]);
                    // activating the energy
                    this.energyEffectActivated = true;
                    this.superType = card_types_1.SuperType.ENERGY;
                    this.energyType = card_types_1.EnergyType.SPECIAL;
                });
            });
        }
        // providing the energy stuff
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect
            && effect.source.cards.includes(this)
            && effect.source.getPokemonCard() !== this
            && this.energyEffectActivated === true) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY, card_types_1.CardType.ANY] });
        }
        // trying to remove the effect when the card is discarded for any reason
        if (effect instanceof attack_effects_1.DiscardCardsEffect && effect.target.cards.includes(this)) {
            this.superType = card_types_1.SuperType.POKEMON;
            this.energyEffectActivated = false;
        }
        // Delta Draw
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let deltasInPlay = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                var _a;
                if ((_a = card.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.DELTA_SPECIES)) {
                    deltasInPlay++;
                }
            });
            prefabs_1.DRAW_CARDS(player, deltasInPlay);
        }
        return state;
    }
}
exports.HolonsCastform = HolonsCastform;
