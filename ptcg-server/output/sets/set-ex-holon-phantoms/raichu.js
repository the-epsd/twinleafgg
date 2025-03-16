"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raichu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Raichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pikachu';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Zzzap',
                cost: [C],
                damage: 20,
                text: 'Does 20 damage to each Pokémon that has any Poké-Powers or Poké-Bodies (both yours and your opponent\'s). Don\'t apply Weakness or Resistance.'
            },
            {
                name: 'Metallic Thunder',
                cost: [M, M, C],
                damage: 50,
                text: 'You may discard 2 [M] Energy attached to Raichu. If you do, this attack\'s base damage is 90 instead of 50.'
            }
        ];
        this.set = 'HP';
        this.name = 'Raichu';
        this.fullName = 'Raichu HP';
        this.setNumber = '15';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check both players' Pokémon for Poké-Powers/Bodies
            [player, opponent].forEach(currentPlayer => {
                // Check active Pokémon
                const activeCard = currentPlayer.active.getPokemonCard();
                if (activeCard) {
                    const stubPowerEffect = new game_effects_1.PowerEffect(currentPlayer, {
                        name: 'test',
                        powerType: game_1.PowerType.POKEPOWER,
                        text: ''
                    }, activeCard);
                    try {
                        store.reduceEffect(state, stubPowerEffect);
                        if (activeCard.powers.length) {
                            // Apply 20 damage without Weakness/Resistance
                            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                            damageEffect.target = currentPlayer.active;
                            store.reduceEffect(state, damageEffect);
                        }
                    }
                    catch (_a) {
                        return state;
                    }
                }
                // Check bench Pokémon
                currentPlayer.bench.forEach(bench => {
                    const benchCard = bench.getPokemonCard();
                    if (benchCard) {
                        const stubPowerEffect = new game_effects_1.PowerEffect(currentPlayer, {
                            name: 'test',
                            powerType: game_1.PowerType.POKEPOWER,
                            text: ''
                        }, benchCard);
                        try {
                            store.reduceEffect(state, stubPowerEffect);
                            if (benchCard.powers.length) {
                                // Apply 20 damage without Weakness/Resistance
                                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                                damageEffect.target = bench;
                                store.reduceEffect(state, damageEffect);
                            }
                        }
                        catch (_a) {
                            return state;
                        }
                    }
                });
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.METAL, card_types_1.CardType.METAL], { allowCancel: false }), energy => {
                        const cards = (energy || []).map(e => e.card);
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        discardEnergy.target = player.active;
                        store.reduceEffect(state, discardEnergy);
                        effect.damage += 40;
                        return state;
                    });
                }
            });
            return state;
        }
        return state;
    }
}
exports.Raichu = Raichu;
