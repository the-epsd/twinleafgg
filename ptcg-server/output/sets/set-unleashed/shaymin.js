"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shaymin = void 0;
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Shaymin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Celebration Wind',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Shaymin from your hand onto ' +
                    'your Bench, you may move as many Energy cards attached to your ' +
                    'Pokemon as you like to any of your other Pokemon.'
            }];
        this.attacks = [
            {
                name: 'Energy Bloom',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Remove 3 damage counters from each of your Pokemon that has ' +
                    'any Energy attached to it.'
            }
        ];
        this.set = 'UL';
        this.name = 'Shaymin';
        this.fullName = 'Shaymin UL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_message_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const targets = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const hasEnergy = cardList.cards.some(c => c instanceof game_1.EnergyCard);
                if (hasEnergy && cardList.damage > 0) {
                    targets.push(cardList);
                }
            });
            targets.forEach(target => {
                const healEffect = new attack_effects_1.HealTargetEffect(effect, 30);
                healEffect.target = target;
                store.reduceEffect(state, healEffect);
            });
        }
        return state;
    }
}
exports.Shaymin = Shaymin;
