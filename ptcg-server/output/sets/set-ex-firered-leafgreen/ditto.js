"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ditto = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ditto extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Transform',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may search your discard pile for a Basic Pokémon (excluding Pokémon-ex and Ditto) and switch it with Ditto. (Any  cards attached to Ditto, damage counters, Special Conditions, and effects on it are now on the new Pokémon.) Place Ditto in the discard pile.'
            }];
        this.attacks = [{
                name: 'Energy Ball',
                cost: [C],
                damage: 10,
                text: 'Does 10 damage plus 10 more damage for each Energy attached to Ditto but not used to pay for this attack\’s Energy cost. You can\’t add more then 20 damage in this way.'
            }];
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Ditto';
        this.fullName = 'Ditto RG';
    }
    reduceEffect(store, state, effect) {
        //Power
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const targetCardList = game_1.StateUtils.findCardList(state, this);
            if (!(targetCardList instanceof game_1.PokemonCardList)) {
                throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
            }
            let canUse = false;
            const blocked = [];
            player.discard.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && (card.name === 'Ditto' || card.tags.includes(game_1.CardTag.POKEMON_ex))) {
                    blocked.push(index);
                }
                else if (card instanceof game_1.PokemonCard && card.stage === game_1.Stage.BASIC) {
                    canUse = true;
                }
            });
            if (!(canUse)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, player.discard, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false, blocked }), (selection) => {
                if (selection.length <= 0) {
                    throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
                }
                const pokemonCard = selection[0];
                if (!(pokemonCard instanceof game_1.PokemonCard)) {
                    throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
                }
                store.log(state, game_1.GameLog.LOG_PLAYER_TRANSFORMS_INTO_POKEMON, {
                    name: player.name,
                    pokemon: this.name,
                    card: pokemonCard.name,
                    effect: effect.power.name,
                });
                player.discard.moveCardTo(pokemonCard, targetCardList);
                targetCardList.moveCardTo(this, player.discard);
            });
        }
        //Attack
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[0]);
            state = store.reduceEffect(state, checkCost);
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            const energy = checkEnergy.energyMap;
            const extraEnergy = energy.length - checkCost.cost.length;
            if (extraEnergy == 1)
                effect.damage += 10;
            else if (extraEnergy >= 2)
                effect.damage += 20;
        }
        return state;
    }
}
exports.Ditto = Ditto;
