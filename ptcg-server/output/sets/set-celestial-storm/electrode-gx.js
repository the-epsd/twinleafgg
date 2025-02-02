"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectrodeGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const discard_energy_prompt_1 = require("../../game/store/prompts/discard-energy-prompt");
class ElectrodeGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Voltorb';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Extra Energy Bomb',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may attach 5 Energy cards from your discard pile to your Pokémon, except Pokémon-GX or Pokémon-EX, in any way you like. If you do, this Pokémon is Knocked Out.'
            }];
        this.attacks = [
            {
                name: 'Electro Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            },
            {
                name: 'Crash and Burn-GX',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 30,
                damageCalculation: '+',
                gxAttack: true,
                text: 'Discard any amount of Energy from your Pokémon. This attack does 50 more damage for each card you discarded in this way. (You can\'t use more than 1 GX attack in a game.) '
            },
        ];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Electrode-GX';
        this.fullName = 'Electrode-GX CES';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                    blocked2.push(target);
                }
                if (card.tags.includes(card_types_1.CardTag.POKEMON_GX)) {
                    blocked2.push(target);
                }
            });
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 5, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.damage += 999;
                            return state;
                        }
                    });
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.damage += 999;
                    }
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.usedGX === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // return store.prompt(state, new ChoosePokemonPrompt(
            //   player.id,
            //   GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            //   PlayerType.BOTTOM_PLAYER,
            //   [SlotType.ACTIVE, SlotType.BENCH],
            //   { min: 1, max: 6, allowCancel: true }
            // ), targets => {
            //   targets.forEach(target => {
            let totalEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const energyCount = cardList.cards.filter(card => card instanceof game_1.EnergyCard).length;
                totalEnergy += energyCount;
            });
            console.log('Total Energy: ' + totalEnergy);
            return store.prompt(state, new discard_energy_prompt_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], // Card source is target Pokemon
            { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: totalEnergy, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    let totalDiscarded = 0;
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = player.discard;
                    source.moveCardTo(transfer.card, target);
                    totalDiscarded = transfers.length;
                    effect.damage += totalDiscarded * 50;
                    player.usedGX = true;
                }
                console.log('Total Damage: ' + effect.damage);
                return state;
            });
        }
        return state;
    }
}
exports.ElectrodeGX = ElectrodeGX;
