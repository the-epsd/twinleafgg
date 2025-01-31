"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaquavalex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Quaquavalex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Quaxwell';
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 320;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Exciting Dance',
                cost: [W],
                damage: 60,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon. If you do, switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
            },
            {
                name: 'Spiral Shot',
                cost: [W, C],
                damage: 230,
                text: 'Put 2 Energy attached to this Pokémon into your hand.'
            },
        ];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.setNumber = '52';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Quaquaval ex';
        this.fullName = 'Quaquaval ex PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = effect.opponent;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            let targets = [];
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), results => {
                targets = results || [];
                if (targets.length > 0) {
                    player.active.clearEffects();
                    player.switchPokemon(targets[0]);
                }
                const hasBench = opponent.bench.some(b => b.cards.length > 0);
                if (hasBench === false) {
                    return state;
                }
                let targets2 = [];
                store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), results => {
                    targets2 = results || [];
                    if (targets2.length > 0) {
                        opponent.active.clearEffects();
                        opponent.switchPokemon(targets2[0]);
                    }
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (!player.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, checkProvidedEnergy.energyMap, [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                player.active.moveCardsTo(cards, player.hand);
            });
        }
        return state;
    }
}
exports.Quaquavalex = Quaquavalex;
